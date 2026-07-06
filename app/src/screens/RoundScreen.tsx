/**
 * Écran de manche (ambient) + setup initial.
 *
 * Ossature : grille 2×2 de <Quadrant>, chacun accueillant une <PlayerPill> (taille
 * fixe). Le <Hub> (128px) se pose à l'intersection par-dessus. Cet écran n'assemble
 * que l'ossature et dérive l'état ; le rendu du cadran et de la pill vit dans leurs
 * composants (components/Quadrant, components/PlayerPill, components/Hub).
 *
 * Setup : pills des cadrans du bas remontées vers la médiane (keyboard-safe) ; tap
 *   READY → LayoutAnimation spring → recentrage. Hub : READY ? → ENTER SCORES.
 * Jeu : Hub "FIN DE MANCHE" + arc du sens de jeu ; notif qui-donne-à-qui dans la pill ;
 *   easter egg GoF sur appui long. Carnet : glissé vers le haut → grille (modal).
 */
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Hub } from '../components/Hub';
import { PlayerPill } from '../components/PlayerPill';
import type { PillNotif } from '../components/PlayerPill';
import { Quadrant } from '../components/Quadrant';
import { PLAYER_IDS, TABLE_SEATS } from '../domain/model';
import type { PlayerId } from '../domain/model';
import { directionOfPlay } from '../domain/direction';
import { computeTotals } from '../domain/scoring';
import { determineWinner, roundLastPlace, roundWinner } from '../domain/winner';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { palette, seatColors } from '../theme/tokens';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'Round'>;

// Cadrans par ligne : [haut-gauche, haut-droite] puis [bas-gauche, bas-droite].
const TOP_ROW: PlayerId[] = [0, 1];
const BOTTOM_ROW: PlayerId[] = [2, 3];

const SPRING_CONFIG = {
  duration: 460,
  update: { type: LayoutAnimation.Types.spring, springDamping: 0.7 },
};

export function RoundScreen({ navigation }: Props) {
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const setPrenom = useGameStore((s) => s.setPrenom);
  const resetGame = useGameStore((s) => s.resetGame);

  const [confirmedReady, setConfirmedReady] = useState(rounds.length > 0);
  const [cardGiven, setCardGiven] = useState(false);
  const [gofPlayer, setGofPlayer] = useState<PlayerId | null>(null);

  const namesReady = PLAYER_IDS.every((id) => players[id].prenom.trim().length > 0);
  const editable = !confirmedReady && rounds.length === 0;
  const inSetup = rounds.length === 0 && !confirmedReady;
  const inPlay = rounds.length > 0 && status !== 'terminee';
  const over = status === 'terminee';

  const totals = computeTotals(rounds);
  const direction = directionOfPlay(rounds.length + 1);
  const winnerId = over ? determineWinner(rounds, TABLE_SEATS) : null;

  const lastRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  const prevWinner: PlayerId | null = lastRound ? roundWinner(lastRound) : null;
  const prevLast: PlayerId | null = lastRound ? roundLastPlace(lastRound, totals, TABLE_SEATS) : null;

  // Reset de la coche « a donné sa carte » à chaque nouvelle manche.
  useEffect(() => { setCardGiven(false); }, [rounds.length]);

  const triggerGof = (id: PlayerId) => {
    setGofPlayer(id);
    setTimeout(() => setGofPlayer(null), 2000);
  };

  const handleReady = () => {
    if (!namesReady) return;
    LayoutAnimation.configureNext(SPRING_CONFIG);
    setConfirmedReady(true);
  };

  const confirmReset = () =>
    Alert.alert('Nouvelle partie', 'Rejouer avec qui ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Nouveaux joueurs',
        onPress: () => {
          LayoutAnimation.configureNext(SPRING_CONFIG);
          resetGame(false);
          setConfirmedReady(false);
          setCardGiven(false);
        },
      },
      {
        text: 'Mêmes joueurs',
        onPress: () => {
          resetGame(true);
          setConfirmedReady(true);
          setCardGiven(false);
        },
      },
    ]);

  // Glissé vers le HAUT → carnet (cohérent avec le modal qui monte du bas).
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy < -22 && Math.abs(g.dx) < 60,
      onPanResponderRelease: (_, g) => {
        if (g.dy < -55 && !inSetup) navigation.navigate('ScoreGrid');
      },
    }),
  ).current;

  const hubState =
    gofPlayer !== null ? 'gofTriggered' :
    over ? 'roundEnd' :
    rounds.length > 0 ? 'roundEnd' :
    confirmedReady ? 'enterScores' :
    'ready';

  const notifFor = (id: PlayerId): PillNotif => {
    if (!inPlay) return null;
    if (id === prevWinner) return { kind: 'winner' };
    if (id === prevLast) return { kind: 'giver', given: cardGiven, onGive: () => setCardGiven(true) };
    return null;
  };

  const renderQuadrant = (id: PlayerId, isBottom: boolean) => (
    <Quadrant key={id} align={inSetup && isBottom ? 'top' : 'center'}>
      <PlayerPill
        color={seatColors[id]}
        prenom={players[id].prenom}
        score={totals[id]}
        editable={editable}
        onChangePrenom={(v) => setPrenom(id, v)}
        onLongPress={!editable ? () => triggerGof(id) : undefined}
        notif={notifFor(id)}
      />
    </Quadrant>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.row}>{TOP_ROW.map((id) => renderQuadrant(id, false))}</View>
        <View style={styles.row}>{BOTTOM_ROW.map((id) => renderQuadrant(id, true))}</View>

        {/* Hub à l'intersection des 4 cadrans */}
        <View style={styles.hubArea} pointerEvents="box-none">
          {over && winnerId !== null ? (
            <View style={styles.endCard}>
              <Text style={styles.endTitle}>🏆 {players[winnerId].prenom} gagne</Text>
              <TouchableOpacity style={styles.newGame} onPress={confirmReset}>
                <Text style={styles.newGameText}>Nouvelle partie</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Hub
              state={hubState}
              direction={direction}
              gofPlayerName={gofPlayer !== null ? players[gofPlayer].prenom : undefined}
              disabled={hubState === 'ready' && !namesReady}
              onPress={() => {
                if (hubState === 'ready') {
                  handleReady();
                } else {
                  setCardGiven(false);
                  navigation.navigate('ScoreEntry');
                }
              }}
            />
          )}
        </View>

        {/* Affordance carnet (discrète, seulement en jeu) */}
        {inPlay && (
          <TouchableOpacity
            style={styles.carnetHint}
            onPress={() => navigation.navigate('ScoreGrid')}
            hitSlop={10}
          >
            <Text style={styles.carnetArrow}>↑</Text>
            <Text style={styles.carnetLabel}>carnet</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.fondCreme },
  container: { flex: 1, padding: 8 },
  row: { flex: 1, flexDirection: 'row' },
  hubArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carnetHint: { position: 'absolute', bottom: 10, alignSelf: 'center', alignItems: 'center' },
  carnetArrow: { fontSize: 16, color: palette.accentSaisie, lineHeight: 16, fontWeight: '700' },
  carnetLabel: { fontSize: 9, color: palette.accentSaisie, fontWeight: '700', letterSpacing: 1 },
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
