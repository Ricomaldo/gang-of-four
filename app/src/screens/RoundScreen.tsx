/**
 * Écran de manche (ambient) — jeu + fin de partie uniquement.
 * La saisie des prénoms vit désormais dans SetupScreen ; ici les prénoms sont acquis.
 *
 * Ossature : <QuadrantGrid> (2×2 partagé) de <Quadrant>/<PlayerPill>, <Hub> centré.
 * États Hub : manche 1 à jouer → "ENTRER SCORES" ; après une manche → "FIN DE MANCHE".
 * Notif qui-donne-à-qui dans la pill ; easter egg GoF sur appui long ; carnet par
 * glissé vers le haut (modal montant du bas). Fin de partie : carte vainqueur.
 */
import { useEffect, useRef, useState } from 'react';
import { Alert, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GofAnimation } from '../components/GofAnimation';
import { Hub } from '../components/Hub';
import { PlayDirection } from '../components/PlayDirection';
import { PlayerPill } from '../components/PlayerPill';
import type { PillNotif } from '../components/PlayerPill';
import { Quadrant } from '../components/Quadrant';
import { QuadrantGrid } from '../components/QuadrantGrid';
import { PLAYER_IDS, TABLE_SEATS } from '../domain/model';
import type { PlayerId } from '../domain/model';
import { directionOfPlay } from '../domain/direction';
import { computeTotals } from '../domain/scoring';
import { determineWinner, roundLastPlace, roundWinner } from '../domain/winner';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { palette, seatColors } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Round'>;

export function RoundScreen({ navigation }: Props) {
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const resetGame = useGameStore((s) => s.resetGame);

  const [cardGiven, setCardGiven] = useState(false);
  const [gofPlayer, setGofPlayer] = useState<PlayerId | null>(null);

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

  // Fin de partie : on n'ouvre plus la feuille d'office. On annonce le vainqueur sur la
  // carte de fin, avec un bouton « Voir les scores » (accès feuille FD-12 préservé, à la
  // demande) — l'annonce vient avant la grille, pas après.

  // Déclenche la frime : GofAnimation prend la main jusqu'à onDone (5 s), qui remet à null.
  const triggerGof = (id: PlayerId) => setGofPlayer(id);

  const confirmReset = () =>
    Alert.alert('Nouvelle partie', 'Rejouer avec qui ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Nouveaux joueurs',
        onPress: () => {
          resetGame(false);
          navigation.replace('Setup');
        },
      },
      {
        text: 'Mêmes joueurs',
        onPress: () => {
          resetGame(true);
          setCardGiven(false);
        },
      },
    ]);

  // Glissé vers le HAUT → carnet (cohérent avec le modal qui monte du bas).
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy < -22 && Math.abs(g.dx) < 60,
      onPanResponderRelease: (_, g) => {
        if (g.dy < -55) navigation.navigate('ScoreGrid');
      },
    }),
  ).current;

  const hubState = gofPlayer !== null ? 'gofTriggered' : rounds.length === 0 ? 'enterScores' : 'roundEnd';

  const notifFor = (id: PlayerId): PillNotif => {
    if (!inPlay) return null;
    if (id === prevWinner) return { kind: 'winner' };
    if (id === prevLast) return { kind: 'giver', given: cardGiven, onGive: () => setCardGiven(true) };
    return null;
  };

  // Haut : carte contre le bord haut, notif dessous (vers le centre). Bas : carte
  // contre le bord bas, notif dessus (vers le centre). Pills symétriques autour de l'arc.
  const cell = (id: PlayerId, row: 'top' | 'bottom') => (
    <Quadrant key={id} align="center" recede={gofPlayer !== null && gofPlayer !== id}>
      <PlayerPill
        color={seatColors[id]}
        prenom={players[id].prenom}
        score={totals[id]}
        onLongPress={() => triggerGof(id)}
        notif={notifFor(id)}
        notifPosition={row === 'top' ? 'below' : 'above'}
      />
    </Quadrant>
  );

  const overlay =
    over && winnerId !== null ? (
      <View style={styles.endCard}>
        <Text style={styles.endTitle}>⭐️ {players[winnerId].prenom} gagne</Text>
        <TouchableOpacity style={styles.seeScores} onPress={() => navigation.navigate('ScoreGrid')}>
          <Text style={styles.seeScoresText}>Voir les scores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newGame} onPress={confirmReset}>
          <Text style={styles.newGameText}>Nouvelle partie</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Hub
        state={hubState}
        gofPlayerName={gofPlayer !== null ? players[gofPlayer].prenom : undefined}
        onPress={() => {
          setCardGiven(false);
          navigation.navigate('ScoreEntry');
        }}
      />
    );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.flex} {...panResponder.panHandlers}>
        <QuadrantGrid cells={[cell(0, 'top'), cell(1, 'top'), cell(2, 'bottom'), cell(3, 'bottom')]} overlay={overlay} />

        {/* Sens de jeu : 4 flèches autour du hub, tant que la partie tourne */}
        {!over && (
          <View style={styles.dirLayer} pointerEvents="none">
            <PlayDirection direction={direction} />
          </View>
        )}

        {/* Affordance carnet (discrète) — toujours visible pour permettre de consulter
            la soirée précédente dès la 1re manche (FD-12). */}
        <TouchableOpacity style={styles.carnetHint} onPress={() => navigation.navigate('ScoreGrid')} hitSlop={12}>
          <Text style={styles.carnetLabel}>carnet</Text>
        </TouchableOpacity>

        {/* Easter egg « GANG OF FOUR ! » — frime plein écran + son, par-dessus tout. */}
        {gofPlayer !== null && (
          <GofAnimation key={gofPlayer} playerId={gofPlayer} onDone={() => setGofPlayer(null)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.fondCreme },
  flex: { flex: 1 },
  dirLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  carnetHint: { position: 'absolute', bottom: 10, alignSelf: 'center', alignItems: 'center' },
  carnetLabel: { fontSize: 11, color: palette.accentSaisie, fontWeight: '700', letterSpacing: 1 },
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
  seeScores: { backgroundColor: palette.encre, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  seeScoresText: { color: palette.fondCreme, fontSize: 16, fontWeight: '600' },
  newGame: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1.5, borderColor: palette.bordureForte },
  newGameText: { color: palette.encre, fontSize: 14, fontWeight: '600' },
});
