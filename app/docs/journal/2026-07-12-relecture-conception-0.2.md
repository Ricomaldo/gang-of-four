---
title: 'GANG — Relecture critique de la conception 0.2 (temps 1)'
created: '2026-07-12'
updated: '2026-07-12'
version: 0.2.1
status: active
type: relecture
---

# Relecture critique — conception 0.2

> **Temps 1 du mandat** (`journal/2026-07-12-handoff-supervision.md`). La question
> posée à toute la chaîne : *est-elle exécutable sans trahir la signature ?*
> Méthode : lecture intégrale (README · reshape · 8 specs · plan · 26 tags in-file
> · `package.json`) + 3 audits adversariaux séparés (fidélité signature ·
> contradictions/chiffres · exécutabilité), chaque finding **vérifié sur pièce**
> avant d'être retenu. La fidélité à la signature (§4) a été **spot-checkée sur les
> fichiers-sources** (`branlee.md`, `essence.md`, `copy-deck.md`, `ecrans/03`), pas
> seulement relayée. Sévérité : **bloquant** (l'impl ne peut pas avancer ou
> coderait faux / trahit la signature) · **notable** (perte réelle rattrapable) ·
> **mineur** (hygiène). Rien n'est fabriqué : ce qui est propre est dit propre.
> **Non couvert** : les planches `claude_design/2-alpha-signature/retour/` n'ont pas
> été reconfrontées aux décisions de thème (4c/3e/3f/3h) — elles apparaissent captées
> dans `specs-ecrans.md:143-159` ; note de couverture, pas défaut présumé.

## Verdict d'ensemble

**La chaîne tient. Rien ne bloque le dégel qui ne soit une décision à ta main.**
Les 14 fourches ont toutes atterri dans au moins une spec ; la logique (barème,
seuils, départages, titres miroirs) est cohérente à travers tous les docs ; les 26
tags in-file collent au plan ; les 4 deps natives sont déjà installées. Le socle
prouvé (`domain/`, 62 tests) est `[H]`, intouché.

**Un seul vrai bloquant technique** : le contrat de stockage du **vrac** n'est pas
spécifié (§1). Le reste = 7 notables (des pertes rattrapables et des doc-fixes) et
une poignée de mineurs. Aucun ne remet en cause la conception — ils la finissent.

---

## Résolutions au fil du grill *(12/07, en direct avec Eric)*

1. **Le vrac repart à zéro.** Nouveau build réinstallé → aucune vieille donnée à
   reprendre, donc **aucune migration** à écrire : la mémoire naît propre à la
   première vraie partie. Le mot « migration » du tag `soireeStorage.ts:2`
   disparaît — c'est du stockage neuf, point. *(résout la moitié de §1 ; reste à
   spécifier la forme du vrac — plomberie de supervision.)*
