/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : palette placard : noir/crème + chaleurs du logo ; 4 couleurs de siège À REDESSINER ; marques typo.
 * Lot : lot 1 (ossature) + lot 4 (polish) — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 *
 * + `chaleur` / `siege` / `matiere` (lot 4, brief 2026-07-13) : l'échafaudage des
 * tokens réglables — les VALEURS restent provisoires (placeholder), c'est la
 * STRUCTURE qui doit rendre le réglage trivial pour Eric (son geste, sur
 * device). `palette.accentSaisie` et `seatColors` sont conservés tels quels
 * (tous les sites d'appel existants continuent de fonctionner) mais dérivent
 * maintenant de `chaleur`/`siege` — une seule source, la propagation suit.
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

/**
 * Les 4 couleurs de siège, NOMMÉES (specs-ecrans §Le thème : « en chantier —
 * à redessiner en cohérence placard »). Valeurs actuelles = placeholder,
 * inchangées ; seul le nommage change, pour que le redesign d'Eric touche un
 * seul endroit. `seatColors` (ci-dessous, indexé PlayerId) en dérive — tous
 * les sites d'appel existants (`seatColors[id]`) sont inchangés.
 */
export const siege = {
  hautGauche: '#C8483C', // rouge brique
  hautDroite: '#3E6DA6', // bleu
  basGauche: '#4E9D6C', // vert
  basDroite: '#E0A83A', // ambre
};

export const seatColors: Record<PlayerId, string> = {
  0: siege.hautGauche,
  1: siege.hautDroite,
  2: siege.basGauche,
  3: siege.basDroite,
};

/**
 * Les chaleurs du logo (rouge / jaune-orangé) — l'accent placard, cf.
 * specs-ecrans §Le thème : « le meneur, le disque qui rayonne, la manche
 * éditable — intensité entre "braise" (4d) et "brasier" (4f), calée aux
 * tokens. » Valeurs provisoires (l'intervalle 4d↔4f reste à caler par Eric) ;
 * `braise` = l'accent de base (ex-`accentSaisie`), `brasier` = le pic
 * d'intensité (le Gong, le rugissement).
 */
export const chaleur = {
  braise: '#C86A4A',
  brasier: '#E0522A',
};

/** Neutres & surfaces (indicatifs — voir handoff, à affiner avec le design system). */
export const palette = {
  encre: '#1A1A1A', // texte principal
  score: '#111111', // chiffres de score (élément dominant)
  fondCreme: '#F4F1E8', // fond écran (crème carnet)
  fondPill: '#FFFEFB', // fond pill
  accentSaisie: chaleur.braise, // chiffre en attente « 1_ » — alias, dérive de chaleur.braise
  bordure: 'rgba(0,0,0,0.18)',
  bordureForte: 'rgba(0,0,0,0.40)',
};

/**
 * La dualité-mère crayon / gravé (reshape.md §La dualité-mère), en tokens de
 * matière — léger/manuscrit/réversible vs lourd/inversé/définitif. `crayon`
 * documente le défaut déjà partout (`palette.fondCreme`/`palette.encre`, non
 * migré — zéro bénéfice à renommer ce qui propage déjà) ; `grave` est LE
 * token à router vers les surfaces inverse existantes (branlée, stèle,
 * annonce finale) pour qu'un réglage se propage aux trois d'un coup.
 * `grave.overlay` porte l'alpha (calque translucide, ex. l'annonce) — distinct
 * de `grave.fond` (opaque, ex. la stèle) : ne pas les confondre au risque
 * d'aplatir une transparence voulue.
 */
export const matiere = {
  crayon: { fond: palette.fondCreme, encre: palette.encre, poids: '600' as const },
  grave: { fond: palette.encre, encre: palette.fondCreme, overlay: 'rgba(26,26,26,0.92)', poids: '800' as const },
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
