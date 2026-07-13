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

// ──────────────── titres miroirs — décroisement, monde étrange, branlées ────────────────
// Cf. cas-reference-score.md §titres miroirs (Marc tient les 2 trônes) + signature/palmares.md.

const mkPlayers = (prenoms: [string, string, string, string]): Record<PlayerId, { id: PlayerId; prenom: string }> => ({
  0: { id: 0, prenom: prenoms[0] },
  1: { id: 1, prenom: prenoms[1] },
  2: { id: 2, prenom: prenoms[2] },
  3: { id: 3, prenom: prenoms[3] },
});

const mkGame = (
  players: Record<PlayerId, { id: PlayerId; prenom: string }>,
  rounds: Round[],
  archivedAt: number,
  id: string,
): GameArchive => ({ id, leagueId: 'proto-ligue', archivedAt, players, rounds, status: 'terminee' });

// Motif A — 2 manches, le siège 0 gagne (0 carte), le siège 3 perd (cumul → 100 pile).
// Une seule branlée (r1, grosse) : donneur = siège 0, preneurs = sièges 1/2/3.
const patternA = (): Round[] => [mkRound([0, 3, 4, 16]), mkRound([0, 2, 3, 10])];

// Motif B — 3 manches, le siège 0 gagne (0 carte) toutes les manches, le siège 3 perd
// (cumul → 112). Reprend exactement le motif de `partieRef` ci-dessus (déjà prouvé).
// Chaque manche est une branlée (grosse) : donneur = siège 0.
const patternB = (): Round[] => [mkRound([0, 5, 8, 16]), mkRound([0, 8, 8, 8]), mkRound([0, 8, 8, 8])];

describe('computeSoireeStats — miroirs décroisés, monde étrange, contre-exemple du code croisé', () => {
  it('✌️ et 🐌 peuvent tenir le même joueur (monde étrange), sans croisement des pôles', () => {
    // Marc gagne 2 parties (motif B, 3⭐️/partie) ; Léa en gagne 2 aussi (motif A, 2⭐️/partie).
    // Égalité 🏆 (2=2) tranchée par ⭐️ : Marc (6) > Léa (4) → Marc champion.
    // Marc perd aussi 2 parties (motif A, en face de Léa) → 2💩, seul en tête des perdants → Marc looser.
    // L'ancien code croisé aurait départagé ✌️ par « moins de 💩 » → Léa (0💩 < 2💩) : FAUX désormais.
    const g1 = mkGame(mkPlayers(['Marc', 'Léa', 'Zoé', 'Tom']), patternB(), 1, 'g1'); // Marc gagne, Tom perd
    const g2 = mkGame(mkPlayers(['Marc', 'Tom', 'Léa', 'Zoé']), patternB(), 2, 'g2'); // Marc gagne, Zoé perd
    const g3 = mkGame(mkPlayers(['Léa', 'Tom', 'Zoé', 'Marc']), patternA(), 3, 'g3'); // Léa gagne, Marc perd
    const g4 = mkGame(mkPlayers(['Léa', 'Zoé', 'Tom', 'Marc']), patternA(), 4, 'g4'); // Léa gagne, Marc perd

    const stats = computeSoireeStats([g1, g2, g3, g4]);

    const marc = stats.parPrenom.find((p) => p.prenom === 'Marc')!;
    const lea = stats.parPrenom.find((p) => p.prenom === 'Léa')!;
    expect(marc.partiesGagnees).toBe(2);
    expect(marc.partiesPerdues).toBe(2);
    expect(lea.partiesGagnees).toBe(2);
    expect(lea.partiesPerdues).toBe(0);
    expect(marc.manchesGagnees).toBe(6); // 3+3, motif B
    expect(lea.manchesGagnees).toBe(4); // 2+2, motif A

    expect(stats.leader).toBe('Marc'); // pas Léa — le 💩 de Marc ne le pénalise jamais
    expect(stats.looser).toBe('Marc'); // le 🏆 de Marc ne le rachète jamais
  });

  it('compteurs branlées : +1 au donneur (0 carte), +1 aux 3 preneurs par déduction', () => {
    const g = mkGame(mkPlayers(['Alice', 'Bob', 'Chloé', 'David']), patternA(), 1, 'g1');
    const stats = computeSoireeStats([g]);
    const find = (p: string) => stats.parPrenom.find((s) => s.prenom === p)!;

    expect(find('Alice').brancheesDonnees).toBe(1); // donneur, r1 seule branlée du motif A
    expect(find('Bob').brancheesPrises).toBe(1);
    expect(find('Chloé').brancheesPrises).toBe(1);
    expect(find('David').brancheesPrises).toBe(1); // aussi 💩 de la partie — double rôle, cohérent
  });
});

describe('computeSoireeStats — départage final « tenant reste » (par rejeu chronologique)', () => {
  // Alice décroche ✌️ seule après g1. Bob la détrône à g2 (strictement meilleur : 3⭐️ > 2⭐️
  // à 🏆 égal). Carol rejoint Bob à égalité totale (1🏆/3⭐️/3 branlées) à g3 : le tenant (Bob)
  // reste, il ne suffit pas de l'égaler. Une lecture « premier vu » se ferait piéger : Carol
  // est insérée dans les compteurs avant Bob (branlée prise dès g1), donc un départage par
  // ordre d'apparition donnerait Carol à tort — seule la mémoire du tenant donne Bob.
  const g1 = mkGame(mkPlayers(['Alice', 'Bob', 'Dave', 'Carol']), patternA(), 1000, 'g1'); // Alice gagne, Carol perd
  const g2 = mkGame(mkPlayers(['Bob', 'Alice', 'Carol', 'Dave']), patternB(), 2000, 'g2'); // Bob gagne, Dave perd
  const g3 = mkGame(mkPlayers(['Carol', 'Alice', 'Bob', 'Dave']), patternB(), 3000, 'g3'); // Carol gagne, Dave perd

  it('champion unique après la 1ʳᵉ partie', () => {
    expect(computeSoireeStats([g1]).leader).toBe('Alice');
  });

  it('détrôné par un challenger strictement meilleur (pas seulement à égalité)', () => {
    expect(computeSoireeStats([g1, g2]).leader).toBe('Bob');
  });

  it('le tenant reste à égalité totale — il faut le battre, pas l’égaler', () => {
    expect(computeSoireeStats([g1, g2, g3]).leader).toBe('Bob');
  });

  it('rejoue par ordre chronologique (archivedAt), pas par ordre du tableau reçu', () => {
    expect(computeSoireeStats([g3, g1, g2]).leader).toBe('Bob');
  });
});
