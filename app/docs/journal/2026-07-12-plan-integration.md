---
title: 'GANG — Plan d''intégration du reshape (alpha-signature)'
created: '2026-07-12'
updated: '2026-07-13'
version: 0.2.2
status: active
type: plan
---

# GANG — Plan d'intégration du reshape

> **Le pont conception → build.** S'exécute **au dégel du dev** (Eric déclare).
> Sources : `specs/` 0.2.1 (révisées 12/07) + `signature/reshape.md`. Trio
> habituel : supervision / intégration / déploiement. Aucune dépendance native
> nouvelle (expo-audio, view-shot, sharing déjà là) → pas de build EAS requis
> par le reshape lui-même.

## Le tag du code (étape 3 de la méthode) — chaque fichier jugé

**[H]** hérité (survit tel quel) · **[R]** reshapé (la forme remplace) ·
**[N]** neuf · **[†]** supprimé.

| fichier actuel | tag | cible |
|---|---|---|
| `domain/scoring.ts` · `winner.ts` · `direction.ts` | **[H]** | intouchés — le cœur prouvé (62 tests) |
| `domain/model.ts` | **[R]** | +`gofCount`, statut 3 issues, session (lieu optionnel) |
| `domain/stats.ts` | **[R]** | miroirs indépendants (décroiser les pôles), portée gang, branlée, tenant par rejeu |
| `domain/` *(nouveau)* | **[N]** | `detectBranlee(round)` → `null\|'petite'\|'grosse'` |
| `store/gameStore.ts` | **[R]** | 3 issues (annulée ≠ archivée), pause/reprise |
| `store/soireeStorage.ts` | **[R]** | soirée-unique → **le vrac** (terminées, inter-sessions, local P1) + migration de clé `gof:soiree` (schemaVersion) |
| `App.tsx` | **[R]** | stack : accueil · Round · stèle + feuille (modale) — hub-and-spoke |
| `navigation/types.ts` | **[R]** | routes hub-and-spoke (accueil/Round/stèle/feuille) |
| `screens/SplashScreen.tsx` | **[†]** | remplacé par **l'accueil** [N] |
| `screens/SetupScreen.tsx` | **[†]** | dissous dans le Round (état *nommer*) |
| `screens/ScoreEntryScreen.tsx` | **[†]** | dissous dans le Round (état *saisir*, numpad en zone du bas) |
| `screens/RoundScreen.tsx` | **[R]** | le Round : cartouche + plateau + zone du bas à états ; l'alert « Rejouer avec qui ? » **[†]** (remplacée par le retour accueil) |
| `screens/ScoreGridScreen.tsx` | **[†]** | éclaté : la **feuille** (modale) [N] + la **stèle** [N] |
| `components/Hub.tsx` | **[†]** | remplacé par **`Gong`** [N] (2 tailles, asset logo, tap → frime/entrée) |
| `components/SeatSelectors.tsx` | **[†]** | les pills du plateau sont la cible de saisie |
| `components/ScoreCarnet.tsx` | **[R]** | → **`Feuille`** : scores de manche, crayon/gravé, branlée qui pèse |
| `components/Palmares.tsx` | **[R]** | absorbé par la **stèle** : 2 trônes + détail + branlées + mention GOF |
| `components/GofAnimation.tsx` | **[R]** | sans `playerId` (biais couleur retiré), plateau entier recule, + rugissement d'entrée |
| `components/PlayerPill.tsx` | **[R]** | tap = saisie (le long-press GOF part au Gong) ; état allumé ; notifs revues |
| `components/NumPad.tsx` | **[R]** | numpad-calculette 3×4 : 0-9 · del · **« = »** |
| `components/Quadrant.tsx` · `QuadrantGrid.tsx` · `PlayDirection.tsx` | **[H]** | le plateau — `PlayDirection` **réintégré** autour du Gong |
| `components/gofSound.ts` | **[H]** | + sons à venir (délégués) |
| `theme/tokens.ts` | **[R]** | palette placard : noir/crème + chaleurs logo ; 4 sièges **à redessiner** ; marques typo |
| `components/` *(neufs)* | **[N]** | `Cartouche` · `Annonce` (flash/cérémonie/final) · `GangList` (tes gangs) · `Wordmark` |

