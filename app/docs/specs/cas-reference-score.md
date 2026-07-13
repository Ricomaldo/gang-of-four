---
title: GANG — Cas de référence, logique de score
created: '2026-07-04'
updated: '2026-07-13'
version: 0.2.3
status: active
type: cas-reference
---

# GANG — Cas de référence, logique de score

Jeu de cas dérivés des règles ([[../../_commission/regles-jeu.pdf]]) et d'une règle maison d'Eric (départage, absente du livret). Sert de contrat pour la brique **Prouver la justesse** ([[../../_engagement/grille]]) : la logique de score doit passer ces cas à 100 % avant d'être éprouvée en partie live.

## Barème (livret, p.10)

| Cartes restantes | Multiplicateur | Score |
|---|---|---|
| 1 à 7 | ×1 | 1 pt/carte |
| 8 à 10 | ×2 | 2 pts/carte |
| 11 à 13 | ×3 | 3 pts/carte |
| 14 à 15 | ×4 | 4 pts/carte |
| 16 | ×5 | 80 (fixe) |

## Cas-limites de paliers

| Cartes | Score attendu | Origine |
|---|---|---|
| 0 | 0 | sortie de manche — le joueur qui abat sa dernière carte ne score pas |
| 1 | 1 | borne basse ×1 |
| 5 | 5 | exemple livret |
| 7 | 7 | borne haute ×1 |
| 8 | 16 | borne basse ×2 |
| 9 | 18 | exemple livret |
| 10 | 20 | borne haute ×2 |
| 11 | 33 | borne basse ×3 |
| 13 | 39 | borne haute ×3 |
| 14 | 56 | borne basse ×4 |
| 15 | 60 | borne haute ×4 — exemple livret |
| 16 | 80 | cas fixe — exemple livret |

## Cumul de manche en manche

| Manche | J1 | J2 | J3 | J4 |
|---|---|---|---|---|
| Cartes restantes | 0 | 5 | 9 | 2 |
| Score de la manche | 0 | 5 | 18 | 2 |
| Cumul après manche 1 | 0 | 5 | 18 | 2 |
| Cartes restantes (manche 2) | 3 | 0 | 6 | 12 |
| Score de la manche 2 | 3 | 0 | 6 | 36 |
| Cumul après manche 2 | 3 | 5 | 24 | 38 |

Vérifie l'accumulation simple, sans déclenchement d'arrêt.

## Arrêt à 100

