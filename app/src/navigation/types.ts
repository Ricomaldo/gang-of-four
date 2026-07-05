/** Contrat de navigation — stack unique (React Navigation, native-stack). */
export type RootStackParamList = {
  Splash: undefined;
  Round: undefined; // écran manche = aussi le démarrage (pills éditables si prénoms vides)
  ScoreEntry: undefined; // saisie de fin de manche (présentée en modal)
  ScoreGrid: undefined; // carnet de score (présenté en modal)
};
