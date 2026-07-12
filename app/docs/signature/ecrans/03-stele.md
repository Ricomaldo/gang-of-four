---
title: 'GANG — Écran : la stèle (le palmarès d''un gang)'
created: '2026-07-11'
updated: '2026-07-11'
version: 0.2.1
status: draft
type: fiche-ecran
---

# GANG — La stèle (le palmarès d'un gang)

> **Fiche-écran niveau wireframe — pour le brief Claude Design.** Design source :
> `reshape.md` (le gravé) + `palmares.md` (les trophées & règles).

## Rôle

Le **monument d'un gang** — son palmarès **gravé** (la mémoire, cross-parties). Un
lieu qu'on visite. On y arrive **à froid** (accueil → tap un roster) ou **à chaud**
(fin de partie → consulter). C'est du **gravé** : ça doit *peser*.

> **Finding passe 1 (Claude Design, 12/07) :** la stèle doit **littéralement**
> faire monument de **pierre gravée** — matière, relief, gravure creusée, poids.
> Un « **mode nuit** » (fond sombre) **ne suffit pas** : ce n'est pas un thème,
> c'est un **objet lourd** qu'on visite.

## Les zones

```
┌── LE GANG · Marc · Léa · Tom · Zoé ──┐   titre = le roster (4 prénoms)
│                                       │
│   ✌️ MARC            🐌 LÉA           │   LES 2 TRÔNES (miroir) —
│   champion           looser           │   ✌️ le plus de 🏆 · 🐌 le plus de 💩
│  ┌──────────────────────────────────┐ │
│  │ Marc   🏆5  💩1  ⭐️12  💥3       │ │   LE DÉTAIL par joueur
│  │ Léa    🏆1  💩6  ⭐️4   💥9       │ │   (parties 🏆/💩 · manches ⭐️/💥)
│  │ Tom    …                          │ │
│  │ Zoé    …                          │ │
│  └──────────────────────────────────┘ │
│            [ revanche ]                │   → relance ce gang (→ Round)
└────────────────────────────────────────┘
```

## Les états

| état | ce qui change |
|---|---|
| **normal** | un champion (✌️), un looser (🐌), distincts |
| **monde étrange** | **le même joueur tient les 2 trônes** (le all-in) — **proclamé**, pas caché : les 2 couronnes sur la même tête |

## Éléments clés

- **les 2 trônes** (✌️ champion / 🐌 looser) — miroirs **indépendants** ;
- **le détail** par joueur — *seuls les pôles comptent* (1er/dernier ; le milieu = rien) ;
- **revanche** — le geste qui rappelle le gang au combat.

## Ce qui fait GANG *(signature)*

- le **gravé** (le monument, la pierre — ça pèse, permanent) ;
- le **monde étrange assumé** (champion *et* looser à la fois) ;
- **on ne rejoint pas un gang, on le mérite** : le palmarès est la récompense silencieuse de rejouer.

## Navigation

- **retour accueil** (le moyeu) ;
- **voir une feuille** (une partie passée de ce gang) → **la feuille** (modale).
