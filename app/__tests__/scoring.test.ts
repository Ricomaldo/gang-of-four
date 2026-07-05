/**
 * Contrat de la brique « Prouver la justesse » (grille.md).
 * Cas dérivés de app/docs/cas-reference-score.md — la logique de domain/ doit les
 * passer à 100 % avant d'être éprouvée en partie live.
 */
import { MAX_CARDS, WINNING_THRESHOLD } from '../src/domain/model';
import type { PlayerId, Round, Seats } from '../src/domain/model';
import { computeRoundScore, computeTotals, isGameOver } from '../src/domain/scoring';
import { directionOfPlay } from '../src/domain/direction';
import {
  determineWinner,
  isValidRoundInput,
  lowestTotalCandidates,
  roundWinner,
  tiebreakByLastRoundScore,
  tiebreakBySeatProximity,
} from '../src/domain/winner';

/** Construit une manche à partir des cartes restantes (J1, J2, J3, J4). */
const round = (a: number, b: number, c: number, d: number): Round => ({
  cardCounts: { 0: a, 1: b, 2: c, 3: d },
});

// Sièges de référence : ordre horaire J1 → J2 → J3 → J4 (cas-reference-score.md).
const SEATS: Seats = { 0: 0, 1: 1, 2: 2, 3: 3 };

describe('modèle — constantes ancrées sur les docs', () => {
  it('borne haute de cartes = 16, seuil de fin = 100', () => {
    expect(MAX_CARDS).toBe(16);
    expect(WINNING_THRESHOLD).toBe(100);
  });
});

describe('computeRoundScore — barème & cas-limites de paliers', () => {
  const cases: [number, number][] = [
    [0, 0], [1, 1], [5, 5], [7, 7], // ×1
    [8, 16], [9, 18], [10, 20], // ×2
    [11, 33], [13, 39], // ×3
    [14, 56], [15, 60], // ×4
    [16, 80], // fixe
  ];
  it.each(cases)('%i carte(s) → %i pts', (cards, expected) => {
    expect(computeRoundScore(cards)).toBe(expected);
  });
  it('rejette hors bornes (négatif ou > 16)', () => {
    expect(() => computeRoundScore(-1)).toThrow();
    expect(() => computeRoundScore(17)).toThrow();
  });
});

describe('directionOfPlay — dérivé du numéro de manche', () => {
  it('manche 1 anti-horaire, puis alternance stricte', () => {
    expect(directionOfPlay(1)).toBe('anti-horaire');
    expect(directionOfPlay(2)).toBe('horaire');
    expect(directionOfPlay(3)).toBe('anti-horaire');
    expect(directionOfPlay(4)).toBe('horaire');
  });
});

describe('roundWinner — le joueur à 0 carte', () => {
  it('identifie l\'unique joueur à 0', () => {
    expect(roundWinner(round(9, 9, 0, 16))).toBe(2);
  });
  it('exige exactement un joueur à 0', () => {
    expect(() => roundWinner(round(1, 2, 3, 4))).toThrow();
    expect(() => roundWinner(round(0, 0, 3, 4))).toThrow();
  });
});

describe('isValidRoundInput — garde de saisie (BUG-02)', () => {
  it('accepte exactement un joueur à 0', () => {
    expect(isValidRoundInput(round(0, 5, 9, 2).cardCounts)).toBe(true);
  });
  it('refuse une manche sans gagnant (aucun joueur à 0)', () => {
    expect(isValidRoundInput(round(1, 5, 9, 2).cardCounts)).toBe(false);
  });
  it('refuse plusieurs joueurs à 0', () => {
    expect(isValidRoundInput(round(0, 0, 9, 2).cardCounts)).toBe(false);
  });
  it('refuse hors bornes (négatif ou > 16)', () => {
    expect(isValidRoundInput(round(0, 5, 9, 17).cardCounts)).toBe(false);
    expect(isValidRoundInput(round(0, 5, 9, -1).cardCounts)).toBe(false);
  });
});

