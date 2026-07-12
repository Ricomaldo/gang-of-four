/* ═══ RESHAPE 0.2 · TAG [H] hérité ═══
 * Cible : intouché — le cœur prouvé (62 tests).
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
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

/**
 * Le joueur avec le plus de cartes à cette manche (le "dernier").
 * En cas d'égalité sur le max de cartes :
 *   L1 — le plus grand cumul (plus de pts = plus en difficulté)
 *   L2 — le plus proche du gagnant de la manche en sens ANTI-horaire
 * Règle maison validée par Eric (2026-07-06).
 */
export function roundLastPlace(round: Round, totals: Record<PlayerId, number>, seats: Seats): PlayerId {
  const maxCount = Math.max(...PLAYER_IDS.map((id) => round.cardCounts[id]));
  let candidates = PLAYER_IDS.filter((id) => round.cardCounts[id] === maxCount);
  if (candidates.length === 1) return candidates[0];

  // L1 : le plus grand cumul
  const maxTotal = Math.max(...candidates.map((id) => totals[id]));
  candidates = candidates.filter((id) => totals[id] === maxTotal);
  if (candidates.length === 1) return candidates[0];

  // L2 : le plus proche du gagnant en sens anti-horaire
  const winner = roundWinner(round);
  const winnerSeat = seats[winner];
  const n = PLAYER_IDS.length;
  const antiDist = (id: PlayerId) => (winnerSeat - seats[id] + n) % n;
  let best = candidates[0];
  for (const id of candidates) {
    if (antiDist(id) < antiDist(best)) best = id;
  }
  return best;
}

/** Nombre de manches gagnées par joueur sur l'ensemble des manches. */
export function manchesGagnees(rounds: Round[]): Record<PlayerId, number> {
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<PlayerId, number>;
  for (const r of rounds) {
    counts[roundWinner(r)]++;
  }
  return counts;
}

/** Les joueurs à égalité sur le cumul le plus HAUT (symétrique de lowestTotalCandidates). */
export function highestTotalCandidates(totals: Record<PlayerId, number>): PlayerId[] {
  const max = Math.max(...PLAYER_IDS.map((id) => totals[id]));
  return PLAYER_IDS.filter((id) => totals[id] === max);
}

/** Départage perdant niveau 1 : parmi les candidats, ceux au plus GRAND score à la dernière manche. */
export function tiebreakByHighestLastRoundScore(candidates: PlayerId[], lastRound: Round): PlayerId[] {
  const score = (id: PlayerId) => computeRoundScore(lastRound.cardCounts[id]);
  const max = Math.max(...candidates.map(score));
  return candidates.filter((id) => score(id) === max);
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

/**
 * Perdant de la partie = cumul final le plus HAUT. Symétrique de determineWinner :
 *   L1 — le plus GRAND score à la dernière manche (le plus de cartes ce tour-là)
 *   L2 — le plus proche du gagnant de la dernière manche en sens ANTI-horaire
 * Le livret (cas-reference-score.md) ne tranche que le vainqueur ; le départage du
 * perdant est un défaut symétrique (comme roundLastPlace) — à confirmer par Eric.
 */
export function gameLoser(rounds: Round[], seats: Seats): PlayerId {
  const totals = computeTotals(rounds);
  if (!isGameOver(totals)) {
    throw new Error('gameLoser: partie non terminée (aucun cumul ≥ 100)');
  }
  let candidates = highestTotalCandidates(totals);
  if (candidates.length === 1) return candidates[0];

  const lastRound = rounds[rounds.length - 1];
  candidates = tiebreakByHighestLastRoundScore(candidates, lastRound);
  if (candidates.length === 1) return candidates[0];

  // L2 : plus proche du gagnant de la dernière manche en sens anti-horaire.
  const winnerSeat = seats[roundWinner(lastRound)];
  const n = PLAYER_IDS.length;
  const antiDist = (id: PlayerId) => (winnerSeat - seats[id] + n) % n;
  let best = candidates[0];
  for (const id of candidates) {
    if (antiDist(id) < antiDist(best)) best = id;
  }
  return best;
}
