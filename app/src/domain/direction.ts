/* ═══ RESHAPE 0.2 · TAG [H] hérité ═══
 * Cible : intouché — le sens de jeu (PlayDirection réintégré autour du Gong).
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Sens de jeu — dérivé du numéro de manche, display seul (aucun impact score).
 * Livret p.12 : manche 1 = anti-horaire, puis alternance stricte.
 * À ne pas confondre avec le parcours horaire fixe du départage niveau 2.
 */
import type { Direction } from './model';

export function directionOfPlay(roundNumber: number): Direction {
  if (!Number.isInteger(roundNumber) || roundNumber < 1) {
    throw new Error(`directionOfPlay: numéro de manche invalide : ${roundNumber}`);
  }
  return roundNumber % 2 === 1 ? 'anti-horaire' : 'horaire';
}
