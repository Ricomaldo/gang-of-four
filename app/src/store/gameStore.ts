/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : 3 issues (l'annulée n'est JAMAIS archivée), pause/reprise.
 * Lot : lot 0 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Store de partie — la SEULE source de vérité stockée (Zustand, single device).
 * Ne stocke que le brut : prénoms, cartes saisies par manche, statut, soirée.
 * Les scores/cumuls/vainqueur ne vivent PAS ici : ils se dérivent via domain/.
 *
 * Persistance AsyncStorage (soireeStorage.ts) : la soirée (parties archivées) ET
 * la partie EN COURS, persistée à chaque manche → une app tuée (SMS, éviction OS)
 * ne perd pas les scores. La reprise est décidée au Splash (rounds > 0 → Round).
 */
import { create } from 'zustand';
import type { CardCount, Game, GameArchive, GameStatus, PlayerId, Round, Soiree, Vrac } from '../domain/model';
import { DEFAULT_LEAGUE_ID, PLAYER_IDS, uuidv4 } from '../domain/model';
import { computeTotals, isGameOver } from '../domain/scoring';
import {
  appendToVrac,
  clearGame,
  groupBySoiree,
  loadGame as loadGameFromStorage,
  loadVrac as loadVracFromStorage,
  saveGame,
  saveVrac,
  soireeDate,
} from './soireeStorage';

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
    gofCount: s.gofCount ?? 0,
  };
}

/**
 * Vue de compat pour l'UI gelée (SetupScreen/ScoreGridScreen, [†] au reshape mais
 * vivante aujourd'hui) : elle lit encore `soiree.date`/`soiree.parties` (soirée du
 * jour uniquement). Dérivée du vrac à chaque mutation — rien de stocké sous ce nom.
 */
function todaySoiree(vrac: Vrac): Soiree | null {
  const today = soireeDate(Date.now());
  return groupBySoiree(vrac.parties).find((s) => s.date === today) ?? null;
}

interface GameStore extends Game {
  vrac: Vrac;
  soiree: Soiree | null;
  setPrenom: (id: PlayerId, prenom: string) => void;
  addRound: (cardCounts: Record<PlayerId, CardCount>) => void;
  resetGame: (keepPlayers?: boolean) => void;
  cancelGame: () => void;
  hydrate: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGame(),
  vrac: { schemaVersion: 1, parties: [] },
  soiree: null,

  setPrenom: (id, prenom) => {
    set((s) => ({ players: { ...s.players, [id]: { ...s.players[id], prenom } } }));
    saveGame(gameOf(get()));
  },

  addRound: (cardCounts) => {
    set((s) => {
      const rounds = [...s.rounds, { cardCounts } as Round];
      const status: GameStatus = isGameOver(computeTotals(rounds)) ? 'terminee' : s.status;
      let vrac = s.vrac;
      let soiree = s.soiree;
      if (status === 'terminee') {
        const archive: GameArchive = {
          id: s.id,
          leagueId: s.leagueId,
          archivedAt: Date.now(),
          players: s.players,
          rounds,
          status,
          gofCount: s.gofCount ?? 0,
        };
        vrac = appendToVrac(vrac, archive);
        saveVrac(vrac);
        soiree = todaySoiree(vrac);
      }
      return { rounds, status, vrac, soiree };
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
    set({ ...fresh, players, vrac: s.vrac, soiree: s.soiree });
    saveGame(gameOf(get()));
  },

  // Annulée : statut transitoire → jetée, jamais archivée (distincte de resetGame,
  // qui sert aussi à rejouer après une terminée déjà scellée par addRound).
  cancelGame: () => {
    set({ status: 'annulee' });
    clearGame();
    get().resetGame(false);
  },

  // Au boot : recharge le vrac + la partie en cours (si l'app avait été tuée en jeu).
  hydrate: async () => {
    const [vrac, game] = await Promise.all([loadVracFromStorage(), loadGameFromStorage()]);
    set({ vrac, soiree: todaySoiree(vrac), ...(game ?? {}) });
  },
}));
