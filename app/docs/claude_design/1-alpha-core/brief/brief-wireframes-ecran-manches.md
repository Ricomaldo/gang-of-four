---
title: GoF — Brief wireframes, écran de manche
created: '2026-07-04'
updated: '2026-07-04'
version: 0.1.0
status: active
type: brief-design
---

# GoF — Brief wireframes, écran de manche

Brief prêt à coller dans Claude Design, pour générer 3-4 pistes de wireframe sur l'écran principal (pendant les manches), avant le scaffold. Contraintes dures séparées des axes de variation, pour éviter 4 variantes cosmétiques d'un même layout.

## Contexte

App de comptage de points pour un jeu de cartes physique à 4, joué sur un seul appareil posé à plat sur table. L'app ne joue pas les cartes, elle compte entre les manches.

## Portée

Uniquement l'écran actif pendant le déroulement des manches. Ni l'écran de classement final (à 100 pts), ni un écran d'accueil.

## Contraintes dures (dans toutes les propositions)

- 4 quadrants, un par joueur, positionnés selon la place réelle autour de la table — l'app est posée à plat, chaque joueur lit son quadrant depuis sa place (orientation/rotation à traiter, pas à esquiver).
- Chaque quadrant affiche : couleur du joueur (4 couleurs imposées), score cumulé, nombre de manches gagnées.
- Zone centrale : bouton « fin de manche » (ouvre la saisie du nb de cartes restantes des 4 joueurs, calcul auto) + pictogramme du sens de jeu (alterne à chaque manche).
- Taper sur la zone d'un joueur déclenche une animation + un son aléatoire (easter egg).
- Pas de nom de joueur, pas de persistance, pas de réglages.

## Hors scope pour cet écran

- Compteur de Gang of Four par joueur (reporté, décision déjà actée en forge — [[specs-techniques]]).
- Tout autre écran.

## Ce qu'on cherche

3 à 4 pistes franchement différentes, pas des variantes cosmétiques — chacune tranche différemment sur :
- l'orientation/lisibilité des 4 quadrants (rotation par joueur vs layout uniforme),
- comment s'ouvre la saisie de fin de manche (modal plein écran, saisie inline par quadrant, stepper séquentiel…),
- la place de la zone centrale.

Basse fidélité : boîtes, labels, pas de couleurs/typo définitives — l'enjeu est l'agencement et le geste, pas l'habillage.

## Critère de réussite

Un pote qui n'a jamais vu l'app comprend seul le geste de fin de manche, sans explication — c'est littéralement le test de la brique **Montrer l'imparfait** ([[../../_engagement/grille]]).
