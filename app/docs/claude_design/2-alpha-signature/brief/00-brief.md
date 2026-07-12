---
title: 'GANG — Brief Claude Design · round 2 (alpha-signature)'
created: '2026-07-11'
updated: '2026-07-11'
version: 0.2.1
status: draft
type: brief-design
---

# GANG — Brief Claude Design · round 2 (alpha-signature)

> **Objectif : explorer les FORMES et les STYLES de l'app *reshapée* — en VARIANTES.**
> Ce n'est **pas** un handoff d'implémentation : c'est une **exploration de design**.
> On attend **plusieurs propositions par écran (2-3)**, pour choisir et affiner.
> Basse à moyenne fidélité. Le paquet = ce cover + les **4 fiches** jointes.

## Qui est GANG

App de score pour le jeu *Gang of Four*, jouée sur **un seul téléphone posé sur la
table**, à 4. Son âme, une phrase : **une grande gueule qui n'oublie rien.**
Bruyante dans l'instant, impitoyable dans la mémoire.

- **Public assumé** : les hardcore qui veulent **glorifier leurs parties** — pas le
  joueur d'un soir au crayon-papier.
- **Le but du jeu, c'est ZÉRO** : les points sont une **honte**. L'app glorifie le
  veinard, chambre le dernier.
- **Les 5 piliers** : *le mot dit tout · l'app gueule, la table joue · ici les
  points sont une honte · tout s'oublie sauf la branlée · on ne rejoint pas un
  gang, on le mérite.*

## La discipline — à respecter absolument

- **Le mot dit tout — JAMAIS illustré.** Aucun feutre, aucun « parrain », aucune
  mascotte, aucun personnage. La swagger vit dans la **typo**, le **ton**, le mot
  **GANG** et les emoji. Le jour où on l'illustre, on l'a perdu. → *La signature
  est **typographique et structurelle**, pas imagée.*
- **Rien ne s'anime pour faire joli** — chaque effet répond à un **vrai geste** de
  la table.

## La direction de style — à interpréter (c'est là que tu proposes des variantes)

Le socle : un **carnet de score** (crème, papier). Mais un carnet qui **gueule.**
Deux systèmes à rendre visibles :

- **Deux matières d'écriture** — le **crayon** (le présent : léger, réversible, la
  partie en cours) vs le **gravé** (la mémoire : lourd, enfoncé, définitif — les
  parties finies, *la branlée qui pèse dans la grille*).
- **La dualité gloire / honte** — la gloire prend le **bruit** et la lumière (un
  projecteur) ; la honte prend le **silence** et le **doigt pointé**. Même miroir
  partout.

→ **Explore l'amplitude** : d'un *carnet-avec-swagger* (sobre mais mordant) à un
*graphique fort* (contrasté, assumé). Plusieurs directions franches, pas des
nuances timides.

## Les écrans (le périmètre) — 4 fiches jointes

Chaque fiche donne : rôle · zones · états · éléments clés · signature · navigation.

1. **l'accueil** — la porte / le moyeu *(01-accueil)*
2. **le Round** — l'écran de jeu, la table *(02-round)*
3. **la stèle** — le palmarès d'un gang, un **monument gravé** *(03-stele)*
4. **la feuille** — la grille d'une partie, une **modale** *(04-feuille)*

**Structure héritée (à garder) :** la grille **2×2** des joueurs (le *plateau*),
les *pills* (prénom + score), le **Gong** central (l'asset *Gang of Four*, tap →
frime). Le **style**, lui, est à réinventer — c'est tout le sujet.

## La demande

- **2-3 variantes par écran**, explorant la direction de style ci-dessus ;
- basse / moyenne fidélité (wireframes + parti pris de style) ;
- **jeu de données** : un **scénario cohérent** (le roster + une partie + le
  palmarès du gang, avec le *monde étrange*) → `donnees-exemple.md`. Il **fait
  foi** pour peupler tous les wireframes (mêmes noms, mêmes chiffres partout).

## Ce qu'on ne veut PAS

- copier l'app **neutre actuelle** (c'est précisément ce qu'on reshape) ;
- **illustrer** les concepts (pilier 1 — pas de dessin de dragon/parrain/…) ;
- une **mascotte** ou un 5ᵉ personnage : l'app est un tableau de score qui a une
  voix, pas un animateur.
