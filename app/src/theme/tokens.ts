/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : palette placard : noir/crème + chaleurs du logo ; 4 couleurs de siège À REDESSINER ; marques typo.
 * Lot : lot 1 (ossature) + lot 4 (polish) — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Design tokens — palette « écho du jeu ».
 * Source de vérité : app/docs/specs/modele-donnees.md v0.1.5. Ne pas modifier sans MAJ du doc.
 *
 * Les couleurs joueur sont FIGÉES et liées à la POSITION du quadrant
 * (grille 2×2, propriétaire du téléphone assis en bas), jamais au joueur.
 * Convention d'indexation des quadrants (id = PlayerId) :
 *   0 = haut-gauche · 1 = haut-droite · 2 = bas-gauche · 3 = bas-droite
 */
import type { PlayerId } from '../domain/model';

export const seatColors: Record<PlayerId, string> = {
  0: '#C8483C', // haut-gauche — rouge brique
  1: '#3E6DA6', // haut-droite — bleu
  2: '#4E9D6C', // bas-gauche — vert
  3: '#E0A83A', // bas-droite — ambre
};

/** Neutres & surfaces (indicatifs — voir handoff, à affiner avec le design system). */
export const palette = {
  encre: '#1A1A1A', // texte principal
  score: '#111111', // chiffres de score (élément dominant)
  fondCreme: '#F4F1E8', // fond écran (crème carnet)
  fondPill: '#FFFEFB', // fond pill
  accentSaisie: '#C86A4A', // chiffre en attente « 1_ »
  bordure: 'rgba(0,0,0,0.18)',
  bordureForte: 'rgba(0,0,0,0.40)',
};

/** Formes (indicatif — handoff). */
export const shapes = {
  pillRadius: 15,
  pillBorder: 2.5,
  discSize: 88,
  discBorder: 6,
};

/**
 * Rôles typo — v1 ossature (structure, pas le rendu fin). Deux voix : ce qui
 * PROCLAME (titres, totaux, manchettes — condensé-bold, aucune police custom
 * chargée à ce stade, le poids fait le travail) vs le CHROME (labels, listes —
 * mono, discret). Le rendu fin (police condensée réelle) vient au lot 4.
 */
export const typography = {
  proclaim: {
    fontWeight: '800' as const,
    letterSpacing: 0.3,
  },
  chrome: {
    fontFamily: 'monospace' as const,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
};