2. **Gong pressé en pause = reprise.** Le disque-GANG de l'accueil est **la porte
   vers la table** (aujourd'hui `RoundScreen`) ; s'il y a une partie en pause, il la
   **reprend**. Repartir sur une partie neuve = chemin volontaire (annuler d'abord).
   *(résout N5.)*
3. **Build & déploiement = hors périmètre supervision** — une instance dédiée s'en
   charge. Le caveat EAS (N7) lui revient ; je ne le porte plus.
4. **Codename : Alpha 2 signature · version 0.2.** Alpha core (v0.1) est enterrée.
5. **Q2 · le son du final** *(instance mère)* — défaut d'étiquetage de la passe
   specs, pas une décision. L'asymétrie son/silence = la colonne rendue audible →
   **exigence sémantique du lot 2**, pas polish lot 4. À porter dans `specs-ecrans`
   à la consolidation. *(N2 résout.)*
6. **Q4 · « session »** *(instance mère)* — l'interdit porte sur le **copy visible
   uniquement** (l'user lit « Établi · 8 juin », jamais le mot) ; l'entité interne
   garde son nom (intention depuis `palmares.md`). Ligne de distinction à écrire.
7. **Q6 · EAS** *(instance mère)* — l'APK diffusé **embarque** `expo-audio` +
   `react-native-view-shot` (preuve d'usage, soirée 08/07 : anim 3 sons + partage
   « beaucoup utilisé »). Le « pas de build » du plan tient ; l'instance build
   re-confirmera. *(N7 / mon caveat tombe.)*
8. **La marque branlée — SIGNÉE : L'ENCOCHE.** `/` = petite · `//` = grosse. Le
   slash typographique, l'encoche sur la crosse : un fait d'armes gravé,
   comptabilisé, froid — « c'est fait ». Placement : cellule du donneur dans la
   feuille (`0 /`), cumulable sur la stèle ; rendu fin (taille, graisse) au lot
   concerné. **Rejets fermés — jamais reproposer :** 💪 (stock) · ‡ (croix de
   Lorraine) · † (silhouette de croix). **Source de vérité : `branlee.md` +
   `reshape.md` fourche 15** (gravée par l'instance mère) — ce rapport *pointe*, ne
   redouble pas. *(N4 résout : le risque « marque non signée » tombe.)*
9. **Split 3a/3b — reclassé.** Argument **bloquant évaporé** (marque signée → plus
   rien ne gate 3b) ; reste l'argument de **taille** (deux gates dans un lot) →
   split plus *nécessaire*, peut-être *utile*. **Eric tranche en amendant le plan**,
   pas avant. Accueil gardé au lot 3 (builds 1-2 internes, assumé) — signé.

**État net : plus aucune décision produit ne bloque le dégel.**

La **consolidation 0.2.2** (maisons existantes, **zéro fichier neuf**) est **gelée
jusqu'au go d'Eric**, à ma bascule. Items à threader chirurgicalement : N1 (brief
lot 0) · N2 (son sémantique → `specs-ecrans`) · N4 (risque marque tombe → plan) ·
N6 (le chiffre → `cas-reference-score:58`) · N7 (2 phrases EAS) · N8 (nommage +
`gameLoser` aux dérivés) · mineurs (table du plan + `navigation/types` · staleness
`reshape:250` · ligne « session » · resync fiches-sources · tag `soireeStorage`
sans « migration »). Docs touchés → updated + **bump 0.2.2**. Ce rapport passe
**consommé** quand tout est absorbé — trace, jamais 2ᵉ source de vérité.

**Séquence, chaque barreau au signal d'Eric :** bascule supervision → consolidation
0.2.2 → premier brief de lot.

---

## Correction de méthode *(12/07 — recadrage par l'instance de conception)*

La grille binaire « signé / intention » était trop grossière et m'a fait
**fabriquer un écart** sur la fin de partie. **Trois** statuts, pas deux — confondre
les deux derniers est la faute à ne pas commettre :

- **(a) signé + dessiné** — wireframe / planche Claude Design existe ;
- **(b) signé + rendu explicitement parqué** — comportement tranché, rendu fin
  *listé, daté, assumé*. **Une décision, pas un oubli.**
- **(c) vrai trou** — rien nulle part.

Règle : aucune conclusion « pas conçu » sans citer, **pour l'item**, `reshape` +
spec + plan. Flaguer le propre avec la même rigueur que l'écart, zéro récit de
démasquage.

**Reclassement — la fin de partie = (b), pas un trou :** forme **validée**
`reshape.md:323-329` → portée `specs-ecrans.md:100-102` → déclenchée plan lot 2 ;
rendu fin **parqué** `specs-ecrans.md:172`. Mon « une seule case de tableau » était
**faux** (je citais `ecrans/02-round.md:44` en ignorant `reshape.md` que j'avais
lu). **N2 dégradé** en simple rappel de traçabilité.

---

## 1 · Bloquant — le contrat du vrac n'existe pas *(lot 0)*

**Le trou qui arrête une instance à froid.** Le tag annonce « soirée-unique → LE
VRAC + **migration de clé** `gof:soiree` (schemaVersion) » (`soireeStorage.ts:2`),
mais deux choses manquent :

- **Il n'y a rien à migrer.** `appendToSoiree` + `saveSoiree`
  (`soireeStorage.ts:20-31`) n'écrivent qu'**une** soirée sous `gof:soiree` : un
  jour nouveau **écrase** l'objet. L'app n'a **jamais** stocké d'historique
  inter-sessions. Le vrac cible (`modele-donnees.md:73`, `specs-stats.md:20` —
  « toutes les GameArchive terminées, inter-sessions ») est donc un **comportement
  de persistance neuf**, pas une migration de clé. Le mot « migration » du tag
  induit en erreur.
- **La cible n'a pas de contrat.** `modele-donnees.md:73` **nomme** le vrac sans
  donner : sa **clé** de stockage · sa **forme** (`GameArchive[]` à plat vs
  regroupé par session) · le **`gofCount` par défaut** sur d'éventuelles archives
  legacy (le schéma actuel ne l'a pas — `model.ts:72-79`) · le mécanisme de
  **`schemaVersion`** (le plan le cite `:86`, mais l'objet actuel n'a aucun champ
  version → détection « par absence », non décrite).

**Ce que je fais avec (supervision)** : c'est de la **plomberie** — je le spécifie
dans le brief du lot 0 (clé `gof:vrac`, `GameArchive[]` à plat filtrable, champ
`schemaVersion`, garde de rejeu contre une archive malformée). **La seule question
qui touche ta carte** : on **abandonne** la soirée unique legacy (quasi vide) et le
vrac démarre neuf — OK ? (cf. §Questions).

---

## 2 · Notables — les pertes rattrapables et les doc-fixes

| # | Écart | Où | Geste |
|---|---|---|---|
| **N1** | **`resetGame` archive les parties interrompues** — contredit « l'annulée n'est jamais archivée » | `gameStore.ts:80-84` vs `modele-donnees.md:71` (+ `GameArchive` = « terminée **ou interrompue** » `model.ts:71`) | supprimer la branche ; annuler = `clearGame`, pas archive. Lot 0. |
| **N2** *(dégradé → traçabilité, cf. §Correction de méthode)* | **La fin de partie est un (b) : forme validée + rendu parqué.** Résidu minuscule : l'asymétrie du son (gloire avec bruit / honte en silence — « la colonne ») n'est pas **nommée** dans le parqué générique | forme validée `reshape.md:323-329` → `specs-ecrans.md:100-102` → plan lot 2 ; sémantique du son `reshape.md:350` vs parqué générique `specs-ecrans.md:172` | au dé-parquage (lot 2/4), porter l'asymétrie comme **sémantique**, pas déco. Rappel sur un (b), **pas un trou**. |
| **N3** | **Ouvrir une feuille passée depuis la stèle n'est porté par aucun lot** — l'affordance n'est pas énumérée, alors que le partage de partie passée la suppose | `ecrans/03-stele.md:65` + `specs-partage.md:16` (source) vs `specs-ecrans.md:130-137` (contenu stèle sans picker) ; gate lot 3 « une partie d'hier se rouvre » l'implique sans la nommer | nommer le sélecteur de parties dans le contenu de la stèle. Lot 3. |
| **N4** | **Le plan sous-porte le blocage de la marque branlée** : elle gate aussi le **partage** (feuille A **et** stèle B) ; et le **lot 2 n'est PAS bloqué** (la cérémonie tourne au **texte**, pas à la marque) | `plan:92-93` vs `specs-partage.md:20` + `specs-ecrans.md:99` | corriger le périmètre du risque dans le plan (le lecteur du plan seul croit l'inverse). |
| **N5** | **Gong pressé alors qu'une partie en pause vit** : transition non spécifiée (reprendre ? écraser ?) — un seul slot `gof:game` | `specs-ecrans.md:110-116` (reprendre/annuler, mais « jouer » muet) ; l'anti-enfermement (`reshape.md:221`) interdit d'écraser en silence | trancher la sémantique du tap Gong avec un en-cours vivant. Petite fourche UX. Lot 3. |
| **N6** | **`cas-reference-score.md:58` — l'exemple de franchissement à 100 se contredit** : « de **92** à 107 … 15 cartes = 60 pts, **47**+60=107 ». 92 vs 47 ; +15 vs 60. Le barème (`:38`) donne raison à 47 | intra-doc, `cas-reference-score.md:58` | fix : « de **47** à 107 ». Le doc-contrat des chiffres doit être juste. |
| **N7** | **Deux specs portent une phrase « build EAS » périmée** (les 4 deps natives sont **listées** dans `package.json` — `expo-audio`, `expo-sharing`, `react-native-svg`, `react-native-view-shot`) → le plan (`:14-16`, « déjà là, pas de build ») a raison **au niveau du manifeste**. **Caveat** : dep listée ≠ module embarqué dans le dev-client compilé — si l'APK alpha diffusé a été buildé **avant** l'ajout d'`expo-audio`/`view-shot`, le premier usage runtime (lot 2/3) force **quand même** un build EAS | `specs-anim-frime.md:55` + `specs-partage.md:25-26` (2 occurrences, pas 3) | corriger les 2 phrases ; **et confirmer que l'APK diffusé embarque bien ces modules** avant de tenir le « pas de build » pour acquis (cf. Q6). |
| **N8** | **Nommage du pôle perdant divergent + `gameLoser` absent de la liste dérivée** : `dernierManche` (`modele-donnees.md:55`) vs `roundLastPlace` (`logique-comptage.md:77`) = même entité, deux noms ; et `modele-donnees.md:48-59` n'a aucune entrée `gameLoser` (dont dépendent `specs-stats.md:36`, `logique:80`) | sémantique concordante partout, c'est l'inventaire/nommage qui drifte | aligner les noms + ajouter `gameLoser` à la liste dérivée. |

---

## 3 · Mineurs *(hygiène — non bloquants, à balayer au fil)*

- **`navigation/types.ts [R]`** est tagué mais **absent de la table du plan**
  (`plan:23-47`). Un fichier reshapé non inventorié. → l'ajouter à la table.
- **Fallback clavier natif** (état *nommer*) : si sur petit écran le clavier
  recouvre les pills, le comportement dégradé n'est pas spécifié
  (`specs-ecrans.md:56`). → à éprouver device tôt (déjà un risque nommé, `plan:88`).
- **Cérémonie branlée nommée « verrou »** dans la note QA (`plan:90-91`) alors que
  `branlee.md:43-44` insiste « ce n'est pas un garde-fou, c'est une cérémonie ». Le
  corps est bien porté (`specs-ecrans.md:97-99`), mais gare à un `Alert.confirm`
  banal au lot 2. → vigilance, pas doc-fix.
- **« session » : mot interdit** (`reshape.md:440`) vs **entité « Session »**
  adoptée (`modele-donnees.md:75`, `specs-partage.md:38`, `specs-ecrans.md:140`).
  Réconciliable si l'interdit ne porte que sur le **copy visible** (l'user voit
  « Établi · 8 juin », jamais « session »), pas sur le nom d'entité interne — mais
  aucun doc ne trace la distinction. → une ligne à écrire.
- **Staleness interne du hub** : `reshape.md:250-251` laisse « ouvert » le tap-saisie
  pill/ligne vierge, déjà tranché à `:428` (fourche 3). → nettoyer.
- **Fiches-sources non re-synchronisées** (ne remontent PAS au build, les specs ont
  corrigé) : `essence.md:104` dit encore branlée **binaire** (caduc, `branlee.md`
  a posé petite/grosse) ; `ecrans/01-accueil.md:26,42` affiche « revanche ? »
  (`copy-deck` l'a jeté, `specs-ecrans.md:109` applique « on rejoue ? »).

---

## 4 · Ce qui est PROPRE *(vérifié, fidèle — dit parce que vrai, pas pour meubler)*

**Fidélité à la signature** — 8 axes confrontés source ↔ spec, tous portés :
miroirs indépendants + monde étrange · plafond de la frime (GOF global-only) ·
crayon/gravé + la branlée qui pèse · POV preneur (FD-05) · object-first / défaut =
jouer / zéro baptême · identité = A (roster-scoped, aucune réconciliation) · le mot
jamais illustré (logo=jeu / mot=app) · variance & flop assumé · masquer sans jamais
détruire la mémoire.

**Cohérence logique/chiffres** — concordants à travers tous les docs : barème
(×1..×5, 16=80) + cas-limites · seuils branlée (30/45 inclusifs, total distribué,
donneur=joueur à 0) · départage vainqueur (L1 dernière manche, L2 **horaire**) &
perdant (L1 cumul, L2 **anti-horaire**), jamais croisés · `gofCount` (global,
stocké, rugissement non compté) · 3 issues (annulée jamais archivée) · keepAwake /
notif « donne sa carte » / undo minimal · titres miroirs · tap-saisie=pills /
renommer=appui long. Les faux-pièges (Seats dérivé, `directionOfPlay` vs départage,
drift FR/EN) sont pré-empétés dans les docs eux-mêmes.

**Tags & delta** — 26 fichiers tagués cohérents avec le plan ; le socle `domain/`
`[H]` intouché ; le corps encore alpha-core (`model.ts:38` = pas d'`annulee` ni
`gofCount`) → le travail des lots est **réel et non entamé**, comme attendu (dev gelé).

---

## 5 · Questions à porter *(à toi, ou à l'instance mère pour les « pourquoi »)*

1. **Vrac (§1)** : on abandonne la soirée legacy unique (quasi vide) et le vrac
   démarre neuf ? *(sinon je préserve la session courante dans la 1re écriture du
   vrac — trivial, mais dis-moi le geste voulu.)*
2. **Son du final (N2)** : je confirme — l'asymétrie son/silence est une **exigence
   du lot 2** (sémantique, la colonne), pas du polish lot 4 ? *(à l'instance mère si
   le pourquoi te manque : pourquoi l'avoir laissée dans « rendu fin des anims ».)*
3. **Gong en pause (N5)** : quand une partie est en pause et qu'on tape le Gong —
   **reprendre** l'en-cours, ou **démarrer neuf avec confirmation** d'écrasement ?
4. **« session » (mineur)** : l'interdit porte-t-il bien sur le seul **copy
   visible**, l'entité interne gardant le nom ?
5. **La marque branlée** *(le passif connu)* : reste le seul blocage produit du
   lot 3 (rendu feuille/stèle **et** partage, cf. N4). Une décision à toi, pas du dev.
6. **Build EAS (N7)** : l'APK alpha déjà diffusé embarque-t-il bien `expo-audio` et
   `react-native-view-shot` ? Si oui, le « pas de build » du plan tient ; sinon,
   les lots 2/3 grouperont un build. *(Vérifiable côté build/EAS, pas une fourche.)*

---

## 6 · Mon avis sur l'ordre des lots

**La colonne vertébrale 0 → 1 → 2 → 3 → 4 est saine, je la garde.** Domaine pur
d'abord (comme alpha-core), la scène, la voix, le gravé, le polish. Aucune
dépendance cachée inversée détectée. Deux réserves, présentées comme **fourches** :

**a) Le lot 3 porte trop.** Il empile : nav hub-and-spoke (`App.tsx` +
`navigation/types.ts`) · l'accueil (disque-GANG, tes gangs, 3 états, masquer/
démasquer) · la stèle (2 trônes, détail, GOF, **+ le picker de feuille passée N3**)
· la feuille (modale, crayon/gravé) · le renommage · le partage des **deux**
artefacts. C'est deux gates dans un lot. Je proposerais de le **fendre** :

- **3a — la nav + l'accueil** : le moyeu debout, l'app navigable. *Ne dépend pas de
  la marque branlée.*
- **3b — la stèle + la feuille + le partage** : le rendu du gravé. *Gate dur
  amont : la marque branlée signée (N4).*

Le split n'est pas cosmétique : il **découple 3a de la marque non signée**. Tant que
tu n'as pas tranché la marque, 3a peut avancer, 3b attend — au lieu de bloquer tout
le lot 3.

**b) L'accueil (object-first, P1) arrive tard.** Différé au lot 3, donc les lots 1-2
tournent sur l'entrée scaffold (splash → Round). C'est bon pour du dev interne, mais
**l'app ne *ressemble* à GANG qu'au lot 3**. Je penche pour **garder** l'accueil au
lot 3 (il n'a de sens qu'avec le vrac + la stèle derrière), en l'assumant : les
builds des lots 1-2 sont internes, pas montrables. Si tu veux la porte plus tôt, on
en discute — c'est ta carte.

---

*Rendu du temps 1. Rien n'est implémenté, rien n'est modifié dans les docs — ce
rapport pointe, il ne corrige pas. La bascule en supervision (temps 2) attend ta
déclaration.*
