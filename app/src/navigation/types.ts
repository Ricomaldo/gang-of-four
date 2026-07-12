/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : routes hub-and-spoke (accueil/Round/stèle/feuille).
 * Lot : lot 3 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/** Contrat de navigation — stack unique (React Navigation, native-stack). */
export type RootStackParamList = {
  Splash: undefined;
  Setup: undefined; // saisie des 4 prénoms (grille 2×2 réutilisée, clavier géré)
  Round: undefined; // écran manche (jeu + fin de partie)
  ScoreEntry: undefined; // saisie de fin de manche (présentée en modal)
  ScoreGrid: undefined; // carnet de score (présenté en modal)
};
