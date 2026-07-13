/* ═══ RESHAPE 0.2 · TAG [R] reshapé — écran réel (lot 3b, remplace le stub lot 3a) ═══
 * Cible : la modale feuille — titre-session, la grille (crayon/gravé, l'encoche
 * qui pèse), partager (WYSIWYG, à tout moment).
 * Lot : lot 3b — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md §La stèle & la feuille ·
 *   signature/ecrans/04-feuille.md · specs/specs-partage.md (fait foi).
 * ═══════════════════════════════ */
/**
 * La feuille — modale montée par glissé (presentation: 'modal', App.tsx). Sans
 * `archiveId` : la partie en cours (Round, lue au store). Avec `archiveId` :
 * une partie passée du gang (stèle, lue au vrac). Le partage capture la vue
 * affichée telle quelle (WYSIWYG) via react-native-view-shot + expo-sharing —
 * même mécanique que l'ex-ScoreGridScreen (supprimé, éclaté ici + en stèle).
 */
import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feuille } from '../components/Feuille';
import type { GameArchive } from '../domain/model';
import { useGameStore } from '../store/gameStore';
import { findArchive } from '../store/vracStorage';
import type { RootStackParamList } from '../navigation/types';
import { palette, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Feuille'>;

/** « Établi · 8 juin » — pas d'année (le contexte hors-app suffit, cf. specs-partage). */
function formatSessionDate(ts: number): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(ts));
}

export function FeuilleScreen({ navigation, route }: Props) {
  const archiveId = route.params?.archiveId;
  const vrac = useGameStore((s) => s.vrac);
  const currentId = useGameStore((s) => s.id);
  const leagueId = useGameStore((s) => s.leagueId);
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const gofCount = useGameStore((s) => s.gofCount);

  const pastArchive = archiveId ? findArchive(vrac.parties, archiveId) : undefined;
  const archive: GameArchive =
    pastArchive ?? {
      id: currentId,
      leagueId,
      archivedAt: Date.now(),
      players,
      rounds,
      status,
      gofCount,
    };
  // Sealed dès que status === 'terminee' (au vrac, ou en mémoire juste après le
  // final — cf. gameStore.addRound) : plus de matière crayon à afficher.
  const isLive = archive.status !== 'terminee';

  const titre = isLive ? formatSessionDate(archive.archivedAt) : `Établi · ${formatSessionDate(archive.archivedAt)}`;

  const captureZone = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const onShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const uri = await captureRef(captureZone, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Feuille de score' });
      }
    } catch {
      // Partage annulé ou indisponible : sans effet, on ne bloque pas l'écran.
    } finally {
      setSharing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} style={styles.closeBtn}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.titre} numberOfLines={1}>{titre}</Text>
        <TouchableOpacity onPress={onShare} style={styles.shareBtn} hitSlop={8} disabled={sharing}>
          {sharing ? <ActivityIndicator size="small" color={palette.encre} /> : <Text style={styles.shareTxt}>partager</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View ref={captureZone} collapsable={false} style={styles.capture}>
          <Feuille archive={archive} isLive={isLive} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.fondCreme },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  closeBtn: { width: 32 },
  closeX: { fontSize: 18, color: palette.encre },
  titre: { ...typography.proclaim, flex: 1, fontSize: 16, color: palette.encre, textAlign: 'center' },
  shareBtn: { borderWidth: 1, borderColor: palette.bordureForte, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, minWidth: 64, alignItems: 'center' },
  shareTxt: { ...typography.chrome, fontSize: 11, color: palette.bordureForte, fontWeight: '600' },
  scroll: { padding: 16 },
  capture: { backgroundColor: palette.fondCreme, padding: 8, borderRadius: 4 },
});
