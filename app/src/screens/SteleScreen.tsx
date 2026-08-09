/* ═══ RESHAPE 0.2 · TAG [R] reshapé — LE PLACARD (le monolithe, 3f) ═══
 * Cible : le monument du gang — la dalle gravée : champion (gloire, sans glyphe)
 * / looser (☞, honte) + détail par joueur (colonnes P▲ P▼ M▲ M▼)
 * + socle revanche (brique). Mémoire → strictement noir/crème (+ la cicatrice).
 * (Colonne branlée ‡ et mention GOF retirées — Eric 09/08.)
 * Specs : GANG - Specs placard §Stèle (fait foi) · signature/ecrans/03-stele.md.
 * ═══════════════════════════════ */
/**
 * La stèle — le palmarès gravé d'un gang. Le vrac est filtré sur ce gang
 * (`filterByGang`) puis `computeSoireeStats` (lot 0, intouché) donne les 2 trônes
 * + le détail. Rendu monolithe : une dalle encre posée dans la pièce crème.
 * Miroir INÉGAL : la gloire crie (le plus gros corps, crème, sans glyphe), la
 * honte se lit en creux (plus bas, plus petit, gris, ☞).
 */
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PLAYER_IDS, SEAT_ORDER } from '../domain/model';
import type { GameArchive } from '../domain/model';
import { computeSoireeStats } from '../domain/stats';
import type { PrenomStats } from '../domain/stats';
import { filterByGang, groupBySoiree, relativeLabel } from '../store/vracStorage';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { fonts, palette, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Stele'>;

/** Le roster le plus récent d'un gang — même règle que deriveGangs (accueil). */
function latestRoster(parties: GameArchive[]): GameArchive | null {
  return parties.reduce<GameArchive | null>(
    (latest, p) => (!latest || p.archivedAt > latest.archivedAt ? p : latest),
    null,
  );
}

const plural = (n: number) => (n > 1 ? 's' : '');

/** « il y a 22 j » / « il y a 1 mois » — mais « aujourd'hui » et « hier » restent nus
 *  (préfixer « il y a » y serait fautif). Wrapper local : relativeLabel reste partagé
 *  avec l'accueil (GangList) sans « il y a ». */
const partieLabel = (ts: number): string => {
  const l = relativeLabel(ts);
  return l === "aujourd'hui" || l === 'hier' ? l : `il y a ${l}`;
};

export function SteleScreen({ navigation, route }: Props) {
  const { gangKey } = route.params;
  const vrac = useGameStore((s) => s.vrac);
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const setPrenom = useGameStore((s) => s.setPrenom);
  const resetGame = useGameStore((s) => s.resetGame);

  const parties = useMemo(() => filterByGang(vrac.parties, gangKey), [vrac, gangKey]);
  const stats = useMemo(() => computeSoireeStats(parties), [parties]);
  const roster = useMemo(() => latestRoster(parties), [parties]);
  const pastParties = useMemo(
    () => groupBySoiree([...parties].sort((a, b) => b.archivedAt - a.archivedAt)),
    [parties],
  );

  const mondeEtrange = stats.leader !== null && stats.leader === stats.looser;
  const leaderStats = stats.parPrenom.find((p) => p.prenom === stats.leader);
  const looserStats = stats.parPrenom.find((p) => p.prenom === stats.looser);

  const monumentRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const onShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const uri = await captureRef(monumentRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'La stèle du gang' });
      }
    } catch {
      // Partage annulé ou indisponible : sans effet, on ne bloque pas l'écran.
    } finally {
      setSharing(false);
    }
  };

  // Même prédicat que l'accueil : une partie mérite « reprise » si prénoms ou manches existent.
  const hasGameEnCours =
    status === 'en-cours' &&
    (rounds.length > 0 || PLAYER_IDS.some((id) => players[id].prenom.trim().length > 0));

  const onRejouer = () => {
    if (!roster) return;
    const start = () => {
      for (const id of PLAYER_IDS) setPrenom(id, roster.players[id].prenom);
      resetGame(true);
      navigation.navigate('Round');
    };
    if (hasGameEnCours) {
      Alert.alert('Remplacer la partie en cours ?', 'Une autre partie est en pause — elle sera perdue.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Rejouer ce gang', style: 'destructive', onPress: start },
      ]);
    } else {
      start();
    }
  };

  if (!roster) {
    // État vide — placeholder invitant (gangKey sans partie terminée, cas défensif).
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.videTxt}>ce gang n'a pas encore de partie gravée</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Accueil')} hitSlop={8}>
          <Text style={styles.retour}>← accueil</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const detail = [...stats.parPrenom].sort(
    (a, b) => b.partiesGagnees - a.partiesGagnees || b.manchesGagnees - a.manchesGagnees,
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topRow}>
          <Text style={styles.titre} numberOfLines={1}>
            {SEAT_ORDER.map((id) => roster.players[id].prenom).join(' · ')}
          </Text>
          <TouchableOpacity onPress={onShare} style={styles.shareBtn} hitSlop={8} disabled={sharing}>
            {sharing ? <ActivityIndicator size="small" color={palette.encre} /> : <Text style={styles.shareTxt}>partager</Text>}
          </TouchableOpacity>
        </View>

        {/* La dalle — le monolithe posé dans la pièce crème. */}
        <View ref={monumentRef} collapsable={false} style={styles.monument}>
          {/* LE CHAMPION — la gloire : le plus gros corps, crème, aucun glyphe. */}
          <View style={styles.champion}>
            <Text style={styles.championLabel}>LE CHAMPION</Text>
            <Text style={styles.championNom} numberOfLines={1}>{stats.leader ?? '—'}</Text>
            {leaderStats && (
              <Text style={styles.championSous}>▲ {leaderStats.partiesGagnees} partie{plural(leaderStats.partiesGagnees)} pliée{plural(leaderStats.partiesGagnees)}</Text>
            )}
          </View>

          <View style={styles.dalleDivider} />

          {/* LE LOOSER — la honte : ☞, plus bas, plus petit, gris. Jamais crié. */}
          <View style={styles.looser}>
            <Text style={styles.looserNom} numberOfLines={1}>☞ {stats.looser ?? '—'}</Text>
            <Text style={styles.looserSous}>
              le looser{looserStats ? ` · ▼ ${looserStats.partiesPerdues} fois dernier` : ''}
            </Text>
          </View>

          {mondeEtrange && <Text style={styles.mondeEtrange}>le monde étrange : {stats.leader} tient les 2 trônes</Text>}

          <View style={styles.dalleDivider} />

          {/* Le détail — colonnes P▲ P▼ M▲ M▼ (parties/manches prises·rendues).
              Colonne branlée (‡) retirée — Eric 09/08. */}
          <View style={styles.detail}>
            <View style={styles.detailHead}>
              <Text style={styles.detailNom} />
              <Text style={styles.detailHeadStat}>P▲</Text>
              <Text style={styles.detailHeadStat}>P▼</Text>
              <Text style={styles.detailHeadStat}>M▲</Text>
              <Text style={styles.detailHeadStat}>M▼</Text>
            </View>
            {detail.map((p) => (
              <DetailRow key={p.prenom} p={p} isLeader={p.prenom === stats.leader} isLooser={p.prenom === stats.looser} />
            ))}
          </View>
        </View>

        {/* Le socle = revanche : bande brique au bas de la dalle (la cicatrice qui relance). */}
        <TouchableOpacity onPress={onRejouer} style={styles.revancheBtn} activeOpacity={0.85}>
          <Text style={styles.revancheTxt}>on rejoue ?</Text>
        </TouchableOpacity>

        {pastParties.length > 0 && (
          <View style={styles.feuilles}>
            <View style={styles.feuillesHead}>
              <Text style={styles.feuillesTitre}>LES PARTIES</Text>
            </View>
            {pastParties.map((session) => (
              <View key={session.date}>
                {session.parties.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.feuilleRow}
                    onPress={() => navigation.navigate('Feuille', { archiveId: p.id })}
                  >
                    <Text style={styles.feuilleTxt}>{partieLabel(p.archivedAt)}</Text>
                    <Text style={styles.feuilleFleche}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity onPress={() => navigation.navigate('Accueil')} hitSlop={8} style={styles.retourBtn}>
        <Text style={styles.retour}>← accueil</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function DetailRow({ p, isLeader, isLooser }: { p: PrenomStats; isLeader: boolean; isLooser: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailNom, isLeader && styles.detailNomLeader]} numberOfLines={1}>
        {isLooser ? '☞ ' : ''}
        {p.prenom}
      </Text>
      <Text style={styles.detailStat}>{p.partiesGagnees}</Text>
      <Text style={[styles.detailStat, isLooser && styles.detailStatLooser]}>{p.partiesPerdues}</Text>
      <Text style={styles.detailStat}>{p.manchesGagnees}</Text>
      <Text style={styles.detailStat}>{p.manchesPerdues}</Text>
    </View>
  );
}

const LIGHT = 'rgba(242,237,224,0.22)'; // filet clair sur la dalle (le « creusé »)

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.cremePage },
  scroll: { padding: 20, paddingBottom: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  titre: { ...typography.chrome, flex: 1, fontSize: 12, letterSpacing: 1, color: palette.murmure },
  shareBtn: { borderWidth: 2, borderColor: palette.encre, paddingVertical: 4, paddingHorizontal: 12, minWidth: 66, alignItems: 'center' },
  shareTxt: { ...typography.chrome, fontSize: 11, color: palette.encre },

  // La dalle : encre, monte du bas (radius haut), filet clair en tête + drop = le relief.
  monument: {
    backgroundColor: palette.encre,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 2,
    borderTopColor: LIGHT,
    padding: 22,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  champion: { alignItems: 'center', gap: 3 },
  championLabel: { ...typography.chrome, fontSize: 11, letterSpacing: 4, color: palette.pierre },
  championNom: { fontFamily: fonts.affiche, fontSize: 52, letterSpacing: 1, color: palette.cremePage, textAlign: 'center' },
  championSous: { ...typography.chrome, fontSize: 11, letterSpacing: 1, color: palette.pierre },

  dalleDivider: { height: 1, backgroundColor: LIGHT },

  looser: { alignItems: 'center', gap: 2 },
  looserNom: { fontFamily: fonts.affiche, fontSize: 30, letterSpacing: 1, color: palette.pierre, textAlign: 'center' },
  looserSous: { ...typography.chrome, fontSize: 10, letterSpacing: 2, color: palette.brique },

  mondeEtrange: { ...typography.chrome, fontSize: 12, color: palette.cremePage, textAlign: 'center', fontStyle: 'italic' },

  detail: { gap: 7 },
  detailHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: LIGHT },
  detailHeadStat: { ...typography.chrome, fontSize: 10, letterSpacing: 1, color: palette.pierre, minWidth: 34, textAlign: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailNom: { ...typography.chrome, flex: 1, fontSize: 13, color: palette.pierre },
  detailNomLeader: { color: palette.cremePage },
  detailStat: { ...typography.chrome, fontSize: 13, color: palette.pierre, minWidth: 34, textAlign: 'center' },
  detailStatLooser: { color: palette.rougeClair },

  // Le socle revanche : bande brique pleine largeur de la dalle, Anton crème.
  revancheBtn: {
    alignSelf: 'stretch',
    backgroundColor: palette.brique,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  revancheTxt: { fontFamily: fonts.affiche, fontSize: 18, letterSpacing: 3, color: palette.cremePage },

  feuilles: { marginTop: 26 },
  feuillesHead: { borderTopWidth: 3, borderBottomWidth: 3, borderColor: palette.encre, paddingVertical: 6, marginBottom: 2 },
  feuillesTitre: { ...typography.chrome, fontSize: 11, letterSpacing: 3, color: palette.encre },
  feuilleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 4, borderBottomWidth: 1.5, borderColor: palette.encre },
  feuilleTxt: { ...typography.chrome, fontSize: 13, color: palette.encre },
  feuilleFleche: { ...typography.chrome, color: palette.murmure },

  retourBtn: { alignItems: 'center', paddingVertical: 12 },
  retour: { ...typography.chrome, fontSize: 13, color: palette.murmure, textDecorationLine: 'underline' },
  videTxt: { ...typography.chrome, fontSize: 14, color: palette.murmure, textAlign: 'center', marginTop: 40, marginBottom: 16, paddingHorizontal: 24 },
});
