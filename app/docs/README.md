---
title: 'GANG — docs (porte d''entrée)'
created: '2026-07-10'
updated: '2026-07-10'
version: 0.2.1
status: active
type: index
---

# GANG — `docs/`

> **Où suis-je ?** La porte d'entrée du dossier. Cinq zones, chacune sa maison.
> Le **versioning marque l'ère** : `0.1.x` = build **alpha-core** (tag git
> `v0.1`, commit `f73a326`) · `0.2.x` = phase **conception signature** (dev gelé,
> UI/UX reshape).

## Les zones

| zone | ce qu'elle tient | ère |
|---|---|---|
| **`specs/`** | source de vérité du build (7 specs — voir table) | 0.1.x |
| **`signature/`** | l'identité (colonne + 5 piliers). Porte interne : `reshape.md` | 0.2.x |
| **`journal/`** | les traces datées (passes, rapport de soirée, handoffs) | mixte |
| **`claude_design/`** | handoff externe, **un dossier par round** (`brief/` envoyé · `retour/` revenu) : `1-alpha-core` (consommé) · `2-alpha-signature` (à venir) | — |
| **`bugs.md`** | registre vivant des bugs (`BUG-NN`), à la racine | 0.1.0 |

→ hors `docs/` : `app/changelog.md` (versions produit).

## `specs/` — statut & maturité

Toutes **`active`** (une passe de révision est prévisible, pilotée par la
signature v0.2, avant l'intégration alpha). La **maturité se lit à la version.**

| spec | version | tient |
|---|---|---|
| `modele-donnees.md` | 0.1.5 | le modèle de données (siège, roster, partie) |
| `specs-techniques.md` | 0.1.4 | la stack, l'archi, les choix techniques |
| `logique-comptage.md` | 0.1.2 | la logique de score, noms de fonctions |
| `cas-reference-score.md` | 0.1.1 | les cas de référence (prouvés, 62 tests) |
| `specs-anim-frime.md` | 0.1.1 | l'anim frime (le Gong) |
| `specs-partage.md` | 0.1.1 | le partage natif de la feuille |
| `specs-stats.md` | 0.1.1 | les stats & la frontière P1/P2 |

## Le fil

`signature/` (l'identité, ce que l'app **est**) → `specs/` (le build, comment on
le **fait**) → le code (`app/src/`). Les specs **découlent** de la signature,
jamais l'inverse. `journal/` garde la trace, `bugs.md` le registre vivant.
