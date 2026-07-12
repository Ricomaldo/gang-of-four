---
title: GANG — Specs techniques
created: 2026-07-03
updated: '2026-07-12'
version: 0.2.1
status: active
type: specs
---

# GANG — Specs techniques

Ce fichier porte le *quoi* complet avant le move en forge : le plancher, les items commission hors plancher, et les contraintes de stack. Le *comment* — modèle de données, barème, logique détaillée, tests — s'écrit en forge. L'**IA et l'architecture d'écran** (hub-and-spoke, accueil / Round / stèle + feuille) vivent dans [[specs-ecrans]] — référencée ici, pas décrite.

## Plancher — ce qui ne doit pas manquer

- Saisir les cartes restantes des 4 joueurs à la fin d'une manche.
- En tirer un score juste (multiplicateur par paliers).
- Cumuler de manche en manche.
- S'arrêter à 100 et annoncer le gagnant.

En une phrase : **saisir quatre nombres par manche, en tirer un score juste, cumuler, s'arrêter à 100.**

## Feature frime — dans la commission, hors plancher

La frime « Gang of Four ! » : **tap sur le Gong central** (visible, gros, l'asset `gang-of-four.webp` — cf. signature/frime.md) déclenche une **animation plein écran + un son aléatoire**, quand un joueur pose un Gang of Four (4 cartes de même valeur — combinaison rare qui domine la table). La frime **sort de l'easter-egg** : c'est le **long-press sur une pill** qui est abandonné (il ne passait pas le filtre d'affordance — un inconnu ne le trouvait pas ; central = il se trouve seul). Assets (animation, pool de sons) à fournir.

La frime **n'est pas associée à un joueur** — prix assumé du gain d'affordance (cf. signature/frime.md §prix assumé). Ce qui est compté : le **nb de GOF global par partie** (jamais par joueur), avec une mention d'affichage (cf. signature/reshape.md §fourches tranchées 12/07, pt 6).

## Les 3 issues d'une partie

Une partie a **trois issues** (cf. signature/reshape.md §IA des écrans) :

- **en cours** — la pause : une partie quittée est **en pause, jamais perdue** (état *reprise*, persisté) ;
- **annulée** — jetée, pour un imprévu ; **confirmation légère à l'accueil** (« la partie en cours sera perdue ») ; **jamais dans le gravé** ;
- **terminée** — à 100 → scellée → entre au vrac (le carnet du gang).

Seules les terminées entrent dans la mémoire ; aucune ne traîne à moitié. La persistance **existe** (partie en cours reprise, terminées gravées) — la confirmation d'annulation reste un garde-fou d'un tap, et ne vaut **que** pour cette action destructrice : jamais sur le flux de saisie normal, jamais sur la frime.

## Stack

- Framework : React Native / Expo managed
- Audio : expo-audio (expo-av écarté — retiré des SDK Expo récents, non viable sur Expo 57)
- Animation : Animated API — pas de dépendance native ajoutée
- État : local, single device — pas de réseau. Persistance **locale** (AsyncStorage étendu) : le **gravé est palier 1, local only** (cf. signature/reshape.md §fourches tranchées 12/07, pt 1) ; la DB (P2) est une *migration*, pas un prérequis
