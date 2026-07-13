---
title: 'Handoff — lot 4 (a) · la frime + les portes + l''échafaudage tokens'
created: '2026-07-13'
updated: '2026-07-13'
version: 0.1.0
status: active
type: handoff-lot
---

# Handoff — lot 4 (a) · la frime, les portes, l'échafaudage des tokens

**Pour :** la supervision. Diff en cours (non commité), à valider avant intégration.
Brief : `2026-07-13-brief-lot-4.md`.

## 1 — Le Gong

`Hub.tsx` supprimé (déjà orphelin — `RoundScreen` ne l'importait plus depuis le
reshape lot 1). Nouveau `Gong.tsx` : posé dans le slot `overlay` de
`QuadrantGrid` (l'interstice central, exactement le rôle que documentait déjà
le vieux `Hub`), visible en état `jouer`/`saisir`, l'asset `gang-of-four.webp`.
Tap → `onTapGong` (RoundScreen) : `incrementGof()` (store, global — jamais par
joueur) puis monte `<GofAnimation onDone={...}>`, rendu plein écran (dernier
enfant du `SafeAreaView`, pas dans `plateauZone` qui plafonne à 50 % — la
frime doit couvrir tout l'écran). Verrouillé (`disabled`) tant qu'une frime
joue déjà ou que la cérémonie branlée tient l'écran.

`GofAnimation.tsx` modifié suivant sa propre note `Cible` : `playerId` retiré,
plus de biais couleur (le spectre disco tourne brut, cf. specs-anim-frime.md
§Les beats, révision 12/07). Les 4 `Quadrant` reçoivent `recede={frimeOn}` —
le plateau entier recule (pas 3 sur 4, il n'y a plus de joueur déclencheur).

## 2 — Le rugissement d'entrée

Même rendu (`GofAnimation`), pas compté. Store : `resetGame` pose `freshEntry:
true` (transitoire, jamais persisté — absent de `Game`/`gameOf`/`saveGame`).
`RoundScreen` le consomme (`clearFreshEntry`) au premier passage en état
`jouer` : immédiat pour une revanche (le state est déjà `jouer` au montage,
noms conservés), après les prénoms pour un roster neuf (transition
`nommer`→`jouer`).

Le flag était nécessaire — au seul `state` dérivé, une revanche fraîche
(0 manche, joueurs nommés) et une reprise d'une partie mise en pause avant la
1ʳᵉ manche (mêmes conditions) sont indiscernables. `freshEntry` tranche : posé
uniquement par `resetGame` (jamais par `hydrate`, qui ne le touche pas — reste
à sa valeur par défaut `false`), donc une reprise (Accueil « reprendre » ne
rappelle jamais `resetGame`) ne le voit jamais passer à `true`. Testé côté
store (`gameStore.test.ts`, 2 tests dédiés) ; le timing réel (immédiat vs
après-prénoms) n'est **pas** observable en test (pas de RN Testing Library
dans ce projet) — raisonné, pas rejoué à l'écran.

## 3 — La porte « corriger » du final

Réutilise tel quel `onCorrigerDerniere` (déjà écrit au lot 3c pour l'aperçu-
feuille) — c'est exactement le geste demandé (`uncommitLastRound` puis saisie
pré-remplie). Résout l'« ouvert » laissé par le handoff lot 3c (option B :
ajouter le geste sur l'annonce finale). Le bouton n'apparaît que si
`finalCorrectable` (la manche gagnante n'est pas une branlée gravée — même
garde que l'aperçu-feuille ; `uncommitLastRound` refuse de toute façon une
branlée, mais un bouton qui ne fait rien au tap est une mauvaise UX).

## 4 — La porte « consulter » du final

`onConsulter` → `navigation.navigate('Stele', { gangKey: gangKey(players) })`.
Toujours affichée (une partie finie a toujours 4 prénoms valides → une
`gangKey` valide).

## 5 — L'échafaudage des tokens

