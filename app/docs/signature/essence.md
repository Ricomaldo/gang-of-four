---
title: 'GANG — Signature'
created: '2026-07-10'
updated: '2026-07-10'
version: 0.2.1
status: active
type: signature
---

# GANG — Signature

> Le **vrai manifeste de l'app**. Pas les principes d'engagement du dev — ceux-là
> vivent dans `_engagement/` (le liminaire à `mon-arbre`, le « oui » d'Eric).
> Ici, c'est l'**identité de l'objet lui-même** : ce dont les specs découlent,
> jamais l'inverse. Forgé dans la nuit du 9 au 10 juillet 2026, au lendemain de
> la première vraie partie à 4.

## Le nom

**GANG.** Un mot, trois sens :

- le nom du jeu (sur la boîte) ;
- la combinaison la plus forte, le carré — *avoir un gang* : jubilation
  silencieuse, puis scandée quand les cartes tombent ;
- le roster : 4 joueurs qui s'affrontent, pas un de moins, pas un de plus.

L'identité tient dans le mot. On ne l'illustre jamais.

## Pour qui — le parti pris

GANG s'adresse à ceux qui ont déjà usé toutes les fiches de score de la boîte et
qui veulent **glorifier leurs parties.** Pas au joueur d'un soir qui n'a besoin
que d'un crayon et d'un bout de papier — lui n'a pas besoin de l'app, et il
n'aura pas l'anim. Renoncer à lui, c'est toucher les autres plus fort.

L'app a un avis. Elle est **opinionated sur l'événement** (la branlée compte,
elle la proclame) et **agnostique sur la morale** (gloire ou hantise, c'est le
siège du joueur, pas l'avis de l'app). Un parti pris assumé, jamais un menu de
réglages.

## La colonne

## Une grande gueule qui n'oublie rien.

Bruyante dans l'instant, impitoyable dans la mémoire. Tout le reste en découle.

## Les cinq piliers

### 1. Le mot dit tout.

GANG, c'est la boîte, le carré et les 4 — trois sens dans un mot. La hiérarchie,
la bande, le coup gagnant sont *dits*, jamais dessinés.

→ **Principe UI —** on n'illustre jamais ce que le mot porte. Le capo se sent
dans le vocabulaire et le ton ; aucun feutre, aucun « Parrain » à l'écran. Le
jour où on l'illustre, on l'a perdu.

### 2. L'app gueule, la table joue.

Le verbe est dans la vraie vie. L'app est le carnet sur le rebord qui fait *écho*
à la scansion — elle amplifie le cri du carré posé, elle ne le remplace pas.

→ **Principe UI —** chaque animation répond à un geste réel. GANG ne s'anime
jamais toute seule pour faire joli. Torse bombé, mais en écho.

### 3. Ici, les points sont une honte.

Le but, c'est zéro. La voix glorifie le veinard, chambre le loser (💩, jamais
radié) — et elle parle à la table, nommément : *« {prénom} mène. »*

→ **Principe UI —** aucun libellé neutre. Un carnet ordinaire additionne ; GANG
*proclame*. Voix à la 3ᵉ personne, adressée au collectif, torse bombé.

### 4. Tout s'oublie, sauf la branlée.

Le trône est éjectable, rien n'est acquis, le chemin est offert au loser. Une
seule chose reste gravée : la branlée — dans la grille, dans le screenshot.

→ **Principe UI —** deux registres. L'instant se pardonne (chaud, réversible :
undo, revanche). La mémoire se grave (froid, définitif : la branlée ne s'efface
pas). L'UI est clémente au présent, impitoyable au souvenir.

### 5. On ne rejoint pas un gang — on le mérite.

Le gang, c'est les mêmes 4 qui reviennent. La revanche fait le gang ; le palmarès
est la récompense silencieuse de rejouer. Pas de baptême, pas de formulaire.

→ **Principe UI —** le défaut, c'est jouer ; la profondeur s'active en rejouant.
Zéro question difficile à l'entrée — l'engagement se lit dans le geste (la
revanche), jamais dans un réglage.

## Ce qui reste aux specs

Les nombres et les écrans ne sont pas ici. Ce document tient l'**identité** ; les
specs (`specs-techniques`, `modele-donnees`…) en découlent. Ancrages déjà signés
à traduire, en vrac :

- la branlée est **binaire** (branlée ou rien — pas de petite/grosse), déclenchée
  dès **~30 points** cumulés sur la manche, seuil ajustable ;
- **💩 = partie perdue** (ex-❌) ; le **🐌** reste le looser du gang (celui qui
  cumule le plus de 💩) ;
- le **gang = le roster** (mêmes 4 → même palmarès, inter-parties *et*
  inter-sessions ; un joueur change → autre gang) ;
- la **session** (temps + lieu, mot interdit en UI) titre la feuille partagée —
  *« Établi · 8 juin »* — le lieu est optionnel, au service du récit ;
- la **revanche** fait naître le gang et son palmarès (dès la 2ᵉ partie) ;
- l'app se **renomme GANG**.
