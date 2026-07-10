---
title: 'GANG — Palmarès (trophées & règles)'
created: '2026-07-10'
updated: '2026-07-10'
version: 0.1.0
status: draft
type: palmares-rules
---

# GANG — Palmarès (trophées & règles)

> **SCRATCH — décisions du 10/07.** Ce fichier tient le **POURQUOI** (le parti
> pris). Le **COMMENT** mécanique (le calcul du départage) migrera vers
> `modele-donnees` / `stats` à l'implémentation. 2ᵉ passe à venir.

## Grille emoji

| scope | gagne | perd |
|---|---|---|
| **manche** | ⭐️ | 💥 |
| **partie** | 🏆 | 💩 *(ex-❌)* |
| **permanent (gang)** | ✌️ champion | 🐌 looser |

Changement vs code actuel : **❌ → 💩**. Le **🐌 = le plus de 💩**.

## Deux scopes à trophées

- **partie** (remis à zéro chaque jeu) : 🏆 / 💩.
- **gang** (permanent, inter-sessions) : ✌️ / 🐌.
- **session** (temps + lieu) = **contenant**, *pas* de trophée propre — elle
  titre la feuille (« Établi · 8 juin »), elle ne couronne pas.

## Seuls les pôles comptent

**1ᵉʳ (🏆) et dernier (💩) seulement.** Les 2ᵉ / 3ᵉ places = rien : elles
n'entrent dans aucun départage et ne pondèrent pas le classement. **Assumé.**
(Déjà vrai dans le modèle : les places du milieu ne sont jamais stockées.)

## ✌️ et 🐌 : deux classements indépendants, en miroir

- **✌️** se calcule *uniquement* sur les 🏆 — le 💩 ne le pénalise **jamais**.
- **🐌** se calcule *uniquement* sur les 💩 — le 🏆 ne le rachète **jamais**.

→ **Conséquence assumée : le même joueur peut tenir LES DEUX.** Le joueur
haute-variance, le all-in qui va à la gorge, gagne le plus **et** perd le plus
pendant que les autres restent tièdes. Champion *et* looser. **Le monde étrange.**
Parti pris, pas bug — c'est le plus GANG des mondes (« un seul objectif, une
seule hantise » — le all-in habite les deux pôles).

## Départage

- **✌️ :** 🏆 → ⭐️ manches → **branlée** *(quand elle entrera — « on va vers
  ça »)* → **le champion en titre reste** *(à égalité totale, on ne détrône pas :
  il faut le battre)*. **Jamais le 💩.**
- **🐌 (miroir strict) :** 💩 → 💥 manches perdues → **branlée prise** → **le
  looser en titre reste**. **Jamais le 🏆.**

## Conséquences code (forge, plus tard)

- `stats.ts` **croise les pôles aujourd'hui** (✌️ départagé par « moins de 💩 »,
  l.92 ; 🐌 par « moins de 🏆 », l.101) → **à retirer** pour l'indépendance
  miroir, sinon le monde étrange reste interdit.
- **« en titre reste » exige un état stocké** (qui porte le titre) — le palmarès
  est *dérivé*, sans mémoire, aujourd'hui.
- Palmarès actuellement **scopé soirée** → **migrer vers gang** (roster,
  inter-sessions).

## La branlée dans le palmarès

**+1 au donneur** (vainqueur de la manche-branlée) ; les preneurs par déduction.
Entre dans le départage ✌️ **après les manches**. Le *quoi / pourquoi* — seuil,
cérémonie, gravé, POV — vit dans **`branlee.md`** (pilier 4).

## Ouvert

- l'**emoji** de la branlée : 💪 candidat (POV donneur), **non scellé** ;
- le **mot** de la cérémonie (copy-deck).
