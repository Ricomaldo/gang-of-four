---
title: 'GANG — Écran : l''accueil (la porte / le moyeu)'
created: '2026-07-10'
updated: '2026-07-11'
version: 0.2.1
status: draft
type: fiche-ecran
---

# GANG — L'accueil (la porte / le moyeu)

> **Fiche-écran niveau wireframe — pour le brief Claude Design.** Design source :
> `reshape.md` (l'IA, les organes). Remplace le `SplashScreen` (2 logos passifs).

## Rôle

La **porte** et le **moyeu** (du hub-and-spoke). **Object-first** : l'app
ouvre sur son objet-voix, pas sur un menu ni un formulaire. C'est **ici que les
deux mondes se séparent** : *jouer* (→ le Round) ou *consulter* (→ une stèle).
Zéro péage à l'entrée.

## Les zones

```
┌───────────────────────────────┐
│  ╭ revanche ? ╮                │  CARTOUCHE — l'invite du moment (voix calme)
│           G A N G             │  WORDMARK — le mot, jamais illustré
│          ╭─────────╮          │
│          │  GONG   │          │  le GONG, DOMINANT — la porte
│          ╰─────────╯          │  tap → on joue (+ rugir). Pas de plateau ici.
│   ─── tes gangs ───           │  TES GANGS — les rosters joués (4 prénoms)
│   Marc · Léa · Tom · Zoé      │  tap un roster → sa STÈLE
│   Marc · Paul · Sam · Zoé     │
└───────────────────────────────┘
```

## Les états

| état | le cartouche dit | le Gong / l'action |
|---|---|---|
| **vierge** (aucun gang) | « nouveau gang ? » | tap → le **Round**, sièges à nommer. *Tes gangs* vide (germe). |
| **revanche** (gangs connus) | « revanche ? » + standing | tap → relance le dernier gang. *Tes gangs* peuplé. |
| **reprise** (partie en cours) | « partie en cours » | le Gong = **reprendre** ; + choix **annuler** (confirm légère). |

*Le rugissement marque toujours **un gang complet qui prend la table** (immédiat
pour une revanche, après les prénoms pour un roster neuf, aucun à la reprise).*

## Éléments clés

- **le Gong** — dominant, tap → on joue *(le geste par défaut : jouer)* ;
- **tes gangs** — la liste des rosters ; tap un roster → sa **stèle** *(consulter)* ;
- **le cartouche** — l'invite contextuelle, en haut.

## Ce qui fait GANG *(signature)*

- **object-first** — la porte *est* l'identité, pas une antichambre ;
- **le défaut, c'est jouer** — pas de formulaire, pas de baptême ;
- **on mérite le gang** — la revanche fait le gang, **en silence** (dans le geste).

## Navigation *(le moyeu du hub-and-spoke)*

- **jouer** : Gong / revanche → le **Round** ;
- **consulter** : tap un roster → sa **stèle** ;
- gère les **3 issues** d'une partie : *reprise* (reprendre) · *annuler* (jeter) · la *terminée* est scellée ailleurs (fin de partie).
