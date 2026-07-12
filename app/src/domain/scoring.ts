/* ═══ RESHAPE 0.2 · TAG [H] hérité ═══
 * Cible : intouché — le cœur prouvé (62 tests).
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Score & cumul — fonctions pures, testables isolément contre cas-reference-score.md.
 * Barème (livret p.10) : 0 → 0 · 1–7 ×1 · 8–10 ×2 · 11–13 ×3 · 14–15 ×4 · 16 = 80.
 */
import type { CardCount, PlayerId, Round } from './model';
import { MAX_CARDS, PLAYER_IDS, WINNING_THRESHOLD } from './model';

/** Applique le barème à un nombre de cartes restantes. Brique de base. 0 carte → 0. */
export function computeRoundScore(cardCount: CardCount): number {
  if (!Number.isInteger(cardCount) || cardCount < 0 || cardCount > MAX_CARDS) {
    throw new Error(`computeRoundScore: cartes hors bornes (0–${MAX_CARDS}) : ${cardCount}`);
  }
  if (cardCount === 0) return 0;
  if (cardCount <= 7) return cardCount; // ×1
  if (cardCount <= 10) return cardCount * 2;
  if (cardCount <= 13) return cardCount * 3;
  if (cardCount <= 15) return cardCount * 4;
  return 80; // 16 — cas fixe
}

/** Cumul par joueur = somme de computeRoundScore sur toutes les manches. */
export function computeTotals(rounds: Round[]): Record<PlayerId, number> {
  const totals = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<PlayerId, number>;
  for (const round of rounds) {
    for (const id of PLAYER_IDS) {
      totals[id] += computeRoundScore(round.cardCounts[id]);
    }
  }
  return totals;
}

/** Vrai si au moins un cumul ≥ 100 (arrêt de partie, sans écrêtage). */
export function isGameOver(totals: Record<PlayerId, number>): boolean {
  return PLAYER_IDS.some((id) => totals[id] >= WINNING_THRESHOLD);
}
