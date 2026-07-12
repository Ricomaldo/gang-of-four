---
title: 'GANG — Round 2 · journal des passes Claude Design'
created: '2026-07-12'
updated: '2026-07-12'
version: 0.2.1
status: active
type: passes-log
---

# Round 2 · journal des passes

> Une entrée par vague : ce qu'on a demandé, ce qui est revenu, ce qu'Eric a
> retenu. Les findings de fond sont gravés dans `signature/` (reshape, copy-deck,
> branlee, palmares, fiches écrans) — ici, le fil de l'échange.

## Passe 1 — le paquet initial (11/07)

**Envoyé :** `00-brief.md` + `donnees-exemple.md` + les 4 fiches. Demande : 2-3
variantes/écran, amplitude *carnet-avec-swagger → graphique fort*.
**Revenu :** 3 directions — A carnet tatoué · B « placard » (affiche bold) · C
stèle nocturne.
**Retenu :** 1b/1d/1h/1i/1k. Émergence : placard = proclamer/graver · carnet =
jouer. **Ratés :** monde étrange en vedette (erreur de nos données) · emojis
stock flottants · Round à moitié vide · nocturne = mode nuit, pas une stèle.

## Passe 2 — corrections (12/07)

**Demandé :** copy « on rejoue ? » · marques typo au lieu d'emojis · stèle =
pierre gravée · Round rééquilibré · données cas-normal.
**Revenu :** placard v2 / hybride (accueil) · Round 2c/2d · stèle calcaire /
basalte / placard-monument · feuille placard/carnet v2.
**Retenu :** le **placard partout** — il cohère, la pierre à part jure. Stèle =
placard-monument (2g). **Findings :** « gagne la manche » (jamais « plie ») ·
branlée = petite/grosse (échelle) · « le looser », pas « le pointé » · le Round
encore raté · « tes gangs » ne montrait qu'un roster.

## Passe 3 — tout placard + logo (12/07)

**Demandé :** tout en placard · logo `gang-of-four.webp` dans le disque, grand ·
Round refait (zéro vide mort) · accueil multi-gangs · copies fixées.
**Revenu / retenu :** **3b** (accueil manchette + disque sur le pli, liste
navigable) · **3e** (Round 70/30, totaux 96px, disque 170px — le sommet) · **3f**
(stèle monolithe raffinée) · **3h** (feuille copies fixées).
**Restes :** sur l'accueil le logo rivalise avec le wordmark (deux « GANG ») →
décision : **GANG deux lignes dans le disque à l'accueil, le logo réservé au
Round**. Et le Round mérite **un cran plus chaud** (rouge/jaune du logo en
accents) — quand tout crie, plus rien ne crie.

## Passe 4 — disque-GANG + chaleurs (12/07) — DERNIÈRE

**Demandé :** un seul GANG (le mot dans le disque à l'accueil, le logo réservé au
Round) · le Round réchauffé aux couleurs du logo (3 intensités).
**Revenu :** accueil 4a/4b/4c (disque crème / gong sombre / cadrage serré) ·
Round 4d/4e/4f (braise / chaleur / brasier).
**Retenu :** **4b et 4c** (accueil — départage au build) · **4d et 4f** (Round —
l'intensité exacte se calera aux tokens). Rendus figés dans `retour/`.

## Clôture — arrêt Claude Design (12/07, décision)

À ce stade les variantes ne se distinguent plus : **l'exploration a convergé.**
Les questions restantes sont de l'**ingénierie d'écran**, pas du style — hors de
portée de Claude Design :
- la **flèche du sens de jeu** (`PlayDirection`) absente des rendus — élément réel
  qui ne disparaît pas ;
- la **zone du bas trop petite** dans les rendus (70/30) : le clavier natif
  (nommer) et le pavé 3×4 (saisir) n'y tiennent pas → hauteur **dépendante de
  l'état**, à spec nous-mêmes ;
- l'**aperçu feuille à une seule ligne** (M5) illisible hors contexte → l'aperçu
  doit porter ≥ 2 manches + la vierge ;
- CD prend des **libertés silencieuses** (choix non demandés) — normal en
  exploration, disqualifiant pour du spec.

**Acquis du round 2 :** la direction (le placard/l'affiche) · le disque-GANG ·
le logo qui règne sur la table · les chaleurs rouge/jaune · les marques typo ·
les copies de table. **La suite se joue chez nous** : passe specs 0.2 →
annotation des écrans réels (tag hérité/reshapé/neuf) → plan d'intégration.
