---
title: 'GANG — Écran : l''accueil (la porte)'
created: '2026-07-10'
updated: '2026-07-10'
version: 0.2.1
status: draft
type: fiche-ecran
---

# GANG — L'accueil (la porte)

> Première fiche-écran. Suit `reshape.md` §2 : forme depuis le pilier
> **d'abord**, code tagué **ensuite**. La porte de GANG **n'existe pas** dans le
> code (aujourd'hui : `SplashScreen`, 2 logos passifs 1400 ms → `Setup`).

---

## Rôle signature

L'accueil porte deux piliers :

- **Pilier 5 — on ne rejoint pas un gang, on le mérite.** Le défaut, c'est
  **jouer** ; la profondeur (l'étagère des gangs) s'active en rejouant. Zéro
  question difficile à l'entrée — pas de péage.
- **Pilier 2 — l'app gueule, la table joue** (le germe). **Object-first** :
  l'app ouvre sur son **objet-voix**, le disque signature, pas sur un menu ni un
  formulaire. La porte *est* l'identité, pas une antichambre.

Ce que la porte doit **proclamer** en une seconde, sans notice : *« ici, on
joue, et ça a une gueule. »* Ce qu'elle doit **refuser** : accueillir par une
tâche administrative (nommer 4 inconnus avant d'avoir rien vu).

---

## La forme

Wireframe (portrait, appareil unique sur la table). Tags : **[H]** hérité ·
**[R]** reshapé · **[N]** neuf.

```
┌───────────────────────────────┐
│ ▁▁▁▁▁ hub bannière ▁▁▁▁▁▁▁▁▁ │  [N] la BANNIÈRE — porte tous les messages
│  « revanche ? » · standing    │       d'info (invite, standing, reprise).
│                               │       Pilier 3. Neuve, PARTAGÉE entre écrans.
│            G A N G            │  [R] le wordmark — le mot, jamais illustré
│                               │       (pilier 1). Remplace les 2 logos empilés.
│          ╭─────────╮          │
│          │  GONG   │          │  [R] l'objet-voix (nommé, signé — cf.
│          │  ⬤ GOF  │          │       reshape.md §3). Tap = prendre la table +
│          ╰─────────╯          │       rugir (pilier 2). AUCUN texte d'état.
│      (cadre = à décider)      │  ⚠ le « disque » autour = LAYOUT différé.
│                               │
│   ───────  le gang  ───────   │  [N] l'ÉTAGÈRE DES GANGS. Le lieu de retour
│   ✌️ Établi        🐌 Marc    │       (lève le « flow enfermant »). Les rosters
│   [·· gang ··] [+ nouveau]    │       joués ; tap = revanche (roar). « + » =
│                               │       nouveau roster. Germe palier 1, plein
└───────────────────────────────┘       palier 2. Voir §palier.
```

**L'objet central = le `Gong`** (nommé, signé — cf. `reshape.md` §3). L'ancien
`Hub` se scinde : le **Gong** porte l'action + le rugissement (pilier 2), le
**hub bannière** porte les messages + le standing (pilier 3). Le Gong rugit, la
bannière proclame.

**⚠ Le « disque » de l'ascii est un placeholder de LAYOUT, pas une décision.**
Le disque est l'*interstice des quadrants* (RoundScreen). Savoir si l'accueil a
des quadrants — donc un disque — ou un autre cadre pour le Gong = **différé aux
wireframes (étape 5)**, pas tranché ici. Cette fiche acte l'**objet** (le Gong)
et son **rôle**, jamais son cadre visuel.

**Ce que le reshape remplace (pas un patch) :** le `SplashScreen` actuel est un
**délai passif** (2 logos, 1400 ms, aucun geste, aucune voix) qui *pousse* vers
`Setup`. La porte le **remplace** par un écran **actif et permanent** : on n'y
« passe » pas, on y **revient**. Ce n'est pas un splash accéléré — c'est un autre
objet.

---

## Les états

**Principe unificateur du rugissement** (résout la fourche tether du handoff §4
vs `frime.md`) : *le rugissement marque un **gang complet qui prend la table**.*
Jamais gratuit — donc toujours *tethered* à un vrai gang, jamais à un carré
fantôme. Le déclencheur est stable (« un gang complet entre en jeu »), atteint
par deux chemins ; seul le **moment** change selon le cas.

| État | Bannière dit | Disque | Rugissement |
|---|---|---|---|
| **vierge / nouveau roster** | « nouveau gang ? » | → la table, sièges à nommer | **APRÈS** les prénoms — le gang *naît*, puis rugit → manche 1 |
| **revanche / gang connu** | « revanche ? » + standing | tap | **immédiat** — le gang se reforme (connu), rugit, table pré-remplie |
| **reprise / partie en cours** | « partie en cours » | reprendre | **aucun** — rien ne se forme, on continue (`status === 'en-cours'`, ≥ 1 manche) |

**Conséquence pilier 5 :** les *mêmes 4 qui reviennent* → la **revanche est le
chemin rapide et par défaut** (roar immédiat) ; le **nouveau roster est la porte
de côté** (« + » sur l'étagère). L'app récompense le retour sans péage.

Le **crayon vs gravé** (pilier 4) ne vit pas ici — l'accueil est un lieu de
seuil, pas de mémoire. Il *pointe* vers la mémoire (l'étagère), il ne la grave
pas.

---

## Flow *(la signature déplace le chemin → section active)*

```
AVANT   Splash ─1400ms─▶ Setup (nommer 4 = péage) ─▶ Round
                                                       │
                                          sortie = alert « Rejouer avec qui ? »
                                                   (flow enfermant)

APRÈS   Accueil (porte permanente)
          │
          ├─ nouveau roster ─▶ la table (nommer inline, pas un péage)
          │                         │ gang complet
          │                         ▼
          │                    🔊 rugissement ─▶ Round
          │
          ├─ revanche (tap disque / étagère) ─▶ 🔊 rugissement ─▶ Round (pré-rempli)
          │
          └─ reprise (partie en cours) ─▶ Round (on continue, pas de roar)
                    ▲                                    │
                    │        retour par l'ÉTAGÈRE ◀──────┘
                    └────  (le lieu de retour lève l'enfermement)  ─┘
```

Le rugissement se place **selon le cas** (§états) : après les prénoms pour un
roster neuf, immédiat pour une revanche — parce qu'il marque toujours *un gang
complet qui entre*, jamais le tap seul.

Deux changements de parcours que la signature impose :
1. **L'entrée** : un délai passif devient une **porte actionnable et permanente**.
2. **La sortie** : l'alert *« Rejouer avec qui ? »* (`RoundScreen` l.62-79, le flow
   enfermant) est **remplacée** par le retour à la porte + l'étagère — on ne
   *choisit pas dans une modale*, on **revient au lieu**.

*Le « nommer inline, pas un péage »* touche l'écran **Setup** → sa mécanique est
le sujet de sa **propre fiche** (`02-setup.md`, à venir), pas de celle-ci. Ici on
acte seulement que la porte n'ouvre plus sur un formulaire.

---

## Pointeurs (ne pas remplir ici)

**Voix** → à verser dans `copy-deck.md`. Toutes ces chaînes vivent dans la
**bannière** (register info), pas sur le disque :
- invite vierge : *« nouveau gang ? »* (candidat) ;
- invite revanche : *« revanche ? »* (candidat) ;
- reprise : *« partie en cours »* (candidat).
*Registre : permanent · calme pour la bannière ; le rugissement porte le fort.*

**Composants** (tombe du dessin) — l'ancien `Hub` se **scinde** :
- **`Gong`** : l'objet-voix (nommé, signé — cf. `reshape.md` §3). Renomme l'ancien
  `Hub`. Tap → prendre la table + rugir. N'hérite **pas** du « pas de SVG, pas
  d'emoji » (`Hub.tsx` l.5, principe contraire — l'asset GOF entre). *Le
  « disque » = son cadre de layout sur RoundScreen, pas le composant.*
- **Hub bannière** : composant **neuf** (`Banner` ?), **partagé** entre écrans
  (porte le standing « {prénom} mène » sur `Round` aussi). Son spec plein revient
  en partie à la fiche `Round` — ici on n'acte que son **rôle** et sa présence.
- **Étagère des gangs** : composant **neuf** (`GangShelf` ?). Réutilise
  `Palmares` en germe au palier 1.
- **Wordmark** : composant **neuf** léger (`Wordmark`), typographique, jamais
  illustré.

**Assets** (délégués, mon-arbre — Eric intègre) : l'asset du disque (GOF /
dragon), le rugissement (déjà 3 sons côté frime).

---

## Dépendance de palier (honnête)

L'**étagère des gangs** n'est *pleine* qu'au **palier 2 (DB)** : le gang =
roster inter-sessions, qui exige la persistance (cf. `grille.md`, brique *écrire
l'histoire*). Au **palier 1**, la porte existe mais l'étagère est un **germe**
(soirée du jour via `soireeStorage`, ou message d'amorce). La porte et le
disque-rugissement, eux, sont **livrables au palier 1** — ils ne dépendent pas
de la DB.

---

## Reste ouvert sur cet écran

- **placement de la bannière** sur l'accueil : au-dessus du wordmark, ou le
  wordmark *dans* la bannière ? (dessin fin) ;
- **reprise** : le disque devient « reprendre », ou la bannière seule porte
  l'action et le disque s'estompe ? (dessin fin) ;
- le sort du **dragon** (manifeste : *il reste*) vs pilier 1 (*le mot dit tout*) —
  cohabitent-ils sur le disque ? (question d'asset, déléguée).

*Résolu le 10/07 :* la fourche du **rugissement** (tether) — par le principe
« un gang complet prend la table » (§états). Le **disque ≠ Hub** — scission en
disque + hub bannière (§forme, §composants).
