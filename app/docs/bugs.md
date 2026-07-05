---
created: '2026-07-05'
status: active
title: Bugs — registre
---

# Bugs — registre

Registre léger. Convention `BUG-NN-{slug}`, statut **ouvert** / **fermé**, plus récent en haut. Le fix se fait en forge ; ici on ne fait que tracer.

---

## BUG-02-saisie-manche-sans-gagnant — corrigé (à confirmer sur simu)

L'app acceptait une saisie de manche où **aucun joueur n'est à 0 carte** (manche sans gagnant), état impossible par la règle du jeu. `roundWinner` lève une erreur *domaine* si appelé, mais l'**UI ne bloquait pas la saisie** en amont.

- _Source :_ FD-06 (Damien l'a « accepté » à l'usage ; repéré par Éric, laissé passer pour ne pas casser le flow).
- _Nature :_ garde de saisie manquante, **pas** bug de calcul — d'où son absence de `cas-reference-score.md` (qui teste la logique, pas la validation d'entrée).
- _Résolution :_ `isValidRoundInput` (`domain/winner`) = exactement un joueur à 0, tous ∈ [0,16] ; le bouton **Valider** est piloté par `canValidate` (`ScoreEntryScreen`). **4 tests verts.** Pas de durcissement de `addRound`/`determineWinner` : garder à l'entrée suffit.
- _Ouvert (design) :_ hint explicatif quand Valider est grisé (« un joueur doit être à 0 ») — laissé à la décision d'Éric.

## BUG-01-demarrage-saisie-4e-joueur — corrigé (à confirmer sur simu)

À la saisie des prénoms, dès que le **4e joueur** recevait une première entrée, l'app figeait les pills (champ du 4e nom disparu sous les doigts) — le déclencheur réactif « 4 prénoms remplis → figé » était le bug.

- _Repéré par :_ Éric (non signalé à Damien).
- _Résolution :_ fix (b) — `editable = rounds.length === 0` (`RoundScreen`) : les prénoms restent modifiables jusqu'à la 1re manche saisie, puis se figent. Le disque central devient **point d'info d'état** : `START GAME ?` avant toute manche, `FIN DE MANCHE` ensuite (`CenterDisc`, prop `phase`).
- _Ouvert (design) :_ wording du label d'état (« START GAME ? ») ajustable.
- _Note :_ fix UI non couvert par les tests → **à valider à l'œil sur simu**.
