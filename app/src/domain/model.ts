/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : +gofCount (stocké), statut 3 issues (en-cours/annulée/terminée), session = date + lieu optionnel.
 * Lot : lot 0 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Modèle de données — le socle d'état typé.
 * Source de vérité : app/docs/specs/modele-donnees.md v0.1.5, app/docs/specs/logique-comptage.md v0.1.2.
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

/** Les 3 issues (reshape 0.2) : en-cours (pause, reprenable) · annulee (jetée, jamais archivée) · terminee (scellée → vrac). */
export type GameStatus = 'en-cours' | 'annulee' | 'terminee';

/**
 * Partie — LA source de vérité stockée. Rien de dérivé ici.
 * `id` + `leagueId` = provenance (base du relai P2), semés à la création, jamais dérivés.
 * `gofCount` optionnel en type (défaut runtime 0, semé par le store) — un site
 * d'affichage hérité (ScoreGridScreen, gelé) construit encore un GameArchive sans
 * ce champ ; le rendre requis y casserait tsc sans toucher d'UI. Cf. handoff lot 0.
 */
export interface Game {
  id: string;
  leagueId: string;
  players: Record<PlayerId, Player>;
  rounds: Round[];
  status: GameStatus;
  gofCount?: number;
}

export const PLAYER_IDS: readonly PlayerId[] = [0, 1, 2, 3];
export const MAX_CARDS = 16;
export const WINNING_THRESHOLD = 100;

/** Ligue par défaut — placeholder P1, vrai nom décidé hors-code (cf. brief-ligue). */
export const DEFAULT_LEAGUE_ID = 'proto-ligue';

/**
 * uuid v4 pur-JS (Math.random) — aucune dépendance native. Assure l'idempotence de
 * l'upload P2 (jamais compter deux fois la même partie) ; pas un usage cryptographique.
 */
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Partie archivée (terminée). Seule la terminée est archivée — l'annulée ne l'est jamais. Porte la provenance de la partie. */
export interface GameArchive {
  id: string;
  leagueId: string;
  archivedAt: number;
  players: Record<PlayerId, Player>;
  rounds: Round[];
  status: GameStatus;
  gofCount?: number;
}

/** Ensemble de parties regroupées par date (tolérance nuit : avant 5h = veille) — dérivé, jamais stocké tel quel. */
export interface Soiree {
  date: string; // YYYY-MM-DD
  parties: GameArchive[];
}

/** Le vrac — LE stockage neuf (lot 0) : toutes les GameArchive terminées, à plat, inter-sessions (P1 local). */
export interface Vrac {
  schemaVersion: number;
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
