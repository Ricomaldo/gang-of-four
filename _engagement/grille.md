---
created: '2026-07-03'
status: active
title: GoF — Grille
type: grille
updated: '2026-07-04'
version: 0.5.0
---

# GoF — Grille

La primitive-**instrument**. Les autres déclarent ; celle-ci *agit* : elle mesure les briques et **déclenche le move** `rooftop → forge → codebase → archives`. La position du dossier devient l'état ; la grille est ce qui autorise le pas.

Chaque brique porte :
- **à produire** — ce qu'il faut poser (le keystone) ;
- **curseur** — *jusqu'où on va sur cette brique.* Pas un niveau de qualité, une preuve d'existence : un fait vérifiable, vrai ou faux, jamais un degré. C'est le seul cadran que je ne règle pas seul — Eric le pose, je le tiens sur la bonne question ([[contrat-claude-eric]], clause 4) ;
- **coché** — le check que c'est là (la gate). Toujours constaté par Eric seul.

**Un move se déclenche quand toutes ses briques sont cochées à leur curseur.**

## rooftop → forge
*Pas d'étage intermédiaire : ce saut porte toute la conception. Rien en aval ne rattrape ce que le rooftop n'a pas mûri — c'est le saut le plus chargé.*

| Brique — à produire | Curseur : jusqu'où | Coché |
|---|---|---|
| **SOCLE :** Primitives d'engagement posées et propres (bundle complet) | Manifeste, dag, mon-arbre, arbre-app, contrat et grille existent, et aucun ne contredit un autre sur un point nommé | ✅ |
| **NOYAU :** Commande traduite en specs avant forge | Plancher d'[[arbre-app]] + items commission hors plancher (feature frime) + stack, présents dans specs-techniques — rien d'autre | ✅ |
| **ETALON :** Grille elle-même stabilisée | Tous les curseurs de ce document sont remplis (aucun « à régler » restant) | ✅ |

## forge → codebase

| Brique — à produire | Curseur : jusqu'où | Coché |
|---|---|---|
| **Montrer l'imparfait :** le plancher tient sans moi | Un pote a vu l'app tourner sans qu'Eric explique à côté, et a compris seul le geste de saisie de fin de manche | ☐ |
| **Prouver la justesse :** la logique de score est éprouvée hors partie live | Un jeu de cas de référence dérivés des règles — dont les cas-limites de paliers et l'arrêt à 100 — passe à 100 % contre la logique | ☐ |
| **Tenir la partie :** une partie réelle est jouée jusqu'au bout | Une partie à 4 est allée jusqu'à 100 points avec l'app, score annoncé juste à la fin | ☐ |

## codebase → archives

| Brique — à produire | Curseur : jusqu'où | Coché |
|---|---|---|
| Plus rien ne passe le seuil d'approbation partagée | *indéfini* | ☐ |

---
*v0.2 — curseurs réglés. « Définir les specs » (le HOW technique) = **activité de forge**, pas une brique de move. Au rooftop, `specs-techniques.md` ne porte que les points-clés du plancher.*

*v0.3 — brique **JUSTESSE** ajoutée à forge→codebase : la justesse du score, implicite dans l'arbre (une *fin*), devient un gate explicite (une *preuve*). Axe technique indépendant de l'endurance (partie réelle). Curseur posé par Eric.*

*v0.4 — merge du doublon `_engagement/engagement/` : NOYAU élargi à plancher + feature frime + stack (curseur confirmé par Eric), cohérent avec l'état réel de specs-techniques.md. Doublon supprimé après merge.*

*v0.5 — les trois briques forge→codebase renommées en syntaxe verbe + complément, cohérente avec le geste de mon-arbre : **Montrer l'imparfait** (verbatim, feuille mon-arbre existante), **Prouver la justesse**, **Tenir la partie**.*