`theme/tokens.ts` : trois groupes nommés, valeurs **provisoires**, aucune
inchangée sauf renommage/dérivation :
- **`siege`** (`hautGauche`/`hautDroite`/`basGauche`/`basDroite`) — `seatColors`
  (indexé `PlayerId`, tous les sites d'appel existants) en dérive maintenant ;
  un seul endroit à toucher pour le redesign des 4 couleurs.
- **`chaleur`** (`braise`/`brasier`) — `palette.accentSaisie` est un alias de
  `chaleur.braise` (dérivé, pas dupliqué) : les 4 sites qui l'utilisaient déjà
  (PlayerPill saisie active, flash « passe devant », le lien « corriger » de
  l'aperçu-feuille, « annuler la partie ») suivent sans y toucher.
- **`matiere`** (`crayon`/`grave`, léger vs lourd/inversé) — `crayon` documente
  le défaut déjà partout (`palette.fondCreme`/`encre`, non migré : zéro
  bénéfice à renommer ce qui propage déjà). `grave` est routé vers les 3
  surfaces inverse existantes qui dupliquaient le même couple encre/fondCreme :
  `Feuille` (branlée, ligne TOT), `SteleScreen` (le bloc monument), `Annonce`
  (final + cérémonie). Un seul changement de `matiere.grave.fond`/`.encre` se
  propage aux trois. `matiere.grave.overlay` porte l'alpha du calque
  translucide de l'`Annonce` (`rgba(26,26,26,0.92)`) — **distinct** de
  `.fond` (opaque) pour ne pas aplatir la transparence voulue derrière
  l'annonce.

**Délibérément pas touché** : les teintes incidentes (`rgba(0,0,0,0.06)` du
plateau, `rgba(255,255,255,0.18)` des séparateurs clairs, le `SPECTRUM` disco
de `GofAnimation`) — aucune ne correspond aux 3 axes réglables d'Eric
(chaleur/siège/matière), les tokeniser serait de la churn sans bénéfice.

### Carte des tokens réglables (ce qu'Eric touche)

| Eric veut régler… | Token |
|---|---|
| l'intensité chaude (meneur, disque qui rayonne, manche éditable, le Gong) | `chaleur.braise` / `chaleur.brasier` (`theme/tokens.ts`) |
| les 4 couleurs de siège | `siege.hautGauche/hautDroite/basGauche/basDroite` |
| le bloc gravé (branlée, stèle, annonces) — fond + encre | `matiere.grave.fond` / `matiere.grave.encre` |
| le calque translucide de l'annonce | `matiere.grave.overlay` |

## Non vérifié en simulateur

Comme au lot 3c : tout ce qui précède est vérifié par `tsc --noEmit` + `jest`
(logique du store, types), **pas** par un geste réel. Points raisonnés mais
non observés :
- le timing du rugissement (immédiat / après-prénoms / silence à la reprise) ;
- l'alignement visuel du Gong avec `GofAnimation` — l'anim est montée au
  niveau du `SafeAreaView` (plein écran, centrée écran), alors que le Gong
  vit dans le tiers supérieur (`plateauZone`, ~50 %) : le beat « part du
  disque central » (specs-anim-frime.md) ne part donc pas visuellement du
  Gong mais du centre de l'écran. Rendu fin / repositionnement = geste
  d'Eric, pas bloquant pour la gate mais à savoir avant de juger le rendu ;
- `GofAnimation` garde `pointerEvents="none"` sur son overlay (déjà ainsi
  avant ce lot) : le numpad / l'aperçu-feuille restent tapables sous la
  frime pendant les 5 s. Pré-existant, hors scope de ce brief, signalé pour
  ne pas passer pour un oubli ;
- le routage tap Gong / tap pill (le Gong est dans le slot `overlay`,
  `pointerEvents="box-none"`, comportement RN standard) — pas rejoué.

## Rendu

Diff **non commité**. `npm test` → 107/107 verts (103 + 4 nouveaux :
`incrementGof` cumule + reset à zéro, `freshEntry` posé par `resetGame` +
consommé par `clearFreshEntry`). `tsc --noEmit` clean. Je ne déclare pas la
gate passée — c'est à Eric de la constater (pacte, clause 1 : je ne pousse pas
vers la clôture). Porte ② à la supervision.
