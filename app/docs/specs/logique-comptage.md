---
title: GoF — Logique de comptage, noms de fonctions
created: '2026-07-04'
updated: '2026-07-04'
version: 0.1.2
status: active
type: logique
---

# GoF — Logique de comptage, noms de fonctions

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
