---
title: GoF — Cas de référence, logique de score
created: '2026-07-04'
updated: '2026-07-04'
version: 0.1.1
status: active
type: cas-reference
---

# GoF — Cas de référence, logique de score

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

- **Franchissement en une manche** : un joueur passe de 92 à 107 (manche à 15 cartes restantes, +15... ex. 15 cartes = 60 pts, 47+60=107) → arrêt immédiat, score final 107 conservé tel quel.
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
