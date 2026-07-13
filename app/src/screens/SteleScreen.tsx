/* ═══ RESHAPE 0.2 · TAG [R] reshapé — écran réel (lot 3b, remplace le stub lot 3a, absorbe Palmares.tsx) ═══
 * Cible : le monument du gang — 2 trônes (✌️/🐌) + détail par joueur (l'encoche
 * pèse) + mention GOF + on rejoue ? + une feuille passée + partager.
 * Lot : lot 3b — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md §La stèle & la feuille ·
 *   signature/ecrans/03-stele.md · signature/palmares.md (fait foi).
 * ═══════════════════════════════ */
/**
 * La stèle — le palmarès gravé d'un gang. Le vrac est filtré sur ce gang
 * (`filterByGang`) puis `computeSoireeStats` (lot 0, intouché) donne les 2
 * trônes + le détail. Rendu monolithe (ossature « bloc gravé » sombre/dense) —
 * pas la matière pierre fine (lot 4).
 *
 * « on rejoue ? » relance CE gang : seed les 4 prénoms du roster le plus
 * récent puis `resetGame(true)` (réutilise les primitives existantes du
 * store, aucune nouvelle action). Garde-fou repris de l'accueil (onAnnuler) :
 * si une AUTRE partie est en cours ailleurs, une confirmation légère évite de
 * l'écraser en silence.
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
import { filterByGang, groupBySoiree, relativeLabel, sumGofCount } from '../store/vracStorage';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { palette, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Stele'>;

/** Le roster le plus récent d'un gang — même règle que deriveGangs (accueil). */
function latestRoster(parties: GameArchive[]): GameArchive | null {
  return parties.reduce<GameArchive | null>(
    (latest, p) => (!latest || p.archivedAt > latest.archivedAt ? p : latest),
    null,
  );
}

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
  const gofTotal = useMemo(() => sumGofCount(parties), [parties]);
  const roster = useMemo(() => latestRoster(parties), [parties]);
  const pastParties = useMemo(
    () => groupBySoiree([...parties].sort((a, b) => b.archivedAt - a.archivedAt)),
    [parties],
  );

  const mondeEtrange = stats.leader !== null && stats.leader === stats.looser;

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
            LE GANG · {SEAT_ORDER.map((id) => roster.players[id].prenom).join(' · ')}
          </Text>
          <TouchableOpacity onPress={onShare} style={styles.shareBtn} hitSlop={8} disabled={sharing}>
            {sharing ? <ActivityIndicator size="small" color={palette.encre} /> : <Text style={styles.shareTxt}>partager</Text>}
          </TouchableOpacity>
        </View>

        <View ref={monumentRef} collapsable={false} style={styles.monument}>
          <View style={styles.trones}>
            <View style={styles.trone}>
              <Text style={styles.troneEmoji}>✌️</Text>
              <Text style={styles.troneNom}>{stats.leader ?? '—'}</Text>
              <Text style={styles.troneLabel}>champion</Text>
            </View>
            <View style={styles.trone}>
              <Text style={styles.troneEmoji}>🐌</Text>
              <Text style={styles.troneNom}>{stats.looser ?? '—'}</Text>
              <Text style={styles.troneLabel}>looser</Text>
            </View>
          </View>

          {mondeEtrange && <Text style={styles.mondeEtrange}>le monde étrange : {stats.leader} tient les 2 trônes</Text>}

          <View style={styles.detail}>
            {detail.map((p) => (
              <DetailRow key={p.prenom} p={p} />
            ))}
          </View>

          <Text style={styles.gof}>{gofTotal} gang-of-four{gofTotal > 1 ? 's' : ''} pour ce gang</Text>
        </View>

        <TouchableOpacity onPress={onRejouer} style={styles.revancheBtn}>
          <Text style={styles.revancheTxt}>on rejoue ?</Text>
        </TouchableOpacity>

        {pastParties.length > 0 && (
          <View style={styles.feuilles}>
            <Text style={styles.feuillesTitre}>les parties</Text>
            {pastParties.map((session) => (
              <View key={session.date}>
                {session.parties.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.feuilleRow}
                    onPress={() => navigation.navigate('Feuille', { archiveId: p.id })}
                  >
                    <Text style={styles.feuilleTxt}>{relativeLabel(p.archivedAt)}</Text>
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

function DetailRow({ p }: { p: PrenomStats }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailNom} numberOfLines={1}>{p.prenom}</Text>
      <Text style={styles.detailStat}>🏆{p.partiesGagnees}</Text>
      <Text style={styles.detailStat}>💩{p.partiesPerdues}</Text>
      <Text style={styles.detailStat}>⭐️{p.manchesGagnees}</Text>
      <Text style={styles.detailStat}>💥{p.manchesPerdues}</Text>
      <Text style={styles.detailEncoche}>／{p.brancheesDonnees}·{p.brancheesPrises}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.fondCreme },
  scroll: { padding: 20, paddingBottom: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  titre: { ...typography.chrome, flex: 1, fontSize: 13, color: palette.bordureForte },
  shareBtn: { borderWidth: 1, borderColor: palette.bordureForte, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, minWidth: 64, alignItems: 'center' },
  shareTxt: { ...typography.chrome, fontSize: 11, color: palette.bordureForte, fontWeight: '600' },

  // Rendu monolithe (ossature « bloc gravé » — pas la matière pierre fine, lot 4).
  monument: { backgroundColor: palette.encre, borderRadius: 8, padding: 20, gap: 16 },
  trones: { flexDirection: 'row', justifyContent: 'space-around' },
  trone: { alignItems: 'center', gap: 4 },
  troneEmoji: { fontSize: 32 },
  troneNom: { ...typography.proclaim, fontSize: 20, color: palette.fondCreme },
  troneLabel: { ...typography.chrome, fontSize: 11, color: 'rgba(244,241,232,0.6)' },
  mondeEtrange: { ...typography.chrome, fontSize: 12, color: palette.fondCreme, textAlign: 'center', fontStyle: 'italic' },

  detail: { borderTopWidth: 1, borderColor: 'rgba(244,241,232,0.2)', paddingTop: 12, gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailNom: { ...typography.chrome, flex: 1, fontSize: 13, color: palette.fondCreme },
  detailStat: { fontSize: 13, color: palette.fondCreme, minWidth: 34, textAlign: 'center' },
  detailEncoche: { ...typography.chrome, fontSize: 11, color: 'rgba(244,241,232,0.7)', minWidth: 44, textAlign: 'right' },

  gof: { ...typography.chrome, fontSize: 11, color: 'rgba(244,241,232,0.7)', textAlign: 'center' },

  revancheBtn: { alignSelf: 'center', marginTop: 20, backgroundColor: palette.encre, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  revancheTxt: { ...typography.proclaim, fontSize: 15, color: palette.fondCreme },

  feuilles: { marginTop: 24 },
  feuillesTitre: { ...typography.chrome, fontSize: 11, color: palette.bordureForte, marginBottom: 6 },
  feuilleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: palette.bordure },
  feuilleTxt: { ...typography.chrome, fontSize: 13, color: palette.encre },
  feuilleFleche: { color: palette.bordureForte },

  retourBtn: { alignItems: 'center', paddingVertical: 12 },
  retour: { ...typography.chrome, fontSize: 13, color: palette.bordureForte, textDecorationLine: 'underline' },
  videTxt: { ...typography.chrome, fontSize: 14, color: palette.bordureForte, textAlign: 'center', marginTop: 40, marginBottom: 16, paddingHorizontal: 24 },
});
