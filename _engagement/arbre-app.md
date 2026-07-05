---
title: GoF — Arbre-app
created: 2026-07-02
updated: 2026-07-05
version: 0.3.0
status: active
type: arbre-des-fins
---

# GoF — Arbre-app

Structure moyens-fins. Chaque nœud est une fin ; ses enfants sont ce qui doit être vrai pour qu'elle le soit. Pas de temps, pas de séquence ici — seulement la logique du « pour quoi ». Le séquençage viendra après.

## Racine

Mes potes jouent avec plaisir et je prends plaisir à développer.

## Branche 1 — le décompte est fidèle aux règles

L'app compte les points, elle ne fait pas jouer. Aucune modélisation des cartes ni des combinaisons : c'est hors scope.

- Une partie a toujours 4 joueurs.
- Une manche produit, pour chaque joueur, un nombre de cartes restantes en main.
- Chaque manche, un joueur pose toute sa main, marque zéro, et devient le dealer de la manche suivante.
- Le score d'une manche = cartes restantes × un multiplicateur.
- Le multiplicateur est déterminé par des paliers de nombre de cartes (barème exact à poser au moment du code).
- Les scores s'accumulent de manche en manche.
- La partie s'arrête dès qu'un joueur atteint 100.
- Le gagnant est celui qui a le moins de points.
- Un état persiste entre les manches : qui est dealer.

## Branche 2 — l'app s'utilise sans friction pendant une partie

Le geste central, répété toute la soirée, est la saisie de fin de manche. L'app se gagne ou se perd là.

Deux nœuds tranchés par le manifeste, en faveur de la version qui protège :

- Un seul appareil qui tourne autour de la table. Pas de réseau, pas de partage d'état multi-appareils.
- La partie vit puis oublie. Pas d'historique ni de stats entre soirées au départ — nœud éjectable, rouvrable seulement si le besoin naît à la table.

### Le plancher — ce qui ne doit pas manquer

Non pas ce qui serait bien, mais ce qui, absent, fait rater l'app à la table :

- Saisir les cartes restantes des 4 joueurs à la fin d'une manche.
- En tirer un score juste (multiplicateur par paliers).
- Cumuler de manche en manche.
- S'arrêter à 100 et annoncer le gagnant.

En une phrase : **saisir quatre nombres par manche, en tirer un score juste, cumuler, s'arrêter à 100.**

Confort, hors plancher : nommer les joueurs, afficher le dealer, démarrer proprement une partie. Une soirée est jouable sans, de mémoire.

Feature frime — dans la commission, nœud éjectable : animation + son au tap sur la zone d'un joueur (« Gang of Four ! »), comptage des GOF par joueur. Pas dans le plancher, mais dans la demande de Damien — à rouvrir en forge selon la dispo.

## Branche 3 — le jeu se raconte (Le Social)

Révélée par l'usage, pas prévue au départ : le premier retour de Damien (voir `_commission/journal-damien`) montre que l'app sert une fin de plus — la vie sociale de la partie. Une bande qui se vanne depuis trente ans veut du récit : palmarès, feuille qu'on s'envoie, « voir quand on s'est losé ». C'est la réouverture, par un besoin né à la table, du nœud « la partie oublie » de la branche 2 — précisément la condition qui l'autorisait.

Ce qui doit être vrai pour qu'elle le soit :

- La partie laisse une trace lisible : une feuille de score manche × joueur, pas seulement des totaux.
- Cette trace se partage sans infrastructure : le partage natif du téléphone suffit — pas de serveur, pas de comptes, le multi-appareils reste tranché.
- Le suivi valorise le récit : manches gagnées, manches jouées, et la frime (le « Gang of Four ! » de la combinaison reine).

Le séquençage de cette branche en paliers (le premier : « Le Palmarès ») n'est pas ici — l'arbre dit le pourquoi, pas l'ordre.
