/**
 * Déclencheur de fin de partie — le store bascule 'terminee' dès qu'un cumul ≥ 100.
 * Prouve le câblage store → domain (isGameOver ∘ computeTotals) hors UI.
 */
import { useGameStore } from '../src/store/gameStore';
import { gangKey } from '../src/store/vracStorage';

const g = () => useGameStore.getState();

beforeEach(() => g().resetGame());

describe('gameStore — déclencheur de fin', () => {
  it('reste en cours sous 100', () => {
    g().addRound({ 0: 0, 1: 5, 2: 9, 3: 2 });
    expect(g().status).toBe('en-cours');
  });

  it("bascule 'terminee' dès qu'un cumul atteint 100", () => {
    g().addRound({ 0: 0, 1: 16, 2: 16, 3: 16 }); // 0 · 80 · 80 · 80
    expect(g().status).toBe('en-cours');
    g().addRound({ 0: 0, 1: 10, 2: 10, 3: 10 }); // +0 · 20 · 20 · 20 → un cumul à 100
    expect(g().status).toBe('terminee');
  });

  it('resetGame repart en cours et vide les manches', () => {
    g().addRound({ 0: 0, 1: 16, 2: 16, 3: 16 });
    g().addRound({ 0: 0, 1: 10, 2: 10, 3: 10 });
    g().resetGame();
    expect(g().status).toBe('en-cours');
    expect(g().rounds).toHaveLength(0);
  });

  it('une partie terminée rejoint le vrac', () => {
    const before = g().vrac.parties.length; // le vrac est permanent, pas remis à zéro entre tests
    g().addRound({ 0: 0, 1: 16, 2: 16, 3: 16 });
    g().addRound({ 0: 0, 1: 10, 2: 10, 3: 10 });
    expect(g().vrac.parties).toHaveLength(before + 1);
  });
});

describe('gameStore — annuler ≠ archiver (brief lot 0, chantier 4)', () => {
  it('resetGame sur une partie interrompue ne l’archive plus au vrac', () => {
    const before = g().vrac.parties.length;
    g().addRound({ 0: 0, 1: 5, 2: 9, 3: 2 }); // sous 100, partie non terminée
    expect(g().status).toBe('en-cours');
    g().resetGame();
    expect(g().vrac.parties).toHaveLength(before); // inchangé — l'interrompue n'est jamais archivée
  });

  it('cancelGame jette la partie en cours, jamais archivée', () => {
    const before = g().vrac.parties.length;
    g().addRound({ 0: 0, 1: 5, 2: 9, 3: 2 });
    g().cancelGame();
    expect(g().vrac.parties).toHaveLength(before);
    expect(g().rounds).toHaveLength(0);
    expect(g().status).toBe('en-cours'); // fraîche, prête à rejouer
  });
});

describe('gameStore — masquer/démasquer un gang (lot 3a, tes gangs)', () => {
  it('maskGang ajoute la clé, unmaskAllGangs vide tout', () => {
    g().maskGang('a|b|c|d');
    expect(g().masked).toContain('a|b|c|d');
    g().unmaskAllGangs();
    expect(g().masked).toHaveLength(0);
  });

  it('maskGang est idempotent (pas de doublon)', () => {
    g().maskGang('a|b|c|d');
    g().maskGang('a|b|c|d');
    expect(g().masked.filter((k) => k === 'a|b|c|d')).toHaveLength(1);
    g().unmaskAllGangs();
  });

  it('le geste : un gang masqué qui archive une nouvelle partie renaît de lui-même', () => {
    // Ce roster (prénoms vides par défaut dans ces tests) partage la même
    // gangKey — masquer puis terminer une partie doit la faire disparaître du masqué.
    g().resetGame();
    const key = gangKey(g().players);
    g().maskGang(key);
    expect(g().masked).toContain(key);
    g().addRound({ 0: 0, 1: 16, 2: 16, 3: 16 });
    g().addRound({ 0: 0, 1: 10, 2: 10, 3: 10 }); // atteint 100 → archive
    expect(g().status).toBe('terminee');
    expect(g().masked).not.toContain(key);
  });
});

describe('gameStore — undo crayon (brief lot 3c)', () => {
  it('corrige la dernière manche non-branlée : la retire, rend ses valeurs, garde en-cours', () => {
    g().addRound({ 0: 0, 1: 5, 2: 9, 3: 2 });
    const counts = g().uncommitLastRound();
    expect(counts).toEqual({ 0: 0, 1: 5, 2: 9, 3: 2 });
    expect(g().rounds).toHaveLength(0);
    expect(g().status).toBe('en-cours');
  });

  it('refuse une branlée gravée : retourne null, ne retire rien', () => {
    g().addRound({ 0: 0, 1: 16, 2: 16, 3: 16 }); // total 240 → grosse branlée
    const before = g().rounds.length;
    expect(g().uncommitLastRound()).toBeNull();
    expect(g().rounds).toHaveLength(before);
  });

  it('refuse quand il n’y a aucune manche à corriger', () => {
    expect(g().rounds).toHaveLength(0);
    expect(g().uncommitLastRound()).toBeNull();
  });

  it('rebascule terminee → en-cours et désarchive du vrac quand la manche corrigée avait fini la partie', () => {
    const before = g().vrac.parties.length;
    g().addRound({ 0: 0, 1: 16, 2: 16, 3: 16 }); // branlée grosse gravée, hors scope undo — cumuls 0/80/80/80
    g().addRound({ 0: 0, 1: 10, 2: 0, 3: 0 }); // +0/20/0/0 (manche = 20, pas branlée) → joueur 1 atteint 100
    expect(g().status).toBe('terminee');
    expect(g().vrac.parties).toHaveLength(before + 1);

    const counts = g().uncommitLastRound();
    expect(counts).toEqual({ 0: 0, 1: 10, 2: 0, 3: 0 });
    expect(g().status).toBe('en-cours');
    expect(g().rounds).toHaveLength(1);
    expect(g().vrac.parties).toHaveLength(before); // désarchivée, plus rien à montrer comme scellé
  });
});

describe('gameStore — le Gong (brief lot 4)', () => {
  it('incrementGof cumule, global (jamais par joueur)', () => {
    expect(g().gofCount).toBe(0);
    g().incrementGof();
    g().incrementGof();
    expect(g().gofCount).toBe(2);
  });

  it('resetGame remet gofCount à zéro', () => {
    g().incrementGof();
    g().resetGame();
    expect(g().gofCount).toBe(0);
  });

  it('resetGame pose freshEntry à true (le rugissement d’entrée sera dû)', () => {
    g().clearFreshEntry();
    expect(g().freshEntry).toBe(false);
    g().resetGame();
    expect(g().freshEntry).toBe(true);
  });

  it('clearFreshEntry le consomme — une seule fois par (re)prise de table', () => {
    g().resetGame();
    expect(g().freshEntry).toBe(true);
    g().clearFreshEntry();
    expect(g().freshEntry).toBe(false);
  });
});
