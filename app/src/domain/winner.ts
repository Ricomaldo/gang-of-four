/**
 * Gagnant de manche & vainqueur de partie — fonctions pures.
 * Départage : règle maison d'Eric (absente du livret), 2 niveaux, voir cas-reference-score.md.
 * Décomposé pour rester testable une fonction à la fois.
 */
import type { CardCount, PlayerId, Round, Seats } from './model';
import { MAX_CARDS, PLAYER_IDS } from './model';
import { computeRoundScore, computeTotals, isGameOver } from './scoring';

/** Le joueur à 0 carte ce tour-là (unique par manche). */
export function roundWinner(round: Round): PlayerId {
  const zeros = PLAYER_IDS.filter((id) => round.cardCounts[id] === 0);
  if (zeros.length !== 1) {
    throw new Error(`roundWinner: une manche a exactement un joueur à 0 carte (trouvé ${zeros.length})`);
  }
  return zeros[0];
}

/**
 * Garde de saisie d'une manche (BUG-02) — pendant non-throwing de la précondition de
 * roundWinner. Vrai ssi exactement un joueur est à 0 (le gagnant) et tous les comptes
 * sont entiers dans [0, MAX_CARDS]. Empêche à la source une manche impossible (aucun
 * ou plusieurs gagnants), donc le throw de fin de partie.
 */
export function isValidRoundInput(cardCounts: Record<PlayerId, CardCount>): boolean {
  const counts = PLAYER_IDS.map((id) => cardCounts[id]);
  const allInRange = counts.every((c) => Number.isInteger(c) && c >= 0 && c <= MAX_CARDS);
  const zeros = counts.filter((c) => c === 0).length;
  return allInRange && zeros === 1;
}

/** Les joueurs à égalité sur le cumul le plus bas. */
export function lowestTotalCandidates(totals: Record<PlayerId, number>): PlayerId[] {
  const min = Math.min(...PLAYER_IDS.map((id) => totals[id]));
  return PLAYER_IDS.filter((id) => totals[id] === min);
}

/** Départage niveau 1 : parmi les candidats, ceux ayant le plus petit score à la dernière manche. */
export function tiebreakByLastRoundScore(candidates: PlayerId[], lastRound: Round): PlayerId[] {
  const score = (id: PlayerId) => computeRoundScore(lastRound.cardCounts[id]);
  const min = Math.min(...candidates.map(score));
  return candidates.filter((id) => score(id) === min);
}

/** Départage niveau 2 : le plus proche, en sens horaire, du gagnant de la dernière manche. Tranche toujours. */
export function tiebreakBySeatProximity(
  candidates: PlayerId[],
  seats: Seats,
  roundWinnerSeat: number,
): PlayerId {
  const n = PLAYER_IDS.length;
  // Distance horaire depuis le gagnant de la manche (0 = lui-même, jamais un candidat à ce niveau).
  const distance = (id: PlayerId) => (seats[id] - roundWinnerSeat + n) % n;
  let best = candidates[0];
  for (const id of candidates) {
    if (distance(id) < distance(best)) best = id;
  }
  return best;
}

/** Orchestration : totals → arrêt → cumul le plus bas → départage niveau 1 → niveau 2. */
export function determineWinner(rounds: Round[], seats: Seats): PlayerId {
  const totals = computeTotals(rounds);
  if (!isGameOver(totals)) {
    throw new Error('determineWinner: partie non terminée (aucun cumul ≥ 100)');
  }
  let candidates = lowestTotalCandidates(totals);
  if (candidates.length === 1) return candidates[0];

  const lastRound = rounds[rounds.length - 1];
  candidates = tiebreakByLastRoundScore(candidates, lastRound);
  if (candidates.length === 1) return candidates[0];

  return tiebreakBySeatProximity(candidates, seats, seats[roundWinner(lastRound)]);
}
