---
title: 'GANG — Lot 4 (b) · confrontation visuelle & réglage des tokens (instance design dédiée)'
created: '2026-07-13'
updated: '2026-07-13'
version: 0.1.0
status: active
type: brief-lot
---

# Mandat — Lot 4 (b) · confrontation visuelle & réglage des tokens

> **Pour une instance dédiée, isolée.** Eric va te **montrer des wireframes
> medium-fi générés par Claude Design** — c'est pour ça que tu existes à part : la
> conversation-images reste **chez toi**, l'instance de supervision garde
> l'overview. Ton geste = **la tranche (b) du lot 4** : donner à l'app sa
> **signature visuelle finale** en réglant les **valeurs**, sur une ossature déjà
> bâtie et accordée. Tu ne refais pas la structure ni la logique — tu **joues les
> notes sur l'instrument accordé**.

## Le contexte (ce qui est déjà là)

L'app est **fonctionnellement complète** (lots 0→4a, 107 tests verts). Le **style
est en ossature** : base placard noir/crème, rendu appliqué partout, mais les
**valeurs esthétiques sont des placeholders** (couleurs alpha-core). Les **tokens
sont accordés** (lot 4a) — nommés, source unique, un changement se propage.

## Le lire d'abord (fait foi)

- `app/src/theme/tokens.ts` — **l'instrument** : `siege` (4 couleurs), `chaleur`
  (`braise` 4d / `brasier` 4f), `matiere` (crayon/gravé), `palette`. **C'est ici
  que tu règles.**
- `signature/reshape.md` §La direction de style (le « placard » / « l'affiche »,
  4b/4c/3e/3f/3h retenus) · `specs/specs-ecrans.md` §Le thème.
- Les planches déjà retenues : `app/docs/claude_design/2-alpha-signature/retour/`.
- Les écrans à styler : `AccueilScreen`, `RoundScreen` (+ `Gong`, `PlayerPill`,
  `Cartouche`, `NumPad`), `Feuille`, `SteleScreen`, `Annonce`.

## Ta boucle

1. **Confronte** les wireframes medium-fi (Eric te les montre) à l'**ossature
   actuelle** (lance l'app / lis les écrans). Nomme les écarts : où le rendu réel
   trahit la direction, où il tient.
2. **Règle les valeurs** dans `tokens.ts` d'abord (les 4 **sièges** redessinés en
   cohérence placard · les **chaleurs** calées entre braise et brasier · les
   **matières** crayon/gravé), puis les ajustements d'écran qui ne passent pas par
   un token (la **matière pierre** de la stèle, le **beau final**, l'alignement du
   Gong avec l'anim).
3. **Vérifie** : `tsc` clean, les **107 tests restent verts** (tu ne touches pas au
   domaine ni à la logique). Idéalement à l'œil sur device.

## DEHORS — ne PAS faire

- **Ne change pas la STRUCTURE** : ni les tokens (leurs noms/chemins), ni l'IA
  signée, ni la logique (domaine prouvé), ni le flux des lots 0→4a.
- **Pas le ship** : rename app, build APK, page de diffusion = l'instance de build.
- **Pas de nouvel écran, pas de nouvelle feature.** Tu habilles, tu ne construis pas.
- **Pas de bump de version app** (ADR-014).
- **Ne re-questionne pas la conception signée** — tu la *rends belle*, tu ne la
  rouvres pas.

## Rendu (vers Eric, puis la supervision)

- Un **diff** (surtout `tokens.ts` + quelques écrans) + la **carte de ce que tu as
  réglé** (quel token, quelle valeur, pourquoi — confronté à quelle planche).
- **Un résumé COURT et sans images** destiné à l'instance de supervision (pour la
  porte ② : ce qui a changé, ce qui est vérifié tsc/tests, ce qui reste device).
  → **les images restent chez toi** ; la supervision relit le **diff**, pas les
  planches.
- Handoff propre quand Eric le déclare.
