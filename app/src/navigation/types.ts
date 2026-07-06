/** Contrat de navigation — stack unique (React Navigation, native-stack). */
export type RootStackParamList = {
  Splash: undefined;
  Setup: undefined; // saisie des 4 prénoms (grille 2×2 réutilisée, clavier géré)
  Round: undefined; // écran manche (jeu + fin de partie)
  ScoreEntry: undefined; // saisie de fin de manche (présentée en modal)
  ScoreGrid: undefined; // carnet de score (présenté en modal)
};