## Les lots — ordre d'exécution

**Lot 0 · le domaine (pur, prouvé d'abord)** — *comme alpha-core : la logique
avant l'UI.*
`detectBranlee` + miroirs `stats.ts` + `gofCount`/3 issues au modèle + le vrac
(`soireeStorage` + migration de clé). **Gate : les tests étendus verts**
(cas-reference 0.2 : branlée bornes 30/45, titres miroirs, monde étrange) +
les 62 existants intacts. Zéro UI touchée.

**Lot 1 · la scène** — le Round nouveau : cartouche + plateau (PlayDirection
gardé, notif « donne sa meilleure carte » gardée) + zone du bas à états ; le
battement (tap pill → numpad « = ») ; **keepAwake** pendant la partie (friction
n°1 soirée 01) ; Setup et ScoreEntry dissous ; tokens placard **v1 ossature**
(structure, pas le polish — « factoriser n'est pas polir »). **Gate : une partie
complète jouable au doigt sur le nouveau Round, sans que l'écran se verrouille.**

**Lot 2 · la voix** — les annonces sur le plateau (rareté = intensité) : flash
léger, **cérémonie branlée** (2 sorties corriger/graver), **final** plein
plateau (miroir gloire/💩). Dépend des lots 0+1. **Gate : une branlée saisie
déclenche la cérémonie ; une partie finie déclenche le final.**

**Lot 3 · le gravé** — l'accueil (disque-GANG **4c**, tes gangs + temps relatif,
**masquer/démasquer** un roster, 3 états dont annuler) · la stèle (2 trônes,
détail, mention GOF, on rejoue ?, **partager**) · la feuille (modale, scores de
manche, crayon/gravé, partager à tout moment) · **appui long sur pill =
renommer** · la nav hub-and-spoke complète (`App.tsx`). **Gate : « écrire
l'histoire » testable — une partie d'hier se rouvre, le palmarès du gang tient
inter-sessions.**

**Lot 4 · la frime élargie + le polish** — Gong (tap, rugissement d'entrée),
anims variance (assets délégués — sons/anims des potes, Eric intègre), le
rendu fin des tokens (chaleurs 4d↔4f, sièges redessinés, matières
crayon/gravé), renommage app **GANG** (app.json, APK, page
dev.irimwebforge.com). **Gate : la table réelle — prochaine soirée.**

## Risques nommés

- **La migration du vrac** (clé `gof:soiree` → nouveau schéma) : seule opération
  destructrice possible — schemaVersion + garde, test de reprise obligatoire.
- **Le clavier natif** (état *nommer*) : la contrainte plateau-visible est
  spec'd (`specs-ecrans`) mais à éprouver sur device tôt (lot 1).
- **L'irréversible** (branlée gravée) vs l'esprit clément : la cérémonie est le
  seul verrou — QA dédiée sur corriger/graver.
- **La marque branlée — signée : l'encoche `/` `//`** (fourche 15). Le risque
  tombe ; rendu fin (taille, graisse) au lot concerné.

## Ce qui reste avant le dégel — les décisions d'Eric

1. **La marque branlée — signée : l'encoche `/` `//`** ✅.
2. L'intensité chaud **4d/4f** — se cale aux tokens (lot 4), pas bloquant.

*Tranchées le 12/07 (portées aux specs) : disque-GANG = **4c** · renommer =
**appui long sur la pill** · effacer un gang = **masquer** (démasquage : en
rejouant, ou ligne « + N masqués ») · partage = **feuille ET stèle, à tout
moment** · le rugissement d'entrée n'incrémente pas `gofCount`.*
