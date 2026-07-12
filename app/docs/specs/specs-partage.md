---
title: GANG — Specs partage
created: 2026-07-07
updated: '2026-07-12'
version: 0.2.1
status: active
type: specs
---

# GANG — Specs partage

Partage de la **feuille de score d'une partie**, via le partage natif du téléphone. Feature de la commande — [[brief-02-complement]] FD-05 : *« une feuille de score détaillée manche × joueur, comme la feuille papier, pour voir quand on s'est losé »*.

## L'artefact — la feuille d'une partie

On partage **la feuille affichée** (la modale, ex-`ScoreCarnet` — cf. signature/ecrans/04-feuille) ; la navigation des parties passées se fait via la **stèle** (une partie du gang → sa feuille). Un partage = **un artefact** : la grille manche × joueur d'**une** partie, pas l'écran entier, pas la session.

- **Capture image**, pas texte. La feuille de score *est* visuelle (« comme le papier ») — le texte trahirait l'artefact.
- **WYSIWYG** : on capture la feuille **dans l'état affiché**. Le toggle « détails » `showDetails` **disparaît** — les cellules **sont les scores de manche** (décision 12/07, cf. signature/reshape.md §fourches pt 4), le cumul vit sur TOT et les pills ; le « quand on s'est losé » est toujours dans l'image, sans toggle.
- **L'artefact porte la signature** : la **branlée gravée qui pèse** dans la grille (ligne plus sombre, enfoncée) + les **marques typo** (ex-emojis, cf. signature/palmares.md §rendu des marques). Ce qu'on partage, c'est la feuille de GANG, pas une grille neutre.

## Le mécanisme

- **`react-native-view-shot`** — capture la vue de la feuille en image, puis **`Share` API** (RN natif) pour le partage système. Pas de serveur, pas de compte (le multi-appareils reste tranché, [[brief-02-complement]]).
- Dépendance native de plus → **build EAS**. À **grouper** avec le build de l'anim / stats, jamais déclenché isolément (abonnement EAS compté).

## L'emplacement

Un bouton **`[partager]` dans la feuille** (la modale — cf. signature/ecrans/04-feuille). Il capture la partie couramment affichée, que la feuille soit ouverte depuis le Round (partie en cours) ou depuis la **stèle** (partie passée du gang).

## Périmètre — les deux artefacts, à tout moment *(élargi par Eric, 12/07)*

- **A — la feuille d'une partie** : la grille manche × joueur. Partageable **à tout moment** (partie en cours comprise — pas seulement à la fin).
- **B — la stèle** (le palmarès du gang) : **entre au périmètre** (décision 12/07 : « les deux peuvent se partager à tout moment »). Même mécanique (capture WYSIWYG, bouton `[partager]` dans la stèle), artefact et intention différents (frimer, pas rejouer) — c'est *le partage qui recrute* : « champion ✌️ » → le groupe voit → adoption.

## Le titre de l'artefact

L'image partagée porte le **titre de la feuille = la session** : lieu (optionnel) · date — **« Établi · 8 juin »** (cf. signature/palmares.md §scopes, [[modele-donnees]]). Contexte hors-app intégré, plus d'en-tête à inventer.
