---
title: 'GANG — Écran : la feuille (la grille d''une partie)'
created: '2026-07-11'
updated: '2026-07-31'
version: 0.2.2
status: draft
type: fiche-ecran
---

# GANG — La feuille (la grille d'une partie)

> **Fiche-écran niveau wireframe — pour le brief Claude Design.** Design source :
> `reshape.md` (le gravé, crayon/gravé). **C'est une MODALE** — elle monte par
> glissé, se referme.

## Rôle

La **grille manche × joueur d'UNE partie.** Une **modale** qui monte pour
consulter, puis se referme. On l'ouvre **depuis le Round** (la partie en cours) ou
**depuis la stèle** (une partie passée du gang). Reshape de `ScoreCarnet`.

> **⚠ Chiffres d'exemple non conformes au barème** (relevé passe specs 12/07) :
> un score de manche ne peut valoir que 0-7 · 16-20 · 33-39 · 56-60 · 80 (cartes
> × palier). Les valeurs ci-dessous (12, 14, 9…) illustrent la **forme** ; les
> cas **corrects** font foi dans `specs/cas-reference-score.md` §branlée.

## Les zones

```
┌── Établi · 8 juin ───────────── [✕] ──┐   titre = la SESSION (lieu · date)
│           Marc   Léa   Tom   Zoé       │
│   M1        5     0     8     3         │   ← crayon (léger)
│   M2        2     4     0     9         │
│   M3      0 💪   14     9    12         │   ← BRANLÉE (35 ≥ 30) : gravé, pèse ; 💪 = le donneur (à 0)
│   TOT       7    18    17    24         │   la ligne des totaux
│                              [partager] │
└────────────────────────────────────────┘
```

*Règles portées par l'exemple (cf. `branlee.md`, `palmares.md`) : une branlée =
**≥ ~30 pts distribués sur la manche** ; la **marque 💪 va sur le donneur** (le
joueur à **0**, qui a plié) — les preneurs ne portent aucune marque, leur honte se
lit dans leurs gros scores. **💪 = emoji provisoire** (candidat, non scellé).*

## Les états *(les deux matières d'écriture)*

| état | la feuille |
|---|---|
| **partie en cours** | la **dernière ligne = crayon** (léger, éditable — on corrige sa faute de frappe) ; le reste figé |
| **partie passée** | **tout gravé** (lourd, non éditable) |
| **une branlée** (n'importe où) | la ligne **pèse** : plus sombre, enfoncée, + sa marque — *« un inconnu le sentirait sans notice »* |

## Éléments clés

- **la grille** manche × joueur + la ligne **TOTAL** ;
- **les deux matières** : crayon (présent, léger) vs **gravé** (permanent, lourd) ;
- **la branlée qui pèse** dans la grille ;
- **partager** — capture WYSIWYG de la feuille affichée (partage natif).

## Filtre « détails » — réintroduit (31/07)

Deux versions, un bouton (hors zone de capture, donc **jamais dans le partage**,
mais **le partage respecte le mode affiché à l'instant T**) :
- **simple (défaut)** — cellules en **cumul** (comme la 0.1), branlée invisible
  (pas de bande inversée, pas de marque, pas de légende) ;
- **détails (activé)** — score **par manche** (comme le wireframe ci-dessus),
  branlée visible avec sa marque `‡`/`‡‡` et sa légende.
La matière crayon/gravé (ligne éditable, précédence branlée) est **indépendante**
du filtre — elle reste vraie dans les deux modes.

## Ce qui fait GANG *(signature)*

- **crayon vs gravé** rendu **visible** (le relief : on *voit* la mémoire, on ne la lit pas) ;
- la **branlée gravée** — la seule chose qui ne s'efface pas.

## Navigation

- **se referme** (glissé vers le bas / ✕) → revient à l'écran d'en dessous (Round ou stèle).
