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
import { fonts, palette, typography } from '../theme/tokens';

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
  const requestCorrect = useGameStore((s) => s.requestCorrect);

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
  const [showDetails, setShowDetails] = useState(false);
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
      {/* Entête : bande noire pleine largeur, titre Anton crème + ✕. */}
      <View style={styles.entete}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} style={styles.closeBtn}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.titre} numberOfLines={1}>{titre}</Text>
        <View style={styles.closeBtn} />
      </View>

      {/* Filtre détails : hors de la zone de capture — le partage suit le mode affiché. */}
      <View style={styles.filtreBar}>
        <TouchableOpacity onPress={() => setShowDetails((v) => !v)} hitSlop={8} style={styles.filtreBtn}>
          <Text style={styles.filtreTxt}>{showDetails ? '✓ DÉTAILS' : 'DÉTAILS'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View ref={captureZone} collapsable={false} style={styles.capture}>
          <Feuille
            archive={archive}
            isLive={isLive}
            showDetails={showDetails}
            // Solution B : uniquement la partie EN COURS (pas une archive du vrac).
            // La feuille signale la correction, se referme ; le Round rouvre la saisie.
            onCorrigerDerniere={
              archiveId ? undefined : () => { requestCorrect(); navigation.goBack(); }
            }
          />
        </View>
      </ScrollView>

      {/* Partager : bande noire pleine largeur en bas (capture WYSIWYG de la feuille). */}
      <TouchableOpacity style={styles.partager} onPress={onShare} disabled={sharing} activeOpacity={0.85}>
        {sharing ? (
          <ActivityIndicator size="small" color={palette.cremePage} />
        ) : (
          <Text style={styles.partagerTxt}>PARTAGER</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.cremePage },
  entete: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.encre, paddingHorizontal: 16, paddingVertical: 12 },
  closeBtn: { width: 32 },
  closeX: { ...typography.chrome, fontSize: 18, color: palette.cremePage },
  titre: { fontFamily: fonts.affiche, flex: 1, fontSize: 20, letterSpacing: 1, color: palette.cremePage, textAlign: 'center', textTransform: 'uppercase' },
  filtreBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 12 },
  filtreBtn: { borderWidth: 1, borderColor: palette.encre, paddingHorizontal: 10, paddingVertical: 5 },
  filtreTxt: { ...typography.chrome, fontSize: 11, letterSpacing: 1, color: palette.encre },
  scroll: { padding: 16 },
  capture: { backgroundColor: palette.cremePage, padding: 8 },
  partager: { backgroundColor: palette.encre, paddingVertical: 14, alignItems: 'center' },
  partagerTxt: { ...typography.chrome, fontSize: 12, letterSpacing: 2, color: palette.cremePage },
});