describe('computeTotals — cumul de manche en manche', () => {
  it('accumule la table de référence', () => {
    const rounds = [round(0, 5, 9, 2), round(3, 0, 6, 12)];
    expect(computeTotals(rounds)).toEqual({ 0: 3, 1: 5, 2: 24, 3: 38 });
  });
});

describe('isGameOver — arrêt à 100', () => {
  it('faux sous 100', () => {
    expect(isGameOver({ 0: 3, 1: 5, 2: 24, 3: 38 })).toBe(false);
  });
  it('vrai dès qu\'un cumul atteint/dépasse 100 (sans écrêtage)', () => {
    expect(isGameOver({ 0: 88, 1: 88, 2: 88, 3: 100 })).toBe(true);
    expect(isGameOver({ 0: 47, 1: 10, 2: 20, 3: 107 })).toBe(true);
  });
  it('vrai au double franchissement', () => {
    expect(isGameOver({ 0: 100, 1: 130, 2: 40, 3: 50 })).toBe(true);
  });
});

describe('lowestTotalCandidates', () => {
  it('un seul plus bas', () => {
    expect(lowestTotalCandidates({ 0: 3, 1: 5, 2: 24, 3: 38 })).toEqual([0]);
  });
  it('égalité multiple au plus bas', () => {
    expect(lowestTotalCandidates({ 0: 88, 1: 88, 2: 88, 3: 100 })).toEqual([0, 1, 2]);
  });
});

describe('tiebreak — briques de départage', () => {
  it('niveau 1 : plus petit score à la dernière manche', () => {
    // dernière manche 9/9/0/16 → scores 18/18/0/80
    expect(tiebreakByLastRoundScore([0, 1, 2], round(9, 9, 0, 16))).toEqual([2]);
  });
  it('niveau 1 : peut rester à égalité', () => {
    expect(tiebreakByLastRoundScore([0, 1], round(9, 9, 0, 16))).toEqual([0, 1]);
  });
  it('niveau 2 : le plus proche en horaire du gagnant de manche', () => {
    // gagnant de manche = J3 (siège 2) ; candidats J1(0)/J2(1) → J1 plus proche
    expect(tiebreakBySeatProximity([0, 1], SEATS, SEATS[2])).toBe(0);
  });
});

describe('determineWinner — orchestration bout-en-bout', () => {
  it('lève si la partie n\'est pas terminée', () => {
    expect(() => determineWinner([round(0, 5, 9, 2)], SEATS)).toThrow();
  });

  it('cumul le plus bas gagne, unique', () => {
    // J1 toujours à 0, les autres montent à 100 → J1 vainqueur net
    const rounds = [round(0, 16, 16, 16), round(0, 10, 10, 10)];
    expect(computeTotals(rounds)).toEqual({ 0: 0, 1: 100, 2: 100, 3: 100 });
    expect(determineWinner(rounds, SEATS)).toBe(0);
  });

  it('scénario A — départage niveau 1 tranche (J3)', () => {
    const rounds = [
      round(14, 14, 14, 10), // 56 · 56 · 56 · 20
      round(7, 7, 8, 0), //     7 ·  7 · 16 ·  0
      round(7, 7, 8, 0), //     7 ·  7 · 16 ·  0
      round(9, 9, 0, 16), //   18 · 18 ·  0 · 80  (manche décisive)
    ];
    expect(computeTotals(rounds)).toEqual({ 0: 88, 1: 88, 2: 88, 3: 100 });
    expect(determineWinner(rounds, SEATS)).toBe(2); // J3
  });

  it('scénario B — départage niveau 2 tranche (J1)', () => {
    const rounds = [
      round(14, 14, 14, 10), // 56 · 56 · 56 · 20
      round(7, 7, 13, 0), //    7 ·  7 · 39 ·  0
      round(7, 7, 0, 0), //     7 ·  7 ·  0 ·  0
      round(9, 9, 0, 16), //   18 · 18 ·  0 · 80  (manche décisive)
    ];
    expect(computeTotals(rounds)).toEqual({ 0: 88, 1: 88, 2: 95, 3: 100 });
    expect(determineWinner(rounds, SEATS)).toBe(0); // J1
  });
});
