/**
 * Tests des dérivés palier 1 : roundLastPlace, manchesGagnees, soireeDate, appendToSoiree.
 */
import { roundLastPlace, manchesGagnees } from '../src/domain/winner';
import { soireeDate, appendToSoiree } from '../src/store/soireeStorage';
import type { Round, Soiree, GameArchive } from '../src/domain/model';
import { TABLE_SEATS } from '../src/domain/model';

// ──────────────── roundLastPlace ────────────────

const mkRound = (counts: [number, number, number, number]): Round => ({
  cardCounts: { 0: counts[0], 1: counts[1], 2: counts[2], 3: counts[3] },
});

const zeroCumuls = { 0: 0, 1: 0, 2: 0, 3: 0 };

describe('roundLastPlace', () => {
  it('retourne le joueur avec le plus de cartes', () => {
    const r = mkRound([0, 5, 9, 3]);
    expect(roundLastPlace(r, zeroCumuls, TABLE_SEATS)).toBe(2); // 9 cartes
  });

  it("en cas d'egalite max cartes, choisit celui avec le plus grand cumul", () => {
    const r = mkRound([0, 9, 9, 3]);
    const totals = { 0: 0, 1: 20, 2: 35, 3: 5 }; // joueur 2 a le plus gros cumul
    expect(roundLastPlace(r, totals, TABLE_SEATS)).toBe(2);
  });

  it("en cas d'egalite cumul aussi, choisit le plus proche du gagnant en anti-horaire", () => {
    // Gagnant = joueur 0 (siège 0). Anti-horaire depuis 0 : 3 (siège 2) est à distance 2, 2 (siège 3) est à distance 3.
    // TABLE_SEATS: {0:0, 1:1, 3:2, 2:3}
    // Distance anti-horaire depuis siège 0 : joueur 3 → (0 - 2 + 4) % 4 = 2 ; joueur 2 → (0 - 3 + 4) % 4 = 1
    // Donc joueur 2 est plus proche en anti-horaire.
    const r = mkRound([0, 3, 9, 9]); // gagnant = joueur 0, égalité joueurs 2 et 3
    const totals = { 0: 0, 1: 5, 2: 40, 3: 40 };
    expect(roundLastPlace(r, totals, TABLE_SEATS)).toBe(2);
  });
});

// ──────────────── manchesGagnees ────────────────

describe('manchesGagnees', () => {
  it('retourne 0 pour chaque joueur si aucune manche', () => {
    expect(manchesGagnees([])).toEqual({ 0: 0, 1: 0, 2: 0, 3: 0 });
  });

  it('compte correctement sur plusieurs manches', () => {
    const rounds = [
      mkRound([0, 5, 9, 3]),  // gagnant 0
      mkRound([3, 0, 7, 5]),  // gagnant 1
      mkRound([0, 5, 9, 3]),  // gagnant 0
      mkRound([3, 5, 0, 7]),  // gagnant 2
    ];
    expect(manchesGagnees(rounds)).toEqual({ 0: 2, 1: 1, 2: 1, 3: 0 });
  });
});

// ──────────────── soireeDate ────────────────

describe('soireeDate', () => {
  it('retourne la date normale pour une heure de soirée (21h)', () => {
    const d = new Date('2026-07-06T21:00:00');
    expect(soireeDate(d.getTime())).toBe('2026-07-06');
  });

  it('retourne la veille pour une heure avant 5h (2h30)', () => {
    const d = new Date('2026-07-07T02:30:00');
    expect(soireeDate(d.getTime())).toBe('2026-07-06');
  });

  it('retourne le jour courant à exactement 5h', () => {
    const d = new Date('2026-07-07T05:00:00');
    expect(soireeDate(d.getTime())).toBe('2026-07-07');
  });
});

// ──────────────── appendToSoiree ────────────────

const mkArchive = (ts: number): GameArchive => ({
  archivedAt: ts,
  players: { 0: { id: 0, prenom: 'A' }, 1: { id: 1, prenom: 'B' }, 2: { id: 2, prenom: 'C' }, 3: { id: 3, prenom: 'D' } },
  rounds: [],
  status: 'terminee',
});

describe('appendToSoiree', () => {
  it('crée une nouvelle soirée si soiree est null', () => {
    const ts = new Date('2026-07-06T20:00:00').getTime();
    const result = appendToSoiree(null, mkArchive(ts));
    expect(result.date).toBe('2026-07-06');
    expect(result.parties).toHaveLength(1);
  });

  it('ajoute à la soirée existante si même date', () => {
    const ts1 = new Date('2026-07-06T20:00:00').getTime();
    const ts2 = new Date('2026-07-06T22:00:00').getTime();
    const soiree: Soiree = { date: '2026-07-06', parties: [mkArchive(ts1)] };
    const result = appendToSoiree(soiree, mkArchive(ts2));
    expect(result.parties).toHaveLength(2);
  });

  it('crée une nouvelle soirée si le jour est différent', () => {
    const ts1 = new Date('2026-07-05T20:00:00').getTime();
    const ts2 = new Date('2026-07-06T20:00:00').getTime();
    const soiree: Soiree = { date: '2026-07-05', parties: [mkArchive(ts1)] };
    const result = appendToSoiree(soiree, mkArchive(ts2));
    expect(result.date).toBe('2026-07-06');
    expect(result.parties).toHaveLength(1);
  });

  it('applique la tolérance nuit (2h30 → veille)', () => {
    const ts = new Date('2026-07-07T02:30:00').getTime();
    const result = appendToSoiree(null, mkArchive(ts));
    expect(result.date).toBe('2026-07-06');
  });
});
