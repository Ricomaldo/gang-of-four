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
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import type { GangSummary } from '../store/vracStorage';
import { relativeLabel } from '../store/vracStorage';
import { SEAT_ORDER } from '../domain/model';
import { palette, typography } from '../theme/tokens';

type Props = {
  gangs: GangSummary[]; // déjà filtrés des masqués, triés du plus récent au plus ancien
  maskedCount: number;
  onTapGang: (key: string) => void;
  onMasquer: (key: string) => void;
  onRevelerMasques: () => void;
};

export function GangList({ gangs, maskedCount, onTapGang, onMasquer, onRevelerMasques }: Props) {
  if (gangs.length === 0 && maskedCount === 0) return null;

  return (
    <View style={styles.wrap}>
      {/* Entête entre deux traits 3px (placard §04). */}
      <View style={styles.header}>
        <Text style={styles.titre}>TES GANGS</Text>
      </View>
      {gangs.map((g, i) => {
        // Le dernier joué (le plus récent) = bande inversée, prêt pour la revanche.
        const recent = i === 0;
        return (
          <TouchableOpacity
            key={g.key}
            style={[styles.row, recent ? styles.rowRecent : styles.rowNormal]}
            onPress={() => onTapGang(g.key)}
            onLongPress={() => onMasquer(g.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.prenoms, recent && styles.textInverse]} numberOfLines={1}>
              {SEAT_ORDER.map((id) => g.players[id].prenom).join(' · ')}
            </Text>
            <Text style={[styles.temps, recent && styles.tempsInverse]}>{relativeLabel(g.lastPlayedAt)}</Text>
          </TouchableOpacity>
        );
      })}
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
  wrap: { paddingHorizontal: 24, paddingTop: 8 },
  header: { borderTopWidth: 3, borderBottomWidth: 3, borderColor: palette.encre, paddingVertical: 7, marginBottom: 2 },
  titre: { ...typography.chrome, fontSize: 11, letterSpacing: 3, color: palette.encre },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  rowRecent: { backgroundColor: palette.encre },
  rowNormal: { borderBottomWidth: 1.5, borderBottomColor: palette.encre },
  prenoms: { ...typography.chrome, fontSize: 15, color: palette.encre, flexShrink: 1, marginRight: 8 },
  temps: { ...typography.chrome, fontSize: 11, color: palette.murmure },
  textInverse: { color: palette.cremePage },
  tempsInverse: { color: palette.pierre },
  masquesRow: { paddingVertical: 10, alignItems: 'center' },
  masquesTxt: { ...typography.chrome, fontSize: 11, color: palette.murmure, textDecorationLine: 'underline' },
});
