/**
 * Grille de score — le carnet officiel : un tableau, rien de plus.
 * Colonnes = joueurs (pastille + initiale). Lignes = manches. Colonne de gauche =
 * sens de jeu (alterne). Ligne TOTAL = cumul. En-tête : « 1er à 100 déclenche la fin ».
 *
 * Scaffold : affiche les cartes restantes brutes stockées ; les scores dérivés et le
 * cumul (via domain/) et l'accès par glissé-depuis-un-bord viennent ensuite.
 */
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PLAYER_IDS } from '../domain/model';
import { directionOfPlay } from '../domain/direction';
import { computeRoundScore, computeTotals } from '../domain/scoring';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { palette, seatColors } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'ScoreGrid'>;

export function ScoreGridScreen({ navigation }: Props) {
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const totals = computeTotals(rounds);

  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.caption}>1er à 100 déclenche la fin</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>fermer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={[styles.row, styles.headRow]}>
          <Text style={[styles.cell, styles.dirCell]} />
          {PLAYER_IDS.map((id) => (
            <View key={id} style={[styles.cell, styles.headCell]}>
              <View style={[styles.dot, { backgroundColor: seatColors[id] }]} />
              <Text style={styles.headText}>{(players[id].prenom[0] ?? '?').toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {rounds.length === 0 ? (
          <Text style={styles.empty}>Aucune manche jouée.</Text>
        ) : (
          rounds.map((r, i) => (
            <View key={i} style={styles.row}>
              <Text style={[styles.cell, styles.dirCell]}>
                {directionOfPlay(i + 1) === 'anti-horaire' ? '←' : '→'}
              </Text>
              {PLAYER_IDS.map((id) => (
                <Text key={id} style={styles.cell}>
                  {computeRoundScore(r.cardCounts[id])}
                </Text>
              ))}
            </View>
          ))
        )}

        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.cell, styles.dirCell]}>Σ</Text>
          {PLAYER_IDS.map((id) => (
            <Text key={id} style={[styles.cell, styles.totalText]}>
              {totals[id]}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: palette.fondCreme, padding: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  caption: { color: palette.bordureForte, fontSize: 13 },
  close: { color: palette.encre, fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: palette.bordure },
  headRow: { borderBottomWidth: 2 },
  totalRow: { borderTopWidth: 2, borderBottomWidth: 0 },
  cell: { flex: 1, textAlign: 'center', paddingVertical: 12, fontSize: 18, color: palette.encre },
  dirCell: { flex: 0.6, color: palette.bordureForte },
  headCell: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  headText: { fontSize: 18, fontWeight: '700', color: palette.encre },
  dot: { width: 12, height: 12, borderRadius: 6 },
  totalText: { fontWeight: '700' },
  empty: { textAlign: 'center', color: palette.bordureForte, paddingVertical: 24 },
});
