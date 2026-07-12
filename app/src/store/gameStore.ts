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
import type { CardCount, Game, GameStatus, PlayerId, Round, Soiree } from '../domain/model';
import { DEFAULT_LEAGUE_ID, PLAYER_IDS, uuidv4 } from '../domain/model';
import { computeTotals, isGameOver } from '../domain/scoring';
import {
  appendToSoiree,
  clearGame,
  loadGame as loadGameFromStorage,
  loadSoiree as loadSoireeFromStorage,
  saveGame,
  saveSoiree,
} from './soireeStorage';

function initialGame(): Game {
  const players = {} as Game['players'];
  for (const id of PLAYER_IDS) {
    players[id] = { id, prenom: '' };
  }
  // id + leagueId semés ici : une partie interrompue puis reprise garde son id.
  return { id: uuidv4(), leagueId: DEFAULT_LEAGUE_ID, players, rounds: [], status: 'en-cours' };
}

/** Les seuls champs de partie à persister (sans la soirée ni les actions). */
function gameOf(s: Game): Game {
  return { id: s.id, leagueId: s.leagueId, players: s.players, rounds: s.rounds, status: s.status };
}

interface GameStore extends Game {
  soiree: Soiree | null;
  setPrenom: (id: PlayerId, prenom: string) => void;
  addRound: (cardCounts: Record<PlayerId, CardCount>) => void;
  resetGame: (keepPlayers?: boolean) => void;
  hydrate: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGame(),
  soiree: null,

  setPrenom: (id, prenom) => {
    set((s) => ({ players: { ...s.players, [id]: { ...s.players[id], prenom } } }));
    saveGame(gameOf(get()));
  },

  addRound: (cardCounts) => {
    set((s) => {
      const rounds = [...s.rounds, { cardCounts } as Round];
      const status: GameStatus = isGameOver(computeTotals(rounds)) ? 'terminee' : s.status;
      let soiree = s.soiree;
      if (status === 'terminee') {
        const archive = { id: s.id, leagueId: s.leagueId, archivedAt: Date.now(), players: s.players, rounds, status };
        soiree = appendToSoiree(soiree, archive);
        saveSoiree(soiree);
      }
      return { rounds, status, soiree };
    });
    // Partie finie → archivée dans la soirée, plus rien à reprendre ; sinon on persiste la partie vive.
    if (get().status === 'terminee') clearGame();
    else saveGame(gameOf(get()));
  },

  resetGame: (keepPlayers = false) => {
    const s = get();
    let soiree = s.soiree;
    // Partie terminée déjà archivée dans addRound ; on n'archive que l'interrompue.
    if (s.rounds.length > 0 && s.status !== 'terminee') {
      const archive = { id: s.id, leagueId: s.leagueId, archivedAt: Date.now(), players: s.players, rounds: s.rounds, status: s.status };
      soiree = appendToSoiree(soiree, archive);
      saveSoiree(soiree);
    }
    const fresh = initialGame();
    // « Mêmes joueurs » : on rejoue avec les mêmes prénoms, cartes/statut remis à zéro.
    const players = keepPlayers ? s.players : fresh.players;
    set({ ...fresh, players, soiree });
    saveGame(gameOf(get()));
  },

  // Au boot : recharge la soirée + la partie en cours (si l'app avait été tuée en jeu).
  hydrate: async () => {
    const [soiree, game] = await Promise.all([loadSoireeFromStorage(), loadGameFromStorage()]);
    set({ soiree, ...(game ?? {}) });
  },
}));
