/**
 * Store de partie — la SEULE source de vérité stockée (Zustand, single device).
 * Ne stocke que le brut : prénoms, cartes saisies par manche, statut.
 * Les scores/cumuls/vainqueur ne vivent PAS ici : ils se dérivent via domain/
 * (branchés à l'étape « Prouver la justesse »). Aucune persistance cross-session.
 */
import { create } from 'zustand';
import type { CardCount, Game, GameStatus, PlayerId, Round } from '../domain/model';
import { PLAYER_IDS } from '../domain/model';
import { computeTotals, isGameOver } from '../domain/scoring';

function initialGame(): Game {
  const players = {} as Game['players'];
  for (const id of PLAYER_IDS) {
    players[id] = { id, prenom: '' };
  }
  return { players, rounds: [], status: 'en-cours' };
}

interface GameStore extends Game {
  /** Renseigne le prénom d'un joueur (saisi au démarrage, dans sa pill). */
  setPrenom: (id: PlayerId, prenom: string) => void;
  /** Ajoute une manche (cartes restantes des 4 joueurs). Stockage brut, pas de calcul. */
  addRound: (cardCounts: Record<PlayerId, CardCount>) => void;
  /** Nouvelle partie — repart de zéro. Précédée d'un confirm côté UI (pas de sauvegarde). */
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialGame(),
  setPrenom: (id, prenom) =>
    set((s) => ({ players: { ...s.players, [id]: { ...s.players[id], prenom } } })),
  addRound: (cardCounts) =>
    set((s) => {
      const rounds = [...s.rounds, { cardCounts } as Round];
      // Déclencheur de fin : dès qu'un cumul ≥ 100, la partie se gèle (statut stocké,
      // dérivé une seule fois à la transition). Le vainqueur, lui, reste dérivé à l'affichage.
      const status: GameStatus = isGameOver(computeTotals(rounds)) ? 'terminee' : s.status;
      return { rounds, status };
    }),
  resetGame: () => set(initialGame()),
}));
