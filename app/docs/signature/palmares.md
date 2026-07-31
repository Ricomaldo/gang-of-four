---
title: 'GANG — Palmarès (trophées & règles)'
created: '2026-07-10'
updated: '2026-07-10'
version: 0.2.1
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

**Correction (31/07) : la branlée n'entre PAS dans le départage.** Eric tranche :
elle n'a jamais été pensée pour être comptabilisée ou pondérée — « du fun gratuit
pour l'animation de soirée ». Les lignes ci-dessous et §La branlée dans le
palmarès, qui la posaient comme un palier du départage, sont **caduques** sur ce
point ; corrigées.

- **✌️ :** 🏆 → ⭐️ manches → **le champion en titre reste** *(à égalité totale,
  on ne détrône pas : il faut le battre)*. **Jamais le 💩.**
- **🐌 (miroir strict) :** 💩 → 💥 manches perdues → **le looser en titre reste**.
  **Jamais le 🏆.**

## Conséquences code (forge, plus tard)

- `stats.ts` **croise les pôles aujourd'hui** (✌️ départagé par « moins de 💩 »,
  l.92 ; 🐌 par « moins de 🏆 », l.101) → **à retirer** pour l'indépendance
  miroir, sinon le monde étrange reste interdit.
- **« en titre reste » exige un état stocké** (qui porte le titre) — le palmarès
  est *dérivé*, sans mémoire, aujourd'hui.
- Palmarès actuellement **scopé soirée** → **migrer vers gang** (roster,
  inter-sessions).

## La branlée dans le palmarès

~~+1 au donneur… entre dans le départage ✌️ après les manches~~ **caduc (31/07)** :
la branlée ne vaut **aucun point** et n'entre dans **aucun** départage — cosmétique
et narrative uniquement (marque `‡`/`‡‡` sur la feuille, cérémonie). Le
*quoi / pourquoi* — seuil, cérémonie, gravé, POV — vit dans **`branlee.md`**
(pilier 4).

## Ouvert

- l'**emoji** de la branlée — ~~💪 candidat, non scellé~~ **résolu (18/07)** :
  marque `‡` / `‡‡`, cf. `branlee.md`.
- le **mot** de la cérémonie (copy-deck) — **routé (31/07)** : traité dans la
  prochaine passe de review générale avec Claude Design.
- **rendu des marques** — ~~finding passe 1 (12/07), à concevoir~~ **résolu
  (18/07)** par `specs-placard.md` : champion **sans glyphe** (gloire = le plus
  gros corps + halo), looser **☞** (mot : « le looser »), branlée **‡ / ‡‡**.
  Tous typographiques/dessinés, aucun emoji stock. *Non couvert par le placard :
  🏆/💩 (scope partie) et ⭐️/💥 (scope manche) — pas vu passer dans les specs
  placard, à vérifier lors de ta review visuelle.*
- **la mécanique du départage** — **fermé (31/07)** : la branlée ne pèse dans
  aucun départage, cf. §Départage corrigé ci-dessus. Ce n'était pas une question
  mécanique à trancher, c'était une prémisse fausse à corriger.