La partie s'arrête dès qu'**au moins un** joueur atteint ou dépasse 100 (pas d'écrêtage). Le vainqueur est celui dont le **cumul est le plus bas** à cet instant — pas forcément celui qui a franchi 100.

- **Franchissement en une manche** : un joueur passe de 47 à 107 (manche à 15 cartes restantes, +15... ex. 15 cartes = 60 pts, 47+60=107) → arrêt immédiat, score final 107 conservé tel quel.
- **Le déclencheur n'est pas nécessairement perdant** : si un autre joueur cumule 130, celui à 107 peut quand même gagner.
- **Double franchissement** : deux joueurs dépassent 100 dans la même manche → l'arrêt reste unique, le vainqueur est déterminé sur l'ensemble des 4 cumuls, pas seulement entre les deux qui ont franchi.

## Départage (règle maison — absente du livret)

Le livret ne tranche que l'égalité pour l'échange de cartes en cours de manche, jamais la victoire finale. Règle posée par Eric :

1. En cas d'égalité de cumul le plus bas → gagne celui qui a marqué **le plus petit score à la dernière manche** (donc le moins de cartes restantes ce tour-là).
2. Si encore égalité → gagne celui assis **le plus proche, en sens horaire, du gagnant de la dernière manche** (le joueur qui a abattu sa dernière carte ce tour-là, cartes restantes = 0).

Sièges de référence pour les deux scénarios : ordre horaire J1 → J2 → J3 → J4 → J1.

### Scénario A — départage niveau 1 (le gagnant de manche fait partie de l'égalité)

J3 sort ce tour (0 carte, gagnant de la manche).

| | J1 | J2 | J3 | J4 |
|---|---|---|---|---|
| Cumul avant la manche | 70 | 70 | 88 | 20 |
| Cartes restantes ce tour | 9 | 9 | 0 | 16 |
| Score de la manche | 18 | 18 | 0 | 80 |
| Cumul final | 88 | 88 | 88 | 100 |

J4 déclenche l'arrêt (100). Triple égalité à 88 entre J1, J2, J3. Départage niveau 1 : score de manche le plus bas = J3 (0) → **J3 gagne**, pas besoin du niveau 2.

### Scénario B — départage niveau 2 (égalité totale ET égalité de manche)

J3 sort ce tour (0 carte, gagnant de la manche) mais n'est pas dans l'égalité finale.

| | J1 | J2 | J3 | J4 |
|---|---|---|---|---|
| Cumul avant la manche | 70 | 70 | 95 | 20 |
| Cartes restantes ce tour | 9 | 9 | 0 | 16 |
| Score de la manche | 18 | 18 | 0 | 80 |
| Cumul final | 88 | 88 | 95 | 100 |

J4 déclenche l'arrêt (100). Égalité à 88 entre J1 et J2 — même cumul, même score de manche (18 = 18), niveau 1 ne tranche pas. Niveau 2 : en sens horaire depuis le gagnant de la manche (J3) → J4, puis J1, puis J2. J1 est plus proche de J3 que J2 → **J1 gagne**.

## Cas de référence — branlée

Contrat de `detectBranlee(round)` ([[logique-comptage]]) : le verdict se calcule sur le **total distribué de la manche** (somme des **scores de manche** des 4 joueurs). **Bornes inclusives : total ≥ 30 → petite · total ≥ 45 → grosse** (la grosse absorbe la petite). Seuils ~ajustables à la récolte (signature/reshape.md §fourches 12/07, pt 8). Le **donneur = le joueur à 0** (celui qui a plié).

| Cartes restantes (J1/J2/J3/J4) | Scores de manche | Total distribué | Verdict | Donneur |
|---|---|---|---|---|
| 0 / 9 / 2 / 5 | 0 / 18 / 2 / 5 | 25 | **rien** (< 30) | — |
| 0 / 8 / 9 / 1 | 0 / 16 / 18 / 1 | 35 | **petite** | J1 |
| 0 / 13 / 7 / 2 | 0 / 39 / 7 / 2 | 48 | **grosse** | J1 |
| 0 / 9 / 7 / 5 | 0 / 18 / 7 / 5 | **30** | **petite** — borne basse inclusive | J1 |
| 0 / 10 / 9 / 7 | 0 / 20 / 18 / 7 | **45** | **grosse** — borne inclusive (pas petite) | J1 |

## Cas — titres miroirs (✌️ / 🐌 indépendants)

Contrat des fonctions de titres ([[logique-comptage]], signature/palmares.md) : ✌️ sur les 🏆 seuls, 🐌 sur les 💩 seuls — **jamais de croisement des pôles**. Le **monde étrange** (même joueur sur les deux trônes) est un résultat **attendu**, pas un bug.

Un gang, 4 parties terminées :

| | Marc | Léa | Tom | Zoé |
|---|---|---|---|---|
| 🏆 parties gagnées | 2 | 2 | 0 | 0 |
| 💩 parties perdues | 2 | 0 | 1 | 1 |
| ⭐️ manches gagnées | 9 | 6 | 3 | 2 |

- **✌️** : égalité 🏆 (Marc 2 = Léa 2) → départage ⭐️ : Marc 9 > Léa 6 → **Marc champion**. Ses 2 💩 ne le pénalisent **jamais**.
- **🐌** : le plus de 💩 → Marc (2) → **Marc looser**. Ses 2 🏆 ne le rachètent **jamais**.
- **Monde étrange** : Marc tient **les deux trônes** — le all-in haute-variance. Résultat attendu.
- *Contre-exemple de l'ancien code croisé (`stats.ts`, à corriger)* : ✌️ départagé par « moins de 💩 » aurait donné Léa — **faux** désormais.

## Cas — le tenant reste (départage « par rejeu »)

Contrat de la dérivation des titres par rejeu ([[logique-comptage]] §titres,
`stats.ts` `updateTenant`) : on **rejoue le vrac dans l'ordre chronologique**
(`archivedAt`). Le **premier** à atteindre le sommet d'un pôle prend le titre et le
**garde tant qu'on ne le bat pas strictement** — **l'égaler ne détrône pas** (« il
faut le battre », signature/palmares.md §départage). *Ratifié par Eric le 13/07 —
remplace « premier vu l'emporte ».*

Un gang, 2 parties terminées, dans l'ordre (⭐️ et encoches à égalité entre Marc et
Léa, pour forcer la pleine égalité sur la chaîne) :

| ordre | vainqueur | après rejeu |
|---|---|---|
| **P1** *(archivée en 1er)* | Marc | Marc 1🏆 → **Marc ✌️** (premier au sommet) |
| **P2** *(archivée après)* | Léa | Marc 1🏆 = Léa 1🏆, pleine égalité → **Marc reste ✌️** (Léa égale, ne bat pas) |

- **Résultat : champion = Marc.** Le tenant tient l'égalité.
- **Bascule** : si Léa gagnait une **3ᵉ** partie (2🏆 > 1🏆), elle **battrait** Marc
  → **Léa** deviendrait championne.
- **Miroir strict** côté 🐌 : le looser en titre reste de même, sur les 💩 seuls.
