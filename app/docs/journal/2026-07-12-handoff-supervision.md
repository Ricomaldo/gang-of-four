---
title: 'Handoff — relecture puis supervision (exécution du reshape 0.2)'
created: '2026-07-12'
updated: '2026-07-12'
version: 0.2.1
status: active
type: handoff-passe
---

# Handoff — relecture, puis supervision

**Pour :** une **instance dédiée**, à froid. Ton mandat a **deux temps
distincts**, dans cet ordre, et tu ne passes au second que quand Eric le
déclare :

1. **LA RELECTURE** — relire *de façon critique* toute la conception 0.2.
   Ce n'est pas une lecture d'accueil : c'est un **audit actif**. C'est aussi,
   sans que ce soit dit, ton onboarding réel — on ne possède une vision qu'en la
   travaillant.
2. **LA SUPERVISION** — une fois la relecture rendue et les questions vidées, tu
   deviens l'instance de supervision : tu **traduis le plan d'intégration en
   plan d'implémentation** (briefs de lot exécutables), puis tu supervises
   l'instance d'implémentation (créée le moment venu, séparée de toi).

*(Ce handoff **remplace** `2026-07-11-handoff-reshape.md`, consommé — tout ce
qu'il annonçait est fait.)*

## 0 · Boot — dans cet ordre

1. `CLAUDE.md` du repo + le bundle **`_engagement/`** (pacte, manifeste, arbres,
   grille). **Scelle le pacte** (`/pacte`).
2. `app/docs/README.md` (la carte de `docs/`) puis **`signature/reshape.md` EN
   ENTIER** — le hub : l'identité traduite, les fourches tranchées (1-14), l'IA,
   le battement, le gravé, la direction de style.
3. Les **8 specs** (`specs/`, toutes 0.2.1 — `specs-ecrans.md` est la clé de
   voûte) et le **plan** (`journal/2026-07-12-plan-integration.md`).
4. Le **code tagué** : chaque fichier de `src/` porte en tête son sort
   (`RESHAPE 0.2 · TAG [H]/[R]/[†]`), sa cible, son lot.
5. Les planches de référence : `claude_design/2-alpha-signature/retour/` +
   `brief/passes.md` (le fil des 4 passes de design).

## 1 · Temps 1 — la relecture critique (ton premier livrable)

**La question que tu poses à tout :** *cette chaîne est-elle exécutable sans
trahir la signature ?* Concrètement :

- **Cohérence de chaîne** : signature → specs → plan → tags. Chaque décision de
  `reshape.md` §fourches a-t-elle atterri dans une spec ? Chaque spec est-elle
  portée par un lot du plan ? Chaque tag in-file correspond-il au plan ?
- **Trous d'exécutabilité** : qu'est-ce qu'une instance d'implémentation ne
  saura PAS faire avec ces docs ? (ambiguïtés, contraintes non chiffrées,
  dépendances entre lots non dites).
- **Contradictions résiduelles** : les docs ont été écrits en 3 jours intenses —
  cherche les endroits où deux docs disent encore deux choses.
- **Le passif connu, n'y reviens pas** : la marque branlée est À SIGNER (💪 et ‡
  rejetés — jamais de placeholder) ; l'intensité chaud 4d/4f se cale aux tokens ;
  les seuils 30/45 sont ajustables à la récolte ; les exemples chiffrés des
  fiches `signature/ecrans/` sont NON conformes au barème (noté, les cas font
  foi dans `cas-reference-score`).
- **Méthode qui a fait ses preuves ici** : l'audit adversarial en agent séparé,
  citations fichier:ligne, sévérité (bloquant/notable/mineur), et **ne pas
  fabriquer d'écarts** quand c'est propre.

**Rendu** : un rapport de relecture (fichier dans `journal/`, daté) — écarts,
questions à Eric, et TON avis sur l'ordre des lots. Puis Eric tranche ce qui
doit l'être, et déclare (ou non) ta bascule en supervision.

## 2 · Temps 2 — la supervision (après déclaration d'Eric)

- **Traduire** le plan d'intégration (5 lots, gates) en **briefs de lot** pour
  l'instance d'implémentation : périmètre exact, fichiers, specs sources, tests
  attendus, definition-of-done = la gate du lot. Un brief à la fois, validé par
  Eric avant de lancer.
- **Superviser** : tu ne codes pas — tu cadres, tu relis les diffs, tu tiens les
  gates, tu remontes les fourches à Eric. L'instance d'implémentation vit sa vie
  courte (un lot, puis handoff propre).
- **Règles de build héritées du manifeste** : « un écran = un fichier fin qui
  compose des composants nommés ; toute vue réutilisée ou > ~80 lignes =
  extraite » (poser la règle en amont, l'instance de code la suit) ·
  « factoriser n'est pas polir » (ossature au plancher, rendu fin au lot 4) ·
  jamais de bump de version sans Eric (ADR-014).

## 3 · La posture — ce qui fait la qualité (durement appris)

- **Eric conduit le tempo.** Ne JAMAIS pousser vers la clôture, ne jamais lui
  proposer de « finir » — il décide seul (pacte, clause 1 ; deux instances s'y
  sont brûlées).
- **Ton chaleureux, fluide, comptoir** — pas de rapport, pas de mur de texte.
  Eric est **visuel** : un croquis ASCII vaut mieux qu'un paragraphe. Il apprend
  le langage UI/UX en marchant : donne les mots de métier quand ils servent.
- **Lire avant d'improviser** — le piège n°1 : re-concevoir ce qui est déjà
  écrit. Le repo fait foi, pas ta mémoire.
- **Capture immédiate** — toute décision va dans les fichiers tout de suite ;
  une conversation meurt, le disque non.
- **Fourches à Eric, plomberie à toi** (pacte, clause 6) : ce qui touche sa
  carte (structure, noms, design) → tu armes, il signe. Présente les
  alternatives **en français clair** (il l'a exigé), jamais en codes.
- **Pas d'inflation de fichiers** — un fichier neuf passe par son ok. Capturer
  dans les maisons existantes.
- **Compteur honnête** — coché = fait, pas esquissé.

## 4 · Le dispositif — trois instances

- **L'instance mère** (celle qui a conçu la 0.2) reste ouverte **en support**
  pendant ta relecture : si un pourquoi te manque (une décision sans trace, un
  contexte), **formule la question dans ton rendu** — Eric la porte à l'instance
  mère et te rapporte. Ne devine pas.
- **Toi** : relecture → supervision.
- **L'instance d'implémentation** : créée plus tard, par lot, jetable.

## 5 · État exact au moment du handoff (12/07, ~3h)

Conception 0.2 **close et scellée** : identité GANG (5 piliers, colonne) ·
reshape conçu (2 mondes, organes, scène) · round Claude Design clos (4 passes,
direction « l'affiche », 4c signé) · specs 0.2.1 (8 fichiers, confrontés aux
docs fondateurs — keepAwake, notif « donne sa carte », undo minimal réintégrés) ·
fourches 1-14 tranchées · plan d'intégration (5 lots, gates, risques) · code
tagué (26 fichiers, tsc clean, 62 tests verts). Commits : `e0a1edb` + `21426cf`.
**Dev gelé** — rien ne s'implémente avant le dégel d'Eric.
