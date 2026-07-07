/**
 * Cas de référence des dérivés stats P1 (nourrit « prouver la justesse ») :
 * gameLoser (symétrique de determineWinner) + computeSoireeStats (agrégation par prénom).
 */
import { gameLoser } from '../src/domain/winner';
import { computeSoireeStats } from '../src/domain/stats';
import { computeTotals } from '../src/domain/scoring';
import type { GameArchive, PlayerId, Round } from '../src/domain/model';
import { TABLE_SEATS } from '../src/domain/model';

const mkRound = (counts: [number, number, number, number]): Round => ({
  cardCounts: { 0: counts[0], 1: counts[1], 2: counts[2], 3: counts[3] },
});

// ──────────────── gameLoser ────────────────

describe('gameLoser', () => {
  it('retourne le cumul final le plus haut', () => {
    // Finaux : j0=0, j1=80+20=100, j2=80, j3=0. Perdant = joueur 1.
    const rounds = [mkRound([0, 16, 16, 0]), mkRound([0, 10, 0, 0])];
    expect(computeTotals(rounds)[1]).toBe(100);
    expect(gameLoser(rounds, TABLE_SEATS)).toBe(1);
  });

  it("throw si la partie n'est pas terminée (aucun cumul ≥ 100)", () => {
    const rounds = [mkRound([0, 5, 9, 3])];
    expect(() => gameLoser(rounds, TABLE_SEATS)).toThrow();
  });

  it('départage L1 : à cumul final égal, le plus grand score à la dernière manche perd', () => {
    // j0 et j1 finissent à 100 pile ; à la dernière manche j0=10c(+20) > j1=8c(+16) → j0 perd.
    // R1 : 80/80/0/0 · R2 : +0/+4 · R3 (dernière) : +20/+16 → finaux 100/100/0/0.
    const rounds = [mkRound([16, 16, 0, 0]), mkRound([0, 4, 0, 0]), mkRound([10, 8, 0, 0])];
    const totals = computeTotals(rounds);
    expect(totals[0]).toBe(100);
    expect(totals[1]).toBe(100);
    expect(gameLoser(rounds, TABLE_SEATS)).toBe(0); // plus de cartes à la dernière manche
  });
});

// ──────────────── computeSoireeStats ────────────────

const players = {
  0: { id: 0 as PlayerId, prenom: 'Alice' },
  1: { id: 1 as PlayerId, prenom: 'Bob' },
  2: { id: 2 as PlayerId, prenom: 'Chloé' },
  3: { id: 3 as PlayerId, prenom: 'David' },
};

const mkArchive = (
  rounds: Round[],
  status: GameArchive['status'] = 'terminee',
  id = 'g1',
): GameArchive => ({
  id,
  leagueId: 'proto-ligue',
  archivedAt: 0,
  players,
  rounds,
  status,
});

// Partie de référence : Alice (j0) gagne les 3 manches (0 carte) et la partie (cumul 0) ;
// David (j3) franchit 100 et perd ; David est dernier en R1 (16 cartes).
const partieRef = (): Round[] => [
  mkRound([0, 5, 8, 16]), // ⭐️Alice, 💥David ; cumuls 0/5/16/80
  mkRound([0, 8, 8, 8]), //  ⭐️Alice ; cumuls 0/13/32/96
  mkRound([0, 8, 8, 8]), //  ⭐️Alice ; David → 112 ≥ 100, fin
];

describe('computeSoireeStats', () => {
  it('retourne des stats vides et pas de titre si aucune partie terminée', () => {
    const stats = computeSoireeStats([]);
    expect(stats.parPrenom).toEqual([]);
    expect(stats.leader).toBeNull();
    expect(stats.looser).toBeNull();
  });

  it('ignore les parties interrompues (aucune stat, ni partie ni manche)', () => {
    const interrompue = mkArchive([mkRound([0, 5, 9, 3])], 'en-cours');
    const stats = computeSoireeStats([interrompue]);
    expect(stats.parPrenom).toEqual([]);
    expect(stats.leader).toBeNull();
  });

  it('agrège par prénom : compteurs + titres sur une partie terminée', () => {
    const stats = computeSoireeStats([mkArchive(partieRef())]);

    const alice = stats.parPrenom.find((p) => p.prenom === 'Alice')!;
    const david = stats.parPrenom.find((p) => p.prenom === 'David')!;

    expect(alice.manchesGagnees).toBe(3);
    expect(alice.partiesGagnees).toBe(1);
    expect(david.partiesPerdues).toBe(1);
    expect(david.manchesPerdues).toBe(3); // dernier chaque manche (cumul le plus haut)

    // Titres décernés dès la 1ʳᵉ partie.
    expect(stats.leader).toBe('Alice');
    expect(stats.looser).toBe('David');
  });

  it('cumule deux parties sur le même prénom (mêmes joueurs = mêmes prénoms)', () => {
    const stats = computeSoireeStats([
      mkArchive(partieRef(), 'terminee', 'g1'),
      mkArchive(partieRef(), 'terminee', 'g2'),
    ]);
    const alice = stats.parPrenom.find((p) => p.prenom === 'Alice')!;
    expect(alice.partiesGagnees).toBe(2);
    expect(alice.manchesGagnees).toBe(6);
  });

  it('exclut les prénoms vides', () => {
    const archive: GameArchive = {
      ...mkArchive(partieRef()),
      players: { ...players, 1: { id: 1 as PlayerId, prenom: '  ' } },
    };
    const stats = computeSoireeStats([archive]);
    expect(stats.parPrenom.some((p) => p.prenom.trim() === '')).toBe(false);
  });
});
