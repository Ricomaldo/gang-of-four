/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : 3 issues (l'annulée n'est JAMAIS archivée), pause/reprise.
 * Lot : lot 0 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 *
 * + `masked` / `maskGang` / `unmaskAllGangs` (lot 3a, brief 2026-07-13) : les
 * gangKeys masqués de « tes gangs » (accueil). Le geste démasque de lui-même —
 * si le gang masqué archive une nouvelle partie, il renaît dans la liste.
 *
 * + `uncommitLastRound` (lot 3c, brief 2026-07-13) : l'undo crayon — retire la
 * dernière manche non-branlée, rebascule 'terminee' → 'en-cours' si besoin (et
 * désarchive du vrac le cas échéant). Une branlée gravée refuse (retourne null).
 * ═══════════════════════════════ */
/**
 * Store de partie — la SEULE source de vérité stockée (Zustand, single device).
 * Ne stocke que le brut : prénoms, cartes saisies par manche, statut.
 * Les scores/cumuls/vainqueur ne vivent PAS ici : ils se dérivent via domain/.
 *
 * Persistance AsyncStorage (vracStorage.ts) : le vrac (parties archivées) ET
 * la partie EN COURS, persistée à chaque manche → une app tuée (SMS, éviction OS)
 * ne perd pas les scores. La reprise est décidée au Splash (rounds > 0 → Round).
 */
import { create } from 'zustand';
import type { CardCount, Game, GameArchive, GameStatus, PlayerId, Round, Vrac } from '../domain/model';
import { DEFAULT_LEAGUE_ID, PLAYER_IDS, uuidv4 } from '../domain/model';
import { computeTotals, detectBranlee, isGameOver } from '../domain/scoring';
import {
  appendToVrac,
  clearGame,
  gangKey,
  loadGame as loadGameFromStorage,
  loadMasked,
  loadVrac as loadVracFromStorage,
  saveGame,
  saveMasked,
  saveVrac,
} from './vracStorage';

function initialGame(): Game {
  const players = {} as Game['players'];
  for (const id of PLAYER_IDS) {
    players[id] = { id, prenom: '' };
  }
  // id + leagueId semés ici : une partie interrompue puis reprise garde son id.
  return { id: uuidv4(), leagueId: DEFAULT_LEAGUE_ID, players, rounds: [], status: 'en-cours', gofCount: 0 };
}

/** Les seuls champs de partie à persister (sans le vrac ni les actions). */
function gameOf(s: Game): Game {
  return {
    id: s.id,
    leagueId: s.leagueId,
    players: s.players,
    rounds: s.rounds,
    status: s.status,
    gofCount: s.gofCount,
  };
}

interface GameStore extends Game {
  vrac: Vrac;
  masked: string[];
  setPrenom: (id: PlayerId, prenom: string) => void;
  addRound: (cardCounts: Record<PlayerId, CardCount>) => void;
  resetGame: (keepPlayers?: boolean) => void;
  cancelGame: () => void;
  maskGang: (key: string) => void;
  unmaskAllGangs: () => void;
  uncommitLastRound: () => Record<PlayerId, CardCount> | null;
  hydrate: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGame(),
  vrac: { schemaVersion: 1, parties: [] },
  masked: [],

  setPrenom: (id, prenom) => {
    set((s) => ({ players: { ...s.players, [id]: { ...s.players[id], prenom } } }));
    saveGame(gameOf(get()));
  },

  addRound: (cardCounts) => {
    set((s) => {
      const rounds = [...s.rounds, { cardCounts } as Round];
      const status: GameStatus = isGameOver(computeTotals(rounds)) ? 'terminee' : s.status;
      let vrac = s.vrac;
      let masked = s.masked;
      if (status === 'terminee') {
        const archive: GameArchive = {
          id: s.id,
          leagueId: s.leagueId,
          archivedAt: Date.now(),
          players: s.players,
          rounds,
          status,
          gofCount: s.gofCount,
        };
        vrac = appendToVrac(vrac, archive);
        saveVrac(vrac);
        // Le geste : un gang masqué qui rejoue renaît de lui-même dans « tes gangs ».
        const key = gangKey(s.players);
        if (masked.includes(key)) {
          masked = masked.filter((k) => k !== key);
          saveMasked(masked);
        }
      }
      return { rounds, status, vrac, masked };
    });
    // Partie finie → archivée dans le vrac, plus rien à reprendre ; sinon on persiste la partie vive.
    if (get().status === 'terminee') clearGame();
    else saveGame(gameOf(get()));
  },

  resetGame: (keepPlayers = false) => {
    const s = get();
    // Partie terminée déjà archivée dans addRound. Une interrompue n'est PLUS archivée
    // ici (annuler = jeter, jamais archiver au vrac — cf. brief lot 0, chantier 4).
    const fresh = initialGame();
    // « Mêmes joueurs » : on rejoue avec les mêmes prénoms, cartes/statut remis à zéro.
    const players = keepPlayers ? s.players : fresh.players;
    set({ ...fresh, players, vrac: s.vrac });
    saveGame(gameOf(get()));
  },

  // Annulée : statut transitoire → jetée, jamais archivée (distincte de resetGame,
  // qui sert aussi à rejouer après une terminée déjà scellée par addRound).
  cancelGame: () => {
    set({ status: 'annulee' });
    clearGame();
    get().resetGame(false);
  },

  // Masquer un roster (accueil) : retiré de « tes gangs », ses feuilles restent au vrac.
  maskGang: (key) => {
    set((s) => {
      if (s.masked.includes(key)) return {};
      const masked = [...s.masked, key];
      saveMasked(masked);
      return { masked };
    });
  },

  // Démasquage par consultation (« + N gangs masqués ») : révèle tout, pas d'écran de gestion.
  unmaskAllGangs: () => {
    set({ masked: [] });
    saveMasked([]);
  },

  // L'undo crayon (lot 3c) : retire la dernière manche pour la ré-ouvrir en
  // saisie. Refuse une branlée gravée (précédence crayon/gravé de Feuille).
  // Si cette manche avait terminé la partie, rebascule 'en-cours' et retire
  // l'archive posée par addRound (le vrac ne garde que ce qui reste scellé).
  uncommitLastRound: () => {
    const s = get();
    if (s.rounds.length === 0) return null;
    const lastRound = s.rounds[s.rounds.length - 1];
    if (detectBranlee(lastRound) !== null) return null;
    const rounds = s.rounds.slice(0, -1);
    let vrac = s.vrac;
    if (s.status === 'terminee') {
      vrac = { schemaVersion: vrac.schemaVersion, parties: vrac.parties.filter((p) => p.id !== s.id) };
      saveVrac(vrac);
    }
    set({ rounds, status: 'en-cours', vrac });
    saveGame(gameOf(get()));
    return lastRound.cardCounts;
  },

  // Au boot : recharge le vrac + la partie en cours (si l'app avait été tuée en jeu) + les masqués.
  hydrate: async () => {
    const [vrac, game, masked] = await Promise.all([
      loadVracFromStorage(),
      loadGameFromStorage(),
      loadMasked(),
    ]);
    set({ vrac, masked, ...(game ?? {}) });
  },
}));
