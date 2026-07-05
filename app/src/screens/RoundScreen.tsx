/**
 * Écran de manche (ambient) — ET écran de démarrage : même layout, grille 2×2.
 * Prénoms vides → pills éditables (démarrage) ; les 4 remplis → la partie démarre
 * et le disque central « FIN DE MANCHE » apparaît. Tous les quadrants lus depuis le sud.
 *
 * Fin de partie : dès qu'un cumul ≥ 100 (statut 'terminee'), le disque est gelé et le
 * vainqueur annoncé (determineWinner). Seule sortie : « Nouvelle partie » (avec confirm).
 * L'accès à la grille se fera par glissé depuis un bord (piste B) — en attendant, un
 * bouton discret assure la navigabilité.
 */
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CenterDisc } from '../components/CenterDisc';
import { PlayerPill } from '../components/PlayerPill';
import { PLAYER_IDS, TABLE_SEATS } from '../domain/model';
import type { PlayerId } from '../domain/model';
import { directionOfPlay } from '../domain/direction';
import { computeTotals } from '../domain/scoring';
import { determineWinner } from '../domain/winner';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { palette, seatColors } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Round'>;

// Ordre de rendu de la grille 2×2 : haut-gauche, haut-droite, bas-gauche, bas-droite.
const GRID_ORDER: PlayerId[] = [0, 1, 2, 3];

export function RoundScreen({ navigation }: Props) {
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const setPrenom = useGameStore((s) => s.setPrenom);
  const resetGame = useGameStore((s) => s.resetGame);

  const namesReady = PLAYER_IDS.every((id) => players[id].prenom.trim().length > 0);
  // BUG-01 : les prénoms restent éditables tant qu'aucune manche n'est saisie (fix b) —
  // au lieu de se figer dès le 4e prénom, ce qui faisait disparaître le champ sous les doigts.
  const editable = rounds.length === 0;
  const over = status === 'terminee';

  // Cumuls dérivés (jamais stockés) ; sens de la manche à venir (numéro = manches jouées + 1).
  const totals = computeTotals(rounds);
  const direction = directionOfPlay(rounds.length + 1);
  const winnerId = over ? determineWinner(rounds, TABLE_SEATS) : null;

  // Nouvelle partie — garde-fou d'un tap (aucune sauvegarde), ratifié (Sug B).
  const confirmReset = () =>
    Alert.alert('Nouvelle partie ?', 'La partie en cours sera perdue.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Nouvelle partie', style: 'destructive', onPress: resetGame },
    ]);

  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.grid}>
        {GRID_ORDER.map((id) => (
          <View key={id} style={styles.cell}>
            <PlayerPill
              color={seatColors[id]}
              prenom={players[id].prenom}
              score={totals[id]}
              editable={editable}
              onChangePrenom={(v) => setPrenom(id, v)}
            />
          </View>
        ))}
      </View>

      {namesReady ? (
        <>
          <View style={styles.center} pointerEvents="box-none">
            {over && winnerId !== null ? (
              <View style={styles.endCard}>
                <Text style={styles.endTitle}>🏆 {players[winnerId].prenom} gagne</Text>
                <TouchableOpacity style={styles.newGame} onPress={confirmReset}>
                  <Text style={styles.newGameText}>Nouvelle partie</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <CenterDisc
                direction={direction}
                phase={rounds.length === 0 ? 'start' : 'round'}
                onPress={() => navigation.navigate('ScoreEntry')}
              />
            )}
          </View>
          <TouchableOpacity style={styles.gridLink} onPress={() => navigation.navigate('ScoreGrid')}>
            <Text style={styles.gridLinkText}>carnet ▸</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.hint}>Renseigne les 4 prénoms à leur place à table.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: palette.fondCreme },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '50%', height: '50%', padding: 16, justifyContent: 'flex-start', alignItems: 'center' },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  hint: { textAlign: 'center', color: palette.bordureForte, paddingBottom: 24, paddingHorizontal: 24 },
  gridLink: { position: 'absolute', top: 8, right: 16 },
  gridLinkText: { color: palette.bordureForte, fontSize: 13 },
  endCard: {
    backgroundColor: palette.fondPill,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: palette.encre,
    paddingVertical: 20,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 16,
  },
  endTitle: { fontSize: 22, fontWeight: '700', color: palette.encre },
  newGame: { backgroundColor: palette.encre, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  newGameText: { color: palette.fondCreme, fontSize: 16, fontWeight: '600' },
});
