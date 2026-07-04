---
title: GoF — Modèle de données
created: '2026-07-04'
updated: '2026-07-04'
version: 0.4.0
status: active
type: modele-donnees
---

# GoF — Modèle de données

Le socle d'état dont dépendent logique de score ([[cas-reference-score]]) et UI ([[specs-techniques]]). Une seule source de vérité stockée ; tout le reste est dérivé, jamais dupliqué.

## Stocké (état réel)

**Joueur**
- `id` : 0 à 3 — identifie le joueur et sa **position de quadrant** dans la grille 2×2 de l'écran. La position du quadrant à l'écran *est* le siège physique, vue depuis le proprio du téléphone (en bas) : les deux quadrants du haut = les joueurs d'en face, les deux du bas = le proprio et son voisin. `id` et siège se confondent — pas de champ `siege` séparé à saisir.
- `couleur` : une des 4 couleurs imposées (identité visuelle du quadrant, sans lien avec les couleurs de cartes du jeu) — palette « écho du jeu » ci-dessous
- `prenom` : saisi en début de partie directement dans la pill du quadrant — affiché ensuite partout (pill de l'écran manche, header de saisie, initiale sur les sélecteurs de joueur)

Le parcours horaire du départage niveau 2 (`tiebreakBySeatProximity`, [[logique-comptage]]) se dérive de la position des quadrants dans la grille — aucune donnée de siège supplémentaire à capter.

**Manche**
- `numero` : ordre de la manche (1, 2, 3…)
- `cartesRestantes` : `{ [joueurId]: 0-16 }` — la seule saisie utilisateur en fin de manche

**Partie**
- `joueurs` : `Joueur[4]`
- `manches` : `Manche[]`
- `statut` : `'en cours' | 'terminee'`

## Couleurs imposées — palette « écho du jeu »

Attribuées par position de quadrant (grille 2×2, proprio en bas), telles que rendues dans les wireframes :

| Position | Joueur (données de test) | Hex | Nom |
|---|---|---|---|
| Haut-gauche | Bruno | `#C8483C` | rouge brique |
| Haut-droite | Damien | `#3E6DA6` | bleu |
| Bas-gauche | Franz | `#4E9D6C` | vert |
| Bas-droite | Jacques | `#E0A83A` | ambre |

Jaune pur écarté (illisible sur fond crème) → ambre. Les prénoms sont des données de test ; la couleur, elle, est liée à la position, pas au joueur.

## Dérivé (jamais stocké, toujours recalculé)

- score d'une manche = barème appliqué à `cartesRestantes` ([[cas-reference-score]])
- `gagnantManche` = le joueur à 0 carte ce tour-là
- `cumul` par joueur = somme des scores dérivés sur toutes les manches
- fin de partie = au moins un cumul ≥ 100
- `vainqueur` = cumul le plus bas ; départage niveau 1 (score de la dernière manche) puis niveau 2 (siège le plus proche en horaire du `gagnantManche`)

## Hors modèle (exclu par les specs)

- Pas de persistance cross-session — l'état vit en mémoire le temps de la partie.

## Démarrage — pas d'écran séparé

La saisie des 4 prénoms n'a pas d'écran dédié : après un splash (dragon, asset fourni par Eric), on arrive sur le **layout de l'écran manche lui-même**, pills vides et éditables. Tap dans une pill → clavier qui monte → prénom. C'est la même UI que le jeu, avant la première manche. Contrainte de layout : les pills des quadrants du bas doivent être assez hautes pour que le clavier ne les couvre pas (détail à porter dans les specs design).

---
*v0.2 — ajout de `prenom` sur Joueur : omis à tort dans la v0.1 (absent du brief initial), confirmé essentiel par Eric. Implique un écran de démarrage non encore spécifié.*
*v0.3 — résolution du siège : la position du quadrant à l'écran EST le siège physique (vue proprio, en bas), `id` et siège se confondent, plus de champ `siege` séparé ; le départage niveau 2 dérive de la grille. Le démarrage n'est plus un écran à part : c'est l'écran manche avec pills éditables, précédé d'un splash dragon.*
*v0.4 — palette « écho du jeu » figée (rouge brique / bleu / vert / ambre), attribuée par position de quadrant.*
