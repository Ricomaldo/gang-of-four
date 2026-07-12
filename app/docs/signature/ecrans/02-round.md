---
title: 'GANG — Écran : le Round (l''écran de jeu)'
created: '2026-07-11'
updated: '2026-07-11'
version: 0.2.1
status: draft
type: fiche-ecran
---

# GANG — Le Round (l'écran de jeu)

> **Fiche-écran niveau wireframe — pour le brief Claude Design.** Décrit *quoi* et
> *où* (rôle, zones, états), **pas** la mécanique d'implémentation. Design source :
> `reshape.md` (le battement, l'IA, les organes).

## Rôle

L'**écran de jeu — c'est la table.** Il **absorbe tout le live** : nommer les 4,
jouer, saisir. On y passe toute la partie. (Hub-and-spoke : retour accueil
toujours à un geste.)

## Les 3 zones

```
┌───────────────────────────────┐
│  ╭ Marc mène ╮                 │  CARTOUCHE — la voix calme (« qui mène »)
│    ┌──────┐   ┌──────┐         │
│    │Marc28│   │Léa 42│         │  PLATEAU (~50 %) — la table :
│    │      ◉ Gong      │         │  4 pills (prénom + total) autour
│    │Tom 35│   │Zoé 50│         │  du GONG central
│    └──────┘   └──────┘         │
│  ─────────────────────────────  │
│        ZONE DU BAS (~40 %)      │  conteneur qui change selon l'état ↓
└───────────────────────────────┘
```

## Les états *(le plateau et la zone du bas changent)*

| état | le plateau | la zone du bas |
|---|---|---|
| **nommer** (nouveau roster) | pills **vides** | **clavier** (les noms) |
| **jouer** (repos) | pills + **totaux** | **aperçu feuille** : dernières manches + une ligne vierge |
| **saisir** | la pill tapée **s'allume** | **numpad** calculette (3×4, « = ») ; le nombre s'affiche sur la pill |
| **annonce / cérémonie / fin** | **surdominant** : flash · cérémonie branlée · final plein plateau (miroir gloire/💩) | — |

> **Finding passe 1 (Claude Design, 12/07) :** à l'état *jouer* (repos), l'écran
> rendait **à moitié vide** — l'aperçu de la feuille se réduisait à une bande au
> fond, avec un trou mort au centre. La zone du bas doit **porter** au repos
> (aperçu de feuille plus généreux) *ou* rééquilibrer (le plateau prend plus de
> place). Pas de vide mort.

## Éléments clés

- **la pill** — tap → saisie de ce joueur *(le geste spontané de Bruno)* ;
- **le Gong** — central, tap → **frime du carré** (plein écran) ;
- **le cartouche** — « qui mène », discret, en haut *(le murmure, live)*.

## Ce qui fait GANG *(signature)*

- **object-first** ; la table **gueule** (les annonces éclaboussent le plateau) ;
- le **crayon** (le live est éditable — la dernière ligne se corrige, sans confirm) ;
- **rareté = intensité** (le fréquent reste discret, le rare crie).

## Navigation

- **retour accueil** (le moyeu) toujours à un geste ;
- **glissé vers le haut → la feuille** (modale) : la grille complète de la partie.
