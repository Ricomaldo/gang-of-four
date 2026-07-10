---
title: GoF — Brief wireframes, creuse 1b (saisie fin de manche)
created: '2026-07-04'
updated: '2026-07-04'
version: 0.1.0
status: active
type: brief-design
---

# GoF — Brief wireframes, creuse 1b (saisie fin de manche)

Suite de [[brief-wireframes-ecran-manches]]. 1b retenu (uniforme, lu depuis le sud, esprit tableau de score classique). Cette passe approfondit la saisie de fin de manche, remplacée par un flux plus précis que le stepper inline d'origine — trop coûteux en taps pour les valeurs hautes (jusqu'à 29 taps pour une manche à 12/13/14 cartes restantes).

## Ce qui ne bouge pas de 1b

- Layout des 4 quadrants : uniforme, lu depuis le sud, pas de rotation par siège.
- Zone centrale : bouton « fin de manche » uniquement — le frime Gang of Four se déclenche par tap sur le quadrant d'un joueur, pas ici ([[../../_commission/brief-01-amorce]]).
- Ordre des joueurs : celui de la saisie des prénoms au démarrage (premier prénom = quadrant/bouton le plus à gauche).

## Ce qui remplace la saisie inline d'origine

Tap sur « fin de manche » → écran dédié :

- Un seul pavé numérique, grand — pas 4 petits pavés côte à côte.
- En dessous, 4 boutons empilés (couleur + initiale), dans l'ordre des sièges, affichant en direct le nombre de cartes en cours de saisie pour ce joueur.
- En haut, un header affichant le prénom complet du joueur actuellement sélectionné.
- Tap sur un bouton = le sélectionne comme cible de saisie active — ordre libre, pas forcément 1→2→3→4.
- Sélection par défaut à l'ouverture :
  - Manche 1 : le bouton le plus à gauche (premier prénom renseigné).
  - Manches suivantes : le gagnant de la manche précédente ([[logique-comptage]] — `roundWinner`).
- Règle de saisie sur le pavé : le premier chiffre tapé (0, ou 2 à 9) valide immédiatement la valeur ; seul le chiffre 1 attend un second chiffre, pour couvrir 10 à 16.
- Bouton « Valider » une fois les 4 joueurs renseignés — calcule les scores (écran suivant hors scope ici).

## Hors scope de cette passe

- L'écran de récap / grille de scores après validation — session UI séparée, déjà actée.
- L'écran de démarrage (saisie des 4 prénoms avant la première manche) — nouveau besoin, non encore spécifié, juste noté ici comme dépendance ([[modele-donnees]]).

## Ce qu'on demande à Claude Design

Une seule direction cette fois, pas 3-4 alternatives : le raffinement fidèle de 1b avec ce flux de saisie précis. Basse fidélité, comme le round 1.

Jeu de données pour peupler les wireframes : **Bruno, Damien, Franz, Jacques**.
