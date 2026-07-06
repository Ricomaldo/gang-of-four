/**
 * Écran grille de score — assemble deux zones nommées : <ScoreCarnet> (la table) et
 * <Palmares> (le tableau d'honneur), + le chrome (fermeture, navigation soirée).
 * L'écran ne dessine aucune zone lui-même : il compose des composants et dérive l'état.
 *
 * Navigation soirée : glissé HORIZONTAL entre les parties du jour (le vertical est
 * réservé au dismiss du modal). Fermeture : ✕ en haut-gauche.
 */
import { useRef, useState } from 'react';
import { Animated, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const soiree = useGameStore((s) => s.soiree);

  const today = soireeDate(Date.now());
  const archivedParties: GameArchive[] = soiree && soiree.date === today ? soiree.parties : [];

  const currentArchive: GameArchive = { archivedAt: Date.now(), players, rounds, status };

  // Pages du carnet : [parties archivées (ancienne→récente)] + partie en cours.
  const pages: GameArchive[] = [...archivedParties, currentArchive];
  const [pageIndex, setPageIndex] = useState(pages.length - 1); // ouvre sur la partie en cours
  const displayArchive = pages[pageIndex] ?? currentArchive;
  const isCurrent = pageIndex === pages.length - 1;

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
          <Text style={styles.caption}>1er à 100 déclenche la fin</Text>
          {pages.length > 1 && (
            <Text style={styles.partyCounter}>
              partie {pageIndex + 1}/{pages.length}{isCurrent ? ' · en cours' : ''}
            </Text>
          )}
        </View>
        <View style={styles.closeBtn} />
      </View>

      <Animated.View style={{ flex: 1, transform: [{ translateX: slideX }] }} {...panResponder.panHandlers}>
        <ScrollView>
          <ScoreCarnet archive={displayArchive} />
          <Palmares archive={displayArchive} />
        </ScrollView>
      </Animated.View>

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
  topCenter: { flex: 1 },
  caption: { color: palette.bordureForte, fontSize: 13 },
  partyCounter: { color: palette.bordureForte, fontSize: 11, marginTop: 2 },
  swipeHint: { textAlign: 'center', color: palette.bordureForte, fontSize: 11, paddingVertical: 6 },
});
