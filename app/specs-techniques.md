---
title: GoF — Specs techniques
created: 2026-07-03
updated: 2026-07-03
version: 0.3.0
status: active
type: specs
---

# GoF — Specs techniques

Ce fichier porte le *quoi* complet avant le move en forge : le plancher, les items commission hors plancher, et les contraintes de stack. Le *comment* — modèle de données, barème, logique détaillée, tests — s'écrit en forge.

## Plancher — ce qui ne doit pas manquer

- Saisir les cartes restantes des 4 joueurs à la fin d'une manche.
- En tirer un score juste (multiplicateur par paliers).
- Cumuler de manche en manche.
- S'arrêter à 100 et annoncer le gagnant.

En une phrase : **saisir quatre nombres par manche, en tirer un score juste, cumuler, s'arrêter à 100.**

## Feature frime — dans la commission, hors plancher

Bouton central « Gang of Four ! » : déclenche une animation graphique et un son quand un joueur pose un Gang of Four (4 cartes de même valeur — combinaison rare qui domine la table). UX et animation à définir en forge.

Phase 2 (nœud éjectable) : associer le GoF à un joueur et comptabiliser par joueur sur la partie.

## Stack

- Framework : React Native / Expo managed
- Audio : expo-av
- Animation : Animated API — pas de dépendance native ajoutée
- État : local, single device — pas de réseau, pas de persistance cross-session
