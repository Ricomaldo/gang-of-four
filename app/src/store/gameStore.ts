/**
 * Store de partie — la SEULE source de vérité stockée (Zustand, single device).
 * Ne stocke que le brut : prénoms, cartes saisies par manche, statut, soirée.
 * Les scores/cumuls/vainqueur ne vivent PAS ici : ils se dérivent via domain/.
 * La soirée persiste via AsyncStorage (soireeStorage.ts).
 */
import { create } from 'zustand';
import type { CardCount, Game, GameStatus, PlayerId, Round, Soiree } from '../domain/model';
import { DEFAULT_LEAGUE_ID, PLAYER_IDS, uuidv4 } from '../domain/model';
import { computeTotals, isGameOver } from '../domain/scoring';
import { appendToSoiree, loadSoiree as loadSoireeFromStorage, saveSoiree } from './soireeStorage';

function initialGame(): Game {
  const players = {} as Game['players'];
  for (const id of PLAYER_IDS) {
    players[id] = { id, prenom: '' };
  }
  // id + leagueId semés ici : une partie interrompue puis reprise garde son id.
  return { id: uuidv4(), leagueId: DEFAULT_LEAGUE_ID, players, rounds: [], status: 'en-cours' };
}

interface GameStore extends Game {
  soiree: Soiree | null;
  setPrenom: (id: PlayerId, prenom: string) => void;
  addRound: (cardCounts: Record<PlayerId, CardCount>) => void;
  resetGame: (keepPlayers?: boolean) => void;
  loadSoiree: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGame(),
  soiree: null,

  setPrenom: (id, prenom) =>
    set((s) => ({ players: { ...s.players, [id]: { ...s.players[id], prenom } } })),

  addRound: (cardCounts) =>
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
    }),

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
  },

  loadSoiree: async () => {
    const soiree = await loadSoireeFromStorage();
    set({ soiree });
  },
}));
