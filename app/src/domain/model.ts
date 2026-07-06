/**
 * Modèle de données — le socle d'état typé.
 * Source de vérité : app/docs/modele-donnees.md v0.4, app/docs/logique-comptage.md v0.2.
 *
 * Règle cardinale : une SEULE source de vérité stockée (voir {@link Game}).
 * Score, cumul, gagnant de manche, sens de jeu, vainqueur = TOUJOURS dérivés
 * via domain/, JAMAIS stockés. La couche `store/` ne garde que le stocké ci-dessous.
 */

/** Identité d'un joueur = sa position de quadrant (grille 2×2) = son siège physique. */
export type PlayerId = 0 | 1 | 2 | 3;

/** Cartes restantes en main d'un joueur en fin de manche : 0 à 16. */
export type CardCount = number;

/** Sens de jeu affiché (display seul, dérivé du numéro de manche). */
export type Direction = 'horaire' | 'anti-horaire';

/** Position horaire de chaque joueur — dérivée de la grille, sert au départage niveau 2. */
export type Seats = Record<PlayerId, number>;

/** Joueur — état STOCKÉ. `couleur` dérive de la position (voir theme/tokens). */
export interface Player {
  id: PlayerId;
  prenom: string;
}

/** Manche — la seule saisie utilisateur STOCKÉE. */
export interface Round {
  cardCounts: Record<PlayerId, CardCount>;
}

export type GameStatus = 'en-cours' | 'terminee';

/** Partie — LA source de vérité stockée. Rien de dérivé ici. */
export interface Game {
  players: Record<PlayerId, Player>;
  rounds: Round[];
  status: GameStatus;
}

export const PLAYER_IDS: readonly PlayerId[] = [0, 1, 2, 3];
export const MAX_CARDS = 16;
export const WINNING_THRESHOLD = 100;

/** Partie archivée (terminée ou interrompue). */
export interface GameArchive {
  archivedAt: number;
  players: Record<PlayerId, Player>;
  rounds: Round[];
  status: GameStatus;
}

/** Ensemble de parties regroupées par date (tolérance nuit : avant 5h = veille). */
export interface Soiree {
  date: string; // YYYY-MM-DD
  parties: GameArchive[];
}

/**
 * Ordre horaire des sièges dérivé de la grille 2×2 (vue du sud, proprio en bas).
 * Sens horaire vu de dessus : HG(0) → HD(1) → BD(3) → BG(2). L'index est le rang horaire.
 * Validé par Eric (2026-07-05) : grille écran = table vue de dessus, horaire réel.
 * N'influe que sur le départage niveau 2 (cas rare : égalité totale ET égalité de dernière manche).
 */
export const TABLE_SEATS: Seats = { 0: 0, 1: 1, 3: 2, 2: 3 };

/**
 * Ordre de présentation « tour de table » : les joueurs rangés par rang horaire
 * (dérivé de TABLE_SEATS) → [0, 1, 3, 2]. Sert aux colonnes du carnet et aux
 * sélecteurs de saisie, pour suivre qui joue après qui plutôt que l'ordre PlayerId.
 */
export const SEAT_ORDER: readonly PlayerId[] = ([...PLAYER_IDS] as PlayerId[]).sort(
  (a, b) => TABLE_SEATS[a] - TABLE_SEATS[b],
);
