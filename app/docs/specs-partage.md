---
title: GoF — Specs partage
created: 2026-07-07
updated: 2026-07-07
version: 0.1.0
status: active
type: specs
---

# GoF — Specs partage

Partage de la **feuille de score d'une partie**, via le partage natif du téléphone. Feature de la commande — [[brief-02-complement]] FD-05 : *« une feuille de score détaillée manche × joueur, comme la feuille papier, pour voir quand on s'est losé »*.

## L'artefact — le carnet d'une partie

On partage **le `ScoreCarnet` de la partie affichée** sur `ScoreGrid` (l'écran navigue déjà les parties de la soirée). Un partage = **un artefact** : la grille manche × joueur d'**une** partie, pas l'écran entier, pas la soirée.

- **Capture image**, pas texte. La feuille de score *est* visuelle (« comme le papier ») — le texte trahirait l'artefact.
- **WYSIWYG** : on capture le carnet **dans l'état affiché** (toggle « détails » `showDetails` respecté). Si l'utilisateur a ouvert les `+N` par manche, ils sont dans l'image — c'est justement le « quand on s'est losé ».

## Le mécanisme

- **`react-native-view-shot`** — capture la vue du `ScoreCarnet` en image, puis **`Share` API** (RN natif) pour le partage système. Pas de serveur, pas de compte (le multi-appareils reste tranché, [[brief-02-complement]]).
- Dépendance native de plus → **build EAS**. À **grouper** avec le build de l'anim / stats, jamais déclenché isolément (abonnement EAS compté).

## L'emplacement

Un **bouton partage** sur `ScoreGrid`, dans le chrome (à côté de la fermeture / navigation soirée). Il capture la partie couramment affichée.

## Périmètre — A seulement

- **A — le carnet d'une partie** : cette spec. La commande.
- **B — le scoreboard soirée** (les 6 stats) : **hors périmètre ici, parqué avec la passe stats** ([[specs-stats]]). Artefact différent, intention différente (frimer, pas rejouer) — et c'est *le partage qui recrute* : « fini Leader ✌️ ce soir » → le groupe voit → adoption. Il porte l'axe récit et la croissance [[brief-ligue]] ; il mûrit avec les stats, pas avec le ledger.

## Polish optionnel (non figé)

Un en-tête léger sur l'image partagée (date de soirée) pour le contexte hors-app. Le carnet porte déjà pastilles + initiales. À l'œil d'Eric, non bloquant.
