/* ═══ RESHAPE 0.2 · TAG [R] reshapé — LE PLACARD ═══
 * L'instrument de la signature « placard » : la palette EXACTE, les 3 fontes
 * d'affiche, les 2 matières, les traits. Source qui fait foi : la spec placard
 * (Claude Design, projet « Wireframes GANG app » · GANG - Specs placard) +
 * specs-ecrans.md §Le thème. On ne règle plus des placeholders : on pose
 * l'identité tranchée (Anton / noir-crème / le chaud sur le vivant seul).
 *
 * Transition : les anciens jetons (fondCreme/fondPill/accentSaisie/score/bordure,
 * + `chaleur`/`siege`/`seatColors`/`matiere.grave`) restent exportés le temps
 * que les 5 écrans passent au placard, puis sont retirés. Marqués @deprecated.
 * ═══════════════════════════════ */
import type { PlayerId } from '../domain/model';

/**
 * LES FONTES (spec placard §02). Chargées au runtime par `useFonts` (App.tsx),
 * via @expo-google-fonts — le `fontFamily` est la clé d'export du package.
 * - `affiche` (Anton) : le wordmark GA/NG, les totaux, les trônes, les
 *   manchettes. TOUJOURS capitales, letter-spacing 1–4. C'est LUI qui fait
 *   « l'affiche » (Anton 88px ≠ gras-système : c'est toute la différence).
 * - `mono*` (IBM Plex Mono) : labels, grille de données, chrome, méta, cartouche.
 * - `crayon` (Caveat) : l'annotation manuscrite du live — usage RARE (sur le
 *   placard le crayon s'exprime surtout par l'orangé + le dashed, pas la cursive).
 */
export const fonts = {
  affiche: 'Anton_400Regular',
  mono: 'IBMPlexMono_400Regular',
  monoMed: 'IBMPlexMono_500Medium',
  monoBold: 'IBMPlexMono_600SemiBold',
  crayon: 'Caveat_700Bold',
} as const;

/**
 * LA PALETTE (spec placard §01). Deux familles + une exception.
 * — le SOCLE noir / crème : partout, toujours.
 * — les CHAUDS du logo : le LIVE uniquement (le Round). RÈGLE D'OR — le chaud ne
 *   se pose que sur ce qui est vivant (meneur, disque, manche éditable). La
 *   mémoire (stèle, feuille passée) reste strictement noir / crème.
 * — la CICATRICE (brique / rougeClair) : la seule chaleur tolérée sur la
 *   mémoire — elle marque la branlée, le looser, la revanche (le passé qui pèse).
 */
const socle = {
  encre: '#1B1814', // noir chaud — la mémoire, les traits, l'inverse
  cremePage: '#F2EDE0', // le fond, le papier
  cremeRelief: '#F7F3E8', // le disque, surfaces relevées
  murmure: '#6E675C', // labels secondaires, la voix calme
  estompe: '#B7AF9E', // inactif, la ligne vierge, méta
  pierre: '#8A8272', // texte 2ᵈ sur fond noir
  rouge: '#C0231F', // le meneur (le projecteur) · branlée live       [LIVE]
  orange: '#E06B1A', // le crayon (manche éditable) · rayonnement       [LIVE]
  ambre: '#F0A11C', // la lumière · halo disque · nom du meneur        [LIVE]
  brique: '#B3402E', // revanche · légende branlée                 [CICATRICE]
  rougeClair: '#D98573', // ‡ / ☞ sur fond noir (lisible sans crier)  [CICATRICE]
} as const;

export const palette = {
  ...socle,
  // — transition placard (@deprecated — retiré une fois les 5 écrans restylés) —
  fondCreme: socle.cremePage,
  fondPill: socle.cremeRelief,
  score: socle.encre,
  accentSaisie: socle.orange,
  bordure: 'rgba(27,24,20,0.18)',
  bordureForte: 'rgba(27,24,20,0.40)',
};

/**
 * Rôles typo. `proclaim` = l'affiche (Anton) : ce qui proclame. `chrome` =
 * l'appareil (mono) : labels & données. `crayon` = Caveat, l'annotation live.
 * (Anton n'a qu'une graisse — `fontWeight` est inopérant dessus, le corps fait
 * le poids ; on empile les tailles au cas par cas dans les écrans.)
 */
export const typography = {
  proclaim: { fontFamily: fonts.affiche, letterSpacing: 1 },
  chrome: { fontFamily: fonts.mono, letterSpacing: 0.5 },
  crayon: { fontFamily: fonts.crayon },
} as const;

/**
 * Les DEUX MATIÈRES (spec placard §03), le cœur du système.
 * - `crayon` : le présent, léger, réversible — cadre DASHED orangé, chiffres
 *   gris, fond crème (option jaune pâle `voile`). Éditable sans confirmation.
 * - `grave` : la mémoire, lourd, définitif — bande INVERSÉE (fond encre, texte
 *   crème), trait épais. Ça pèse, non éditable. (RN ne fait pas d'inset-shadow ;
 *   le relief « creusé » s'approxime d'un filet haut `reliefHaut`.)
 */
export const matiere = {
  crayon: {
    fond: palette.cremePage,
    encre: palette.murmure,
    bordure: palette.orange,
    voile: 'rgba(240,161,28,0.10)', // jaune pâle optionnel sous le crayon
  },
  grave: {
    fond: palette.encre,
    encre: palette.cremePage,
    overlay: 'rgba(27,24,20,0.92)', // calque translucide (annonce), ≠ fond opaque
    reliefHaut: 'rgba(242,237,224,0.15)', // filet clair en haut = le « creusé »
  },
} as const;

/**
 * Formes & traits. Le placard est fait de TRAITS PLEINS (pas de bordures
 * translucides) : `trait` standard, `traitFort` pour les séparateurs majeurs
 * (bord haut du plateau, ligne TOTAL, entêtes).
 */
export const shapes = {
  pillRadius: 14,
  pillBorder: 2,
  discSize: 88, // le Gong (affiné dans le composant)
  discBorder: 6,
  trait: 2,
  traitFort: 4,
} as const;

/* ══════════════ TRANSITION — @deprecated, retiré à mesure du restyle ══════════════ */

/**
 * @deprecated Les chaleurs de l'échafaudage lot 4a. La spec placard nomme les
 * chauds directement (`palette.rouge/orange/ambre/brique`). Encore lu par
 * `Gong` et `SteleScreen` (revanche) — migrés à leur restyle, puis supprimé.
 */
export const chaleur = {
  braise: palette.orange,
  brasier: palette.rouge,
} as const;

/**
 * @deprecated Les 4 couleurs de siège. Le placard les RETIRE : le plateau est
 * noir / crème, seul le meneur s'allume (rouge). Conservé le temps que
 * `RoundScreen` bascule sur ce modèle, puis supprimé.
 */
export const siege = {
  hautGauche: palette.encre,
  hautDroite: palette.encre,
  basGauche: palette.encre,
  basDroite: palette.encre,
} as const;

/** @deprecated cf. `siege` — indexé par PlayerId, tous en encre en attendant le retrait. */
export const seatColors: Record<PlayerId, string> = {
  0: siege.hautGauche,
  1: siege.hautDroite,
  2: siege.basGauche,
  3: siege.basDroite,
};
