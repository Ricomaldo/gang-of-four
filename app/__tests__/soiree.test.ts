/**
 * Tests des dérivés palier 1 : roundLastPlace, manchesGagnees, soireeDate, le vrac
 * (round-trip save/load, appendToVrac, dérivation gang et sessions — brief lot 0).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { roundLastPlace, manchesGagnees } from '../src/domain/winner';
import {
  soireeDate,
  appendToVrac,
  loadVrac,
  saveVrac,
  gangKey,
  filterByGang,
  findArchive,
  sumGofCount,
  groupBySoiree,
  deriveGangs,
  loadMasked,
  saveMasked,
  relativeLabel,
} from '../src/store/vracStorage';
import type { Round, GameArchive, Vrac } from '../src/domain/model';
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

// ──────────────── le vrac ────────────────

const mkArchive = (ts: number, prenoms: [string, string, string, string] = ['A', 'B', 'C', 'D']): GameArchive => ({
  id: `game-${ts}-${prenoms.join('')}`,
  leagueId: 'proto-ligue',
  archivedAt: ts,
  players: {
    0: { id: 0, prenom: prenoms[0] },
    1: { id: 1, prenom: prenoms[1] },
    2: { id: 2, prenom: prenoms[2] },
    3: { id: 3, prenom: prenoms[3] },
  },
  rounds: [],
  status: 'terminee',
  gofCount: 0,
});

const emptyVrac = (): Vrac => ({ schemaVersion: 1, parties: [] });

describe('appendToVrac', () => {
  it('ajoute à un vrac vide', () => {
    const ts = new Date('2026-07-06T20:00:00').getTime();
    const result = appendToVrac(emptyVrac(), mkArchive(ts));
    expect(result.parties).toHaveLength(1);
    expect(result.schemaVersion).toBe(1);
  });

  it('empile à plat, sans regroupement par date (le vrac est inter-sessions)', () => {
    const ts1 = new Date('2026-07-05T20:00:00').getTime();
    const ts2 = new Date('2026-07-06T20:00:00').getTime();
    let vrac = appendToVrac(emptyVrac(), mkArchive(ts1));
    vrac = appendToVrac(vrac, mkArchive(ts2));
    expect(vrac.parties).toHaveLength(2);
  });
});

describe('loadVrac / saveVrac — round-trip', () => {
  beforeEach(() => AsyncStorage.clear());

  it('retourne un vrac vide si rien en storage (pas de legacy — build neuf)', async () => {
    const vrac = await loadVrac();
    expect(vrac).toEqual({ schemaVersion: 1, parties: [] });
  });

  it('round-trip save → load', async () => {
    const ts = new Date('2026-07-06T20:00:00').getTime();
    const vrac = appendToVrac(emptyVrac(), mkArchive(ts));
    await saveVrac(vrac);
    const loaded = await loadVrac();
    expect(loaded).toEqual(vrac);
  });
});

describe('gangKey / filterByGang — dérivation gang (4 prénoms triés)', () => {
  it("clé stable quel que soit l'ordre des sièges", () => {
    const g1 = mkArchive(1, ['Alice', 'Bob', 'Chloé', 'David']);
    const g2 = mkArchive(2, ['David', 'Chloé', 'Bob', 'Alice']);
    expect(gangKey(g1.players)).toBe(gangKey(g2.players));
  });

  it('normalise trim + casse (« Marc » = «  marc  » — même gang, Identité = A)', () => {
    const g1 = mkArchive(1, ['Marc', 'Léa', 'Tom', 'Zoé']);
    const g2 = mkArchive(2, ['  marc ', 'LÉA', 'tom', 'ZOÉ']);
    expect(gangKey(g1.players)).toBe(gangKey(g2.players));
  });

  it('filtre le vrac sur un gang précis, ignore les autres rosters', () => {
    const legang = mkArchive(1, ['Alice', 'Bob', 'Chloé', 'David']);
    const autreGang = mkArchive(2, ['Eve', 'Franz', 'Gina', 'Hugo']);
    const filtered = filterByGang([legang, autreGang], gangKey(legang.players));
    expect(filtered).toEqual([legang]);
  });
});

describe('findArchive — retrouve une partie du vrac par id (stèle → feuille passée)', () => {
  it('retourne la partie dont l’id correspond', () => {
    const a = mkArchive(1);
    const b = mkArchive(2);
    expect(findArchive([a, b], b.id)).toBe(b);
  });

  it('undefined si aucun id ne correspond', () => {
    expect(findArchive([mkArchive(1)], 'inconnu')).toBeUndefined();
  });
});

describe('sumGofCount — la mention GOF du gang (stèle)', () => {
  it('somme les gofCount du gang, 0 par défaut si absent', () => {
    const withGof: GameArchive = { ...mkArchive(1), gofCount: 2 };
    const withoutGof = mkArchive(2);
    expect(sumGofCount([withGof, withoutGof])).toBe(2);
  });

  it('0 pour un vrac vide', () => {
    expect(sumGofCount([])).toBe(0);
  });
});

describe('groupBySoiree — sessions dérivées, groupées par date', () => {
  it('groupe deux parties de la même soirée ensemble', () => {
    const ts1 = new Date('2026-07-06T20:00:00').getTime();
    const ts2 = new Date('2026-07-06T22:00:00').getTime();
    const sessions = groupBySoiree([mkArchive(ts1), mkArchive(ts2)]);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].date).toBe('2026-07-06');
    expect(sessions[0].parties).toHaveLength(2);
  });

  it('sépare deux soirées distinctes', () => {
    const ts1 = new Date('2026-07-05T20:00:00').getTime();
    const ts2 = new Date('2026-07-06T20:00:00').getTime();
    const sessions = groupBySoiree([mkArchive(ts1), mkArchive(ts2)]);
    expect(sessions.map((s) => s.date).sort()).toEqual(['2026-07-05', '2026-07-06']);
  });

  it('applique la tolérance nuit (2h30 → veille) au groupement', () => {
    const ts = new Date('2026-07-07T02:30:00').getTime();
    const sessions = groupBySoiree([mkArchive(ts)]);
    expect(sessions[0].date).toBe('2026-07-06');
  });
});

// ──────────────── deriveGangs — « tes gangs » (accueil, lot 3a) ────────────────

describe('deriveGangs', () => {
  it('un gang par gangKey, triés du plus récent au plus ancien', () => {
    const ts1 = new Date('2026-07-05T20:00:00').getTime();
    const ts2 = new Date('2026-07-06T20:00:00').getTime();
    const gangA = mkArchive(ts1, ['Alice', 'Bob', 'Chloé', 'David']);
    const gangB = mkArchive(ts2, ['Eve', 'Franz', 'Gina', 'Hugo']);
    const gangs = deriveGangs([gangA, gangB]);
    expect(gangs).toHaveLength(2);
    expect(gangs[0].key).toBe(gangKey(gangB.players)); // le plus récent en tête
    expect(gangs[1].key).toBe(gangKey(gangA.players));
  });

  it('regroupe deux parties du même gang sous une seule entrée, garde le roster le plus récent', () => {
    const ts1 = new Date('2026-07-05T20:00:00').getTime();
    const ts2 = new Date('2026-07-06T20:00:00').getTime();
    const first = mkArchive(ts1, ['Alice', 'Bob', 'Chloé', 'David']);
    const second = mkArchive(ts2, ['Alice', 'Bob', 'Chloé', 'David']);
    const gangs = deriveGangs([first, second]);
    expect(gangs).toHaveLength(1);
    expect(gangs[0].lastPlayedAt).toBe(ts2);
  });

  it('retourne une liste vide pour un vrac vide', () => {
    expect(deriveGangs([])).toEqual([]);
  });
});

// ──────────────── masquage — gangKeys masqués, round-trip storage ────────────────

describe('loadMasked / saveMasked — round-trip', () => {
  beforeEach(() => AsyncStorage.clear());

  it('retourne une liste vide si rien en storage', async () => {
    expect(await loadMasked()).toEqual([]);
  });

  it('round-trip save → load', async () => {
    await saveMasked(['alice|bob|chloe|david']);
    expect(await loadMasked()).toEqual(['alice|bob|chloe|david']);
  });
});

// ──────────────── relativeLabel — temps relatif gros grain ────────────────

describe('relativeLabel', () => {
  const now = new Date('2026-07-13T20:00:00').getTime();

  it("aujourd'hui pour un timestamp du jour même", () => {
    expect(relativeLabel(now, now)).toBe("aujourd'hui");
  });

  it('hier pour un timestamp de la veille (1 jour)', () => {
    expect(relativeLabel(now - 1 * 86_400_000, now)).toBe('hier');
  });

  it('en jours sous 30 jours', () => {
    expect(relativeLabel(now - 8 * 86_400_000, now)).toBe('8 j');
  });

  it('en mois au-delà de 30 jours', () => {
    expect(relativeLabel(now - 45 * 86_400_000, now)).toBe('1 mois');
  });
});
