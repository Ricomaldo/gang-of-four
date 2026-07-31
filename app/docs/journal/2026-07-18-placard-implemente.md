---
title: 'GANG — Le placard implémenté : la signature posée sur les 5 écrans'
created: '2026-07-18'
updated: '2026-07-18'
version: 0.2.3
status: active
type: journal
---

# Le placard — la signature visuelle, enfin bâtie

> **Trace du 18/07.** Le **vernis visuel 4b**, resté « hors boucle » depuis le
> 13/07, a été fait **pour de vrai** — pas un réglage de valeurs, un **restyle
> intégral au placard** sur les 5 écrans, via un **canal neuf** (Claude Design →
> Claude Code direct). Plus un bug de lancement corrigé et les specs intégrées.

## Le déclencheur — « trop timide, des specs pas tenues »

Eric, en confrontant le rendu 4b à ses planches : **déçu**. Trop timide, beaucoup
de specs non tenues. Diagnostic honnête (le mien) :

- **L'identité visuelle n'a jamais existé en texte buildable dans le repo.** Elle
  vivait dans la tête d'Eric + les wireframes Claude Design — des **images**.
- Toute la boucle d'intégration était **gatée au texte et aux tests** (diff qui se
  lit, `tsc`, 107 verts). **Une image ne passe pas un gate texte+test** → le visuel
  a traversé toutes les portes sans jamais être vérifié contre les planches.
- Pire, mon **brief 4b interdisait de toucher la structure** — or la hardiesse du
  placard (Anton massif, bandes inversées, disque double-anneau) *est* de la
  structure. J'avais clôturé en « fidèle au signé » alors que le signé lui-même
  **reportait la signature**. Le seul `fontFamily` du code était `'monospace'` :
  aucune fonte d'affiche chargée. Anton 88px vs gras-système, c'est *toute* la
  différence entre « l'affiche » et « timide ».

## Le correctif structurel — le canal direct Design→Code

Eric a ouvert le **canal direct** (`/design-login`, MCP `claude_design`) et commandé
une **spec précise** : `GANG - Specs placard` (hexs, fontes nommées, traitements par
écran, copies, invariants). **L'identité est enfin arrivée en texte, dans le gate.**
C'est *ça* le vrai fix — pas un énième réglage.

## Ce qui a été bâti (5 écrans + fondation)

- **Fondation** : `expo-font` + **Anton / IBM Plex Mono / Caveat** chargées au boot
  (`useFonts`, App.tsx). `theme/tokens.ts` réécrit sur la palette exacte + la
  **règle d'or du chaud** (le vivant seul) + les 2 matières.
- **Accueil** : cartouche bande noire · **disque-GANG inversé** (encre, GA/NG crème
  Anton, double anneau) · tes gangs (entête encadrée, dernier joué inversé).
- **Round** : meneur = **cellule rouge** + ◀ + prénom **ambre** au cartouche ·
  totaux **Anton** · Gong = disque crème-relief, bord noir, **halo orangé** ·
  plateau bord haut 4px · aperçu crayon dashed.
- **Stèle** : dalle-monolithe · champion **sans glyphe** (gloire = le plus gros
  corps) · looser **☞** gris plus bas · détail colonnes **▲▼ ‡** · socle brique.
- **Feuille** : gravé, **‡ / ‡‡**, nombres Anton, branlée inversée « 0 ‡ » rouge
  clair · entête + partager en bandes noires.
- **Annonce** : gloire Anton géant + halo ambré (sans glyphe) · honte **☞** en silence.

## Décisions au fil (Eric déclare)

- **‡ / ‡‡** (la croix de branlée) **supersede l'encoche `/` `//`**.
- **Les 4 couleurs de siège retirées** : plateau noir/crème, seul le meneur s'allume.
- **Disque accueil en 4b** (noir), non 4c (crème).
- **Rugissement d'entrée retiré** : l'anim ne joue que sur **tap-Gong en jeu**.

## Le bug de lancement (corrigé à la racine)

La 1ʳᵉ lettre du 4ᵉ prénom lançait la partie (on quittait `nommer` dès
`namesReady`, clavier fermé avant la fin du mot). Corrigé : **on ne quitte le setup
QUE par le tap-Gong délibéré** — le Gong central n'apparaît qu'une fois les 4 noms
posés et c'est lui qui lance (sans anim). `inSetup` ne dépend plus des champs remplis.

## Les docs — le modèle 3-rôles

Pour ne jamais recréer le péché d'origine (deux specs qui divergent) :
**placard figé = le pixel-vrai · `tokens.ts` = les valeurs · specs/signature =
l'intention.** Concrètement : `claude_design/2-alpha-signature/retour/specs-placard.md`
(figé, passe 5) · pointeur dans `specs/specs-ecrans.md §thème` · `specs-anim-frime`
(rugissement retiré) · `passes.md` (passe 5, la réouverture par le canal direct).

## État & reste

**tsc clean · 107 tests verts · vérifié sur device (Anton monte, l'identité lit).**
Rien commité — le sceau est à Eric, la review visuelle aussi.
**Reste :** des **retouches** (la grille de score / scoresheet + du polish) · les
**sons** (Jacques) · le **ship** (rebuild + page + bump `app.json 0.1.0 → 0.2.0`,
instance build). Le **vrai jalon** — « tenir la partie » à 4 en réel — reste devant.
