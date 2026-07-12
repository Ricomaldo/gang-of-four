---
title: GANG — Logique de comptage, noms de fonctions
created: '2026-07-04'
updated: '2026-07-12'
version: 0.2.1
status: active
type: logique
---

# GANG — Logique de comptage, noms de fonctions

Le *comment* du score, posé en fonctions avant le scaffold — pour appropriation avant implémentation. Chaque fonction est pure (pas d'effet de bord, pas d'état caché), testable isolément contre [[cas-reference-score]]. S'appuie sur les entités de [[modele-donnees]].

Signatures en pseudo-TS — le choix TS/JS n'est pas encore tranché au scaffold, à ajuster à ce moment-là.

## Types de base

```
type PlayerId = 0 | 1 | 2 | 3
type CardCount = number        // 0 à 16, cartes restantes en fin de manche
type Round = { cardCounts: Record<PlayerId, CardCount> }
type Seats = Record<PlayerId, number>  // position horaire de chaque joueur
```

## Fonctions bas niveau

**`computeRoundScore(cardCount: CardCount): number`**
Applique le barème à un nombre de cartes restantes. La brique de base — tout le reste en dépend.
→ doit satisfaire : la table « Cas-limites de paliers ».

**`roundWinner(round: Round): PlayerId`**
Le joueur à 0 carte ce tour-là (unique par manche).

**`directionOfPlay(roundNumber: number): 'horaire' | 'anti-horaire'`**
Sens de jeu affiché sur l'écran manche, purement dérivé du numéro de manche. Le livret (p.12) donne : manche 1 = sens **anti-horaire** (« à droite »), puis alternance à chaque manche. Aucun impact sur le score — display seul. À ne pas confondre avec le parcours horaire fixe du départage niveau 2 (`tiebreakBySeatProximity`), qui lui ne dépend pas de cette alternance.

## Fonctions de cumul

**`computeTotals(rounds: Round[]): Record<PlayerId, number>`**
Cumul par joueur = somme de `computeRoundScore` sur toutes les manches.
→ doit satisfaire : la table « Cumul de manche en manche ».

**`isGameOver(totals: Record<PlayerId, number>): boolean`**
Vrai si au moins un cumul ≥ 100.
→ doit satisfaire : la section « Arrêt à 100 » (franchissement simple et double).

## Fonctions de départage — décomposées pour rester testables une à une

**`lowestTotalCandidates(totals: Record<PlayerId, number>): PlayerId[]`**
Les joueurs à égalité sur le cumul le plus bas (souvent un seul, parfois plusieurs).

**`tiebreakByLastRoundScore(candidates: PlayerId[], lastRound: Round): PlayerId[]`**
Parmi les candidats, ceux qui ont marqué le moins à la dernière manche. Peut encore renvoyer un groupe à égalité.

**`tiebreakBySeatProximity(candidates: PlayerId[], seats: Seats, roundWinnerSeat: number): PlayerId`**
Le plus proche, en sens horaire, du gagnant de la dernière manche. Résout toujours à un seul joueur — les sièges sont uniques.
→ `lowestTotalCandidates` + `tiebreakByLastRoundScore` + `tiebreakBySeatProximity` ensemble doivent satisfaire : les scénarios A et B de « Départage ».

## Fonction d'orchestration

**`determineWinner(rounds: Round[], seats: Seats): PlayerId`**

Compose les fonctions précédentes, dans l'ordre :

1. `totals = computeTotals(rounds)`
2. si `!isGameOver(totals)` → la partie continue, pas de vainqueur à déterminer
3. `candidates = lowestTotalCandidates(totals)` — si un seul, c'est le vainqueur
4. sinon `candidates = tiebreakByLastRoundScore(candidates, dernière manche de rounds)` — si un seul, c'est le vainqueur
5. sinon `tiebreakBySeatProximity(candidates, seats, roundWinner(dernière manche))` — tranche toujours

C'est la seule fonction à effet visible côté app (elle répond à « qui a gagné ? ») ; toutes les autres sont des briques internes.

## Fonctions du pôle perdant — existant `src/domain/winner.ts` (retard spec/code résorbé)

Ces fonctions **existent déjà dans le code** (implémentées pour la passe stats) ; la spec les documente a posteriori.

**`roundLastPlace(round: Round, totals: Record<PlayerId, number>, seats: Seats): PlayerId`**
Le joueur avec le **plus de cartes** à cette manche (le « dernier », 💥). Départage : L1 — le plus grand **cumul** ; L2 — le plus proche du gagnant de la manche en sens **anti-horaire**. Règle maison validée par Eric (06/07).

**`gameLoser(rounds: Round[], seats: Seats): PlayerId`**
Le perdant de la partie (💩) = **cumul final le plus haut**. Symétrique de `determineWinner` : L1 — le plus **grand** score à la dernière manche (`tiebreakByHighestLastRoundScore`) ; L2 — le plus proche du gagnant de la dernière manche en sens **anti-horaire**. S'appuie sur `highestTotalCandidates` (symétrique de `lowestTotalCandidates`).

## Détection de la branlée

**`detectBranlee(round: Round): null | 'petite' | 'grosse'`**
Sur le **total distribué de la manche** (somme des scores de manche des 4 joueurs) : **≥ ~45 → `'grosse'`**, sinon **≥ ~30 → `'petite'`**, sinon `null`. Seuils ajustables à la récolte (cf. signature/reshape.md §fourches tranchées 12/07, pt 8). Le **donneur = le joueur à 0** (`roundWinner`). Détectée **à la validation de la manche** — au point de calcul (cf. signature/branlee.md).
→ doit satisfaire : la section « Cas de référence — branlée » de [[cas-reference-score]].

## Fonctions de titres — miroirs indépendants

Les titres ✌️/🐌 sont **deux classements indépendants, en miroir** (cf. signature/palmares.md) — **dérivés par rejeu** de l'historique complet du vrac, rien de stocké :

- **✌️ (champion)** — calculé sur les **🏆 seuls** ; départage : 🏆 → ⭐️ manches → **branlées données** → **le tenant reste** (dérivé par rejeu : à égalité totale, on ne détrône pas). **Jamais le 💩.**
- **🐌 (looser, miroir strict)** — calculé sur les **💩 seuls** ; départage : 💩 → 💥 manches perdues → **branlées prises** → **le tenant reste** (par rejeu). **Jamais le 🏆.**

⚠️ **`stats.ts` actuel croise les pôles** (✌️ départagé par « moins de 💩 », 🐌 par « moins de 🏆 ») → **à corriger** pour l'indépendance miroir, sinon le monde étrange (même joueur ✌️ *et* 🐌) reste interdit.
→ doit satisfaire : la section « Cas — titres miroirs » de [[cas-reference-score]].
