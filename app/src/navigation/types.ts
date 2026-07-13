/* ═══ RESHAPE 0.2 · TAG [R] reshapé — hub-and-spoke (lot 3a) + lot 3b ═══
 * Cible : routes hub-and-spoke (accueil/Round/stèle/feuille).
 * Lot : lot 3a/3b — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Contrat de navigation — stack unique (React Navigation, native-stack).
 * Tout passe par l'accueil (le moyeu) ; pas de lien direct écran↔écran.
 */
export type RootStackParamList = {
  Accueil: undefined; // le moyeu — porte + carrefour (jouer / consulter)
  Round: undefined; // écran manche (nommer/jouer/saisir/fin, en états)
  Stele: { gangKey: string }; // le palmarès d'un gang
  // sans archiveId = la partie en cours (depuis le Round) ; avec archiveId = une partie passée (depuis la stèle)
  Feuille: { archiveId?: string } | undefined;
};
