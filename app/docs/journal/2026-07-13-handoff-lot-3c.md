---
title: 'Handoff — lot 3c (intermède) · ménage + undo crayon'
created: '2026-07-13'
updated: '2026-07-13'
version: 0.1.0
status: active
type: handoff-lot
---

# Handoff — lot 3c · le ménage, puis l'undo crayon

**Pour :** la supervision. Diff en cours (non commité), à valider avant intégration.
Brief : `2026-07-13-brief-lot-3c.md`.

## Chantier 1 — le ménage

Fait, gate vérifié :
- `soiree` (champ) + `todaySoiree` retirés de `gameStore.ts` — plus aucun `s.soiree`.
- `gofCount` requis (`Game` + `GameArchive`, `domain/model.ts`) ; sites de
  construction (`gameOf`, l'archive d'`addRound`, `FeuilleScreen`) lâchent le
  `?? 0` ; fixtures de test (`mkArchive` ×2 dans `soiree.test.ts` et
  `stats.test.ts`) posent désormais `gofCount: 0`.
- `soireeStorage.ts` → `vracStorage.ts` (`git mv`), tous les imports mis à jour
  (`gameStore`, `AccueilScreen`, `SteleScreen`, `FeuilleScreen`, `GangList`,
  les deux fichiers de test). Fichier de test resté `soiree.test.ts` (couvre
  aussi `roundLastPlace`/`manchesGagnees`, pas que le vrac).
- Commentaires périmés corrigés dans `model.ts` et `gameStore.ts`.

**Deux résidus textuels** (pas des références vivantes — `tsc`/grep sur le
comportement sont clean) que je n'ai pas fait disparaître, à valider :
- `FeuilleScreen.tsx:13` — « même mécanique que l'ex-ScoreGridScreen (supprimé…) ».
  Lecture historique correcte (il est nommé comme mort), je l'ai laissé.
- `vracStorage.ts:14` — la note de rename que j'ai moi-même posée (« Renommé
  `soireeStorage.ts` → `vracStorage.ts` ») nomme forcément l'ancien nom.

Si le gate lu au pied de la lettre (« zéro référence ») doit être zéro texte et
pas seulement zéro code vivant, dis-le et je les efface.

`tsc --noEmit` clean, **103 tests verts** (99 + 4 nouveaux, chantier 2).

## Chantier 2 — l'undo crayon

**Store** (`gameStore.ts`) : `uncommitLastRound()` — refuse (retourne `null`)
si aucune manche ou si la dernière est branlée (gravée, jamais corrigeable).
Sinon : retire la manche, repasse `'en-cours'`, et si le statut était
`'terminee'`, désarchive l'entrée correspondante du vrac (sinon une partie
« corrigée en arrière » resterait fantôme dans le vrac / « tes gangs »). Sauve.
4 tests dédiés dans `gameStore.test.ts`, dont un qui exerce précisément la
rebascule `terminee → en-cours` + désarchivage.

**UI** (`RoundScreen.tsx`) : en état `jouer`, la ligne de la dernière manche
dans l'aperçu-feuille porte une affordance « corriger » (texte, `ossature`,
pas de polish) — un `TouchableOpacity` imbriqué dans celui qui ouvre la
feuille complète. RN route le geste au plus imbriqué : taper « corriger »
n'ouvre pas la feuille, taper ailleurs sur l'aperçu l'ouvre toujours. `onPress`
appelle `uncommitLastRound()`, pré-remplit `entry` avec les 4 valeurs rendues,
active le premier siège — l'utilisateur peut éditer n'importe quelle pill puis
« = » recommite (le battement existant, intouché).

### Ouvert — la manche qui finit la partie n'a pas de geste UI aujourd'hui

Le gate demande « rebascule terminee → en-cours » comme comportement de
correction — le store le fait et c'est testé. Mais dans `RoundScreen`,
l'aperçu-feuille (donc l'affordance « corriger ») ne s'affiche qu'en état
`jouer` ; dès qu'une manche termine la partie, l'état bascule `termine` et
l'annonce finale (`Annonce kind="final"`, lot 2) recouvre tout l'écran —
aucun geste ne mène à `uncommitLastRound()` dans ce cas précis. Et c'est *la*
manche à plus fort enjeu (elle scelle vainqueur/💩).

Le brief (2c) donne le tap-aperçu comme un exemple (« p. ex. »), pas un
mandat — ajouter un « corriger » sur l'annonce finale est une piste, mais ça
touche `Annonce.tsx` (lot 2), hors de ce que ce brief liste, et le DEHORS
demande de ne pas y toucher hors liste. Je n'ai pas tranché seul. Deux sorties,
la décision est à toi :
- **A.** Store-only suffit pour cette itération : la rebascule existe et est
  prouvée, mais on ne peut pas encore la déclencher en fin de partie — geste à
  ajouter dans un lot futur touchant l'annonce finale.
- **B.** Le lot 3c doit couvrir aussi ce cas → j'ajoute une affordance
  minimale (ghost, comme « corriger » de la cérémonie) sur `Annonce
  kind="final"`, qui n'apparaît que si la dernière manche est du crayon.

## Non vérifié en simulateur

Je n'ai pas lancé l'app — tout ce qui précède est vérifié par `tsc` + `jest`
(logique du store, types) mais **pas** par un geste réel. Deux points
spécifiquement raisonnés, pas observés :
- le routage du tap imbriqué (« corriger » vs ouverture de la feuille) —
  comportement RN standard (le plus imbriqué capture), mais pas rejoué ;
- « l'ouverture de la feuille (3b) marche toujours » — non cassée par
  construction (la feuille complète n'a pas été touchée), mais non re-testée
  à l'écran.

## Rendu

Diff **non commité** (git status : working tree). `npm test` → 103/103 verts,
`tsc --noEmit` clean. Porte ② à la supervision — je m'arrête ici, la décision
sur l'ouvert ci-dessus et le passage au commit sont à Eric / à la supervision.
