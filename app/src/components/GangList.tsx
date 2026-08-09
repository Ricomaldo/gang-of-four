/* ═══ RESHAPE 0.2 · TAG [N] neuf ═══
 * Cible : « tes gangs » — dérivé du vrac, roster-scoped, zéro écran de gestion.
 * Lot : lot 3a — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md §L'accueil · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * GangList — la liste des rosters joués (accueil, sous le disque-GANG).
 * Chaque gang montré par ses 4 prénoms (pas de nom, pas de baptême) + un temps
 * relatif gros grain. Tap → sa stèle (fourche 12 : nav câblée, écran = lot 3b).
 * Appui long → masque le roster (retiré de la liste, ses feuilles restent au
 * vrac). « + N gangs masqués » en pied de liste révèle tout sans jouer — pas
 * d'écran de gestion, pas de toggle par gang.
 */
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import type { GangSummary } from '../store/vracStorage';
import { relativeLabel } from '../store/vracStorage';
import { SEAT_ORDER } from '../domain/model';
import { fonts, palette, typography } from '../theme/tokens';

type Props = {
  gangs: GangSummary[]; // déjà filtrés des masqués, triés du plus récent au plus ancien
  maskedCount: number;
  onTapGang: (key: string) => void;
  onMasquer: (key: string) => void;
  onRevelerMasques: () => void;
};

// La section réserve TOUJOURS 4 slots de hauteur (remplis ou vides) — la mise en
// page ne saute pas d'un écran à l'autre. Au-delà de 4 gangs, le corps devient un
// scroll vertical qui garde la même fenêtre de 4 slots.
const SLOTS = 4;
const SLOT_H = 48;
const BODY_H = SLOTS * SLOT_H;

export function GangList({ gangs, maskedCount, onTapGang, onMasquer, onRevelerMasques }: Props) {
  if (gangs.length === 0 && maskedCount === 0) return null;

  const scrollable = gangs.length > SLOTS;
  const emptyCount = Math.max(0, SLOTS - gangs.length);

  const rows = gangs.map((g, i) => {
    // Le dernier joué (le plus récent) = bande inversée, prêt pour la revanche.
    const recent = i === 0;
    const label = SEAT_ORDER.map((id) => g.players[id].prenom).join(' · ');
    return (
      // La ligne est une View simple (PAS un Pressable) : un Pressable parent
      // gagnait le responder sur le glissement horizontal et TUAIT le scroll.
      // Le tap/longPress est porté par les Pressables INTÉRIEURS (noms + date).
      <View key={g.key} style={[styles.row, recent ? styles.rowRecent : styles.rowNormal]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <Pressable
            onPress={() => onTapGang(g.key)}
            onLongPress={() => onMasquer(g.key)}
            style={({ pressed }) => [styles.prenomsHit, pressed && styles.pressed]}
          >
            <Text style={[styles.prenoms, recent && styles.prenomsRecent, recent && styles.textInverse]}>
              {label}
            </Text>
          </Pressable>
        </ScrollView>
        <Pressable onPress={() => onTapGang(g.key)} onLongPress={() => onMasquer(g.key)} hitSlop={6}>
          <Text style={[styles.temps, recent && styles.tempsInverse]}>{relativeLabel(g.lastPlayedAt)}</Text>
        </Pressable>
      </View>
    );
  });

  // Slots vides pour compléter jusqu'à 4 (lignes réglées, sans contenu).
  const fillers = Array.from({ length: emptyCount }, (_, k) => (
    <View key={`empty-${k}`} style={[styles.row, styles.rowNormal]} />
  ));

  return (
    <View style={styles.wrap}>
      {/* Titre centré flanqué de deux filets 3px (placard §04). */}
      <View style={styles.header}>
        <View style={styles.filet} />
        <Text style={styles.titre}>TES GANGS</Text>
        <View style={styles.filet} />
      </View>
      {scrollable ? (
        <ScrollView style={styles.body} nestedScrollEnabled showsVerticalScrollIndicator>
          {rows}
        </ScrollView>
      ) : (
        <View style={styles.body}>
          {rows}
          {fillers}
        </View>
      )}
      {maskedCount > 0 && (
        <TouchableOpacity onPress={onRevelerMasques} style={styles.masquesRow} hitSlop={8}>
          <Text style={styles.masquesTxt}>
            + {maskedCount} gang{maskedCount > 1 ? 's' : ''} masqué{maskedCount > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Pleine largeur (le bloc est full-bleed, wireframe §04 : padding:0 0 22px) :
  // filets et cartouche noir courent au bord (inset 20, pas 24) — Eric les voulait
  // plus larges.
  wrap: { paddingTop: 8, paddingBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 10 },
  filet: { flex: 1, height: 3, backgroundColor: palette.encre },
  titre: { fontFamily: fonts.monoBold, letterSpacing: 4, fontSize: 12, color: palette.encre },
  body: { height: BODY_H }, // fenêtre fixe de 4 slots (remplis, vides ou scrollés)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SLOT_H, // hauteur fixe : slots remplis et vides identiques
    paddingHorizontal: 20,
  },
  rowRecent: { backgroundColor: palette.encre },
  rowNormal: { borderBottomWidth: 1.5, borderBottomColor: palette.encre },
  scroll: { flex: 1, marginRight: 8 },
  scrollContent: { flexGrow: 1, alignItems: 'center' }, // flexGrow tue la zone morte à droite d'un nom court
  prenomsHit: { flexGrow: 1, justifyContent: 'center' }, // remplit le viewport → tappable partout
  prenoms: { ...typography.chrome, fontSize: 15, color: palette.encre },
  prenomsRecent: { fontFamily: fonts.monoBold },
  pressed: { opacity: 0.7 },
  temps: { ...typography.chrome, fontSize: 11, color: palette.murmure },
  textInverse: { color: palette.cremePage },
  tempsInverse: { color: palette.estompe }, // wireframe : #B7AF9E sur la bande noire
  masquesRow: { paddingVertical: 10, alignItems: 'center' },
  masquesTxt: { ...typography.chrome, fontSize: 11, color: palette.murmure, textDecorationLine: 'underline' },
});
