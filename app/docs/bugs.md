---
created: '2026-07-05'
status: active
title: Bugs — registre
---

# Bugs — registre

Registre léger. Convention `BUG-NN-{slug}`, statut **ouvert** / **fermé**, plus récent en haut. Le fix se fait en forge ; ici on ne fait que tracer.

---

## BUG-06-fleche-sens-couleur-alignement — corrigé

La flèche de sens de jeu était en noir opaque (`palette.encre`) et positionnée trop haut (`top:'73%'`), mal alignée sur les pills du bas.

- _Source :_ review visuelle pre-soirée 2026-07-08.
- _Résolution :_ `borderLeftColor: palette.bordure` (rgba 0,0,0,0.18 = contour du Hub) ; `top:'78%'` pour tomber sur le centre vertical des pills du bas. (`PlayDirection.tsx`)

## BUG-05-double-splash — corrigé

Au cold launch, deux écrans de démarrage se succédaient : le natif expo-splash-screen (image splash.png sur fond crème) puis le JS (SplashScreen.tsx, 1400 ms).

- _Source :_ review visuelle pre-soirée 2026-07-08.
- _Résolution :_ retrait des clés `"image"`, `"imageWidth"`, `"resizeMode"` du plugin expo-splash-screen dans `app.json`. Le natif devient fond crème uni, le dragon JS apparaît en continuité. Prend effet au prochain rebuild sim (`npx expo run:ios/android`).

## BUG-04-carnet-inaccessible-manche-0 — corrigé

À la 1re manche (0 rounds), l'affordance carnet n'était pas visible (gate `rounds.length > 0`) — impossible de consulter la soirée précédente dès le départ. Et si on forçait la nav, ScoreCarnet affichait « Aucune manche jouée. » au lieu d'une feuille vide cohérente.

- _Source :_ FD-12 / review pre-soirée 2026-07-08.
- _Résolution :_ gate retiré → affordance toujours visible (`RoundScreen.tsx l.149`). Placeholder row (`—`) remplace le message vide quand `rows.length === 0`, en conservant l'en-tête et la ligne TOT à 0 (`ScoreCarnet.tsx l.53`).

## BUG-03-pills-sous-clavier-setup — corrigé

En saisie des prénoms (SetupScreen), les pills du bas (joueurs 2 et 3) passaient sous le clavier sur petits écrans — saisie à l'aveugle.

- _Source :_ review visuelle pre-soirée 2026-07-08.
- _Cause :_ `gridZone: { flex: 5 }` → 55.5 % de l'écran, pills du bas plaquées au bas de la zone, juste à la limite du clavier.
- _Résolution :_ `gridZone: { flex: 5, maxHeight: '52%' }` → cap à 52 %, les pills restent au-dessus du clavier (~45-48 % depuis le bas). (`SetupScreen.tsx`)

---

## BUG-02-saisie-manche-sans-gagnant — confirmé à l'usage

L'app acceptait une saisie de manche où **aucun joueur n'est à 0 carte** (manche sans gagnant), état impossible par la règle du jeu. `roundWinner` lève une erreur *domaine* si appelé, mais l'**UI ne bloquait pas la saisie** en amont.

_Validation terrain :_ Damien a heurté la garde à la table et l'approuve (« le blocage quand pas de score à 0, ok » — FD-11). Le fix passe de « à confirmer » à confirmé par le commanditaire.

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
