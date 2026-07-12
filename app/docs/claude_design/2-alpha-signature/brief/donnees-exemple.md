---
title: 'GANG — Jeu de données (pour peupler les wireframes)'
created: '2026-07-12'
updated: '2026-07-12'
version: 0.2.1
status: draft
type: brief-design
---

# GANG — Jeu de données d'exemple

> **Un seul scénario cohérent** pour peupler *tous* les wireframes — mêmes noms,
> mêmes chiffres partout. Règles respectées (cf. `../../specs/`) : un joueur pose
> tout (**0**) par manche ; le **meneur / vainqueur = le cumul le plus bas** ; une
> **branlée = ≥ ~30 pts distribués sur une manche**, marque **💪 sur le donneur**
> (le 0). *(💪 = emoji provisoire.)*

## Le gang (le roster)

**Bruno · Damien · Franz · Jacques** — les 4 mêmes qui reviennent.

## Une partie en cours *(pour le Round + la feuille)*

Grille manche × joueur (les **scores**, pas les cartes) :

```
          Bruno   Damien   Franz   Jacques
  M1       12       0        5        8      (Damien plie · total 25)
  M2       18       6        0 💪    11      (Franz plie → BRANLÉE, total 35)
  M3        9      14        7        0      (Jacques plie)
  M4        0       8       15        4      (Bruno plie)
  M5       25       9        6        0      (Jacques plie)
  ─────────────────────────────────────────
  TOT      64      37       33       23
```

- **Cartouche (« qui mène ») : « Jacques mène »** (cumul le plus bas, 23).
- **Sur les pills du Round** : Bruno 64 · Damien 37 · Franz 33 · Jacques 23.
- **La branlée** est en M2 (Franz plie, total distribué 35 ≥ 30) → sa ligne **pèse**
  (gravé) ; les autres manches sont au **crayon** (la dernière, M5, éditable).
- Titre de la feuille (la session) : *« Établi · 8 juin »*.

## Le palmarès du gang *(pour la stèle)*

Cumul de plusieurs parties de ce gang. **Seuls les pôles comptent** (🏆 / 💩) :

```
          🏆   💩   ⭐️   💥   branlées
  Bruno    1    4    6    18     0
  Damien   4    0   15     5     3
  Franz    2    1   11     8     1
  Jacques  1    3    9    12     2
```

- **✌️ champion = Damien** (le plus de 🏆 : 4).
- **🐌 looser = Bruno** (le plus de 💩 : 4).
- Deux joueurs **distincts** — c'est le **cas normal**, l'exemple **par défaut** à rendre.

*Le **monde étrange** (le même joueur tient les 2 trônes — le all-in) est un cas
**rare** : à gérer, mais **pas** l'exemple par défaut. Ne pas concevoir la stèle
autour de lui.*
