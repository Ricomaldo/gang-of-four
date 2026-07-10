---
title: GoF — Specs techniques
created: 2026-07-03
updated: 2026-07-04
version: 0.1.4
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

Easter egg « Gang of Four ! » : **appui long sur la pill d'un joueur** (écran manche) déclenche une **animation plein écran + un son aléatoire**, quand un joueur pose un Gang of Four (4 cartes de même valeur — combinaison rare qui domine la table). **Aucun indicateur visuel au repos** : ça ne se signale pas, c'est un easter egg. L'ancienne mécanique — bouton central, arc qui se remplit dans le quadrant — est **abandonnée**. Assets (animation, pool de sons) à fournir.

Phase 2 (nœud éjectable) : associer le GoF à un joueur et comptabiliser par joueur sur la partie.

## Nouvelle partie — hors plancher, retenue en V1

Une action **« nouvelle partie »** existe en V1 : elle repart de zéro, la partie en cours effacée. Comme **aucune sheet n'est sauvée à ce stade**, l'effacement est sans retour — donc elle est précédée d'une **confirmation légère** (« la partie en cours sera perdue »). C'est un garde-fou d'un tap, *pas* de la persistance. La confirmation ne vaut **que** pour cette action destructrice : jamais sur le flux de saisie normal, jamais sur l'easter egg.

## Stack

- Framework : React Native / Expo managed
- Audio : expo-audio (expo-av écarté — retiré des SDK Expo récents, non viable sur Expo 57)
- Animation : Animated API — pas de dépendance native ajoutée
- État : local, single device — pas de réseau, pas de persistance cross-session
