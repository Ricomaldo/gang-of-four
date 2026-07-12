/* ═══ RESHAPE 0.2 · TAG [†] supprimé ═══
 * Cible : éclaté : la FEUILLE (modale) [N] + la STÈLE [N].
 * Lot : lot 3 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Écran grille de score — assemble deux zones nommées : <ScoreCarnet> (la table) et
 * <Palmares> (le tableau d'honneur), + le chrome (fermeture, navigation soirée).
 * L'écran ne dessine aucune zone lui-même : il compose des composants et dérive l'état.
 *
 * Navigation soirée : glissé HORIZONTAL entre les parties du jour (le vertical est
 * réservé au dismiss du modal). Fermeture : ✕ en haut-gauche.
 */
import { useRef, useState } from 'react';
import { ActivityIndicator, Animated, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const formatFrenchDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Palmares } from '../components/Palmares';
import { ScoreCarnet } from '../components/ScoreCarnet';
import type { GameArchive } from '../domain/model';
import { useGameStore } from '../store/gameStore';
import { soireeDate } from '../store/soireeStorage';
import type { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'ScoreGrid'>;

export function ScoreGridScreen({ navigation }: Props) {
  const id = useGameStore((s) => s.id);
  const leagueId = useGameStore((s) => s.leagueId);
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const soiree = useGameStore((s) => s.soiree);

  const today = soireeDate(Date.now());
  const archivedParties: GameArchive[] = soiree && soiree.date === today ? soiree.parties : [];

  const currentArchive: GameArchive = { id, leagueId, archivedAt: Date.now(), players, rounds, status };

  // Pages du carnet : [parties archivées (ancienne→récente)] + partie en cours.
  const pages: GameArchive[] = [...archivedParties, currentArchive];
  const [pageIndex, setPageIndex] = useState(pages.length - 1); // ouvre sur la partie en cours
  const displayArchive = pages[pageIndex] ?? currentArchive;
  const isCurrent = pageIndex === pages.length - 1;

  // Toggle « détails » : révèle le score de chaque manche (+N) dans les cellules.
  const [showDetails, setShowDetails] = useState(false);

  // Partage : capture le carnet AFFICHÉ (WYSIWYG, respecte showDetails) → feuille système.
  const carnetRef = useRef<View>(null);
  // Ouvre le carnet ancré en bas : TOT visible au premier coup d'œil, scroll vers le haut pour l'historique.
  const scrollRef = useRef<ScrollView>(null);
  const [sharing, setSharing] = useState(false);
  const onShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const uri = await captureRef(carnetRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Feuille de score' });
      }
    } catch {
      // Partage annulé ou indisponible : sans effet, on ne bloque pas l'écran.
    } finally {
      setSharing(false);
    }
  };

  // Glissé HORIZONTAL → changer de partie (le vertical dismisse le modal).
  const slideX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 24 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => slideX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dx > 60) setPageIndex((i) => Math.max(0, i - 1)); // → partie plus ancienne
        else if (g.dx < -60) setPageIndex((i) => Math.min(pages.length - 1, i + 1)); // → plus récente
        Animated.spring(slideX, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  ).current;

  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn} hitSlop={12}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <Text style={styles.caption}>Soirée du {formatFrenchDate(today)}</Text>
          {pages.length > 1 && (
            <Text style={styles.partyCounter}>
              partie {pageIndex + 1}/{pages.length}{isCurrent ? ' · en cours' : ''}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setShowDetails((v) => !v)}
          style={[styles.detailsBtn, showDetails && styles.detailsBtnOn]}
          hitSlop={8}
        >
          <Text style={[styles.detailsTxt, showDetails && styles.detailsTxtOn]}>détails</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={styles.shareBtn} hitSlop={8} disabled={sharing}>
          {sharing ? (
            <ActivityIndicator size="small" color={palette.encre} />
          ) : (
            <Text style={styles.shareTxt}>partager</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Animated.View à l'intérieur du ScrollView — pattern iOS qui fonctionne :
          le PanResponder enfant peut capter le swipe horizontal avant que le
          ScrollView natif s'en empare. Couvre tout le contenu (carnet + palmarès)
          pour que le swipe soit actif sur toute la page. */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <Animated.View
          style={{ transform: [{ translateX: slideX }] }}
          {...panResponder.panHandlers}
        >
          <View ref={carnetRef} collapsable={false} style={styles.carnetCapture}>
            <ScoreCarnet archive={displayArchive} showDetails={showDetails} />
          </View>
          <Palmares parties={archivedParties} />
        </Animated.View>
      </ScrollView>

      {pages.length > 1 && (
        <Text style={styles.swipeHint}>
          {pageIndex > 0 && '‹ '}glisser pour changer de partie{pageIndex < pages.length - 1 && ' ›'}
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: palette.fondCreme, padding: 16 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 8 },
  closeBtn: { width: 36, alignItems: 'center', paddingTop: 2 },
  closeX: { fontSize: 18, color: palette.encre, fontWeight: '400' },
  detailsBtn: {
    borderWidth: 1,
    borderColor: palette.bordureForte,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  detailsBtnOn: { backgroundColor: palette.encre, borderColor: palette.encre },
  detailsTxt: { fontSize: 11, color: palette.bordureForte, fontWeight: '600' },
  detailsTxtOn: { color: palette.fondCreme },
  shareBtn: {
    borderWidth: 1,
    borderColor: palette.bordureForte,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  shareTxt: { fontSize: 11, color: palette.bordureForte, fontWeight: '600' },
  carnetCapture: { backgroundColor: palette.fondCreme, padding: 12, borderRadius: 4 },
  topCenter: { flex: 1 },
  caption: { color: palette.bordureForte, fontSize: 13 },
  partyCounter: { color: palette.bordureForte, fontSize: 11, marginTop: 2 },
  swipeHint: { textAlign: 'center', color: palette.bordureForte, fontSize: 11, paddingVertical: 6 },
});
