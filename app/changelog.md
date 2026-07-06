---
created: '2026-07-05'
status: active
title: Changelog — Gang of Four
---

# Changelog — Gang of Four

Changements par version (produit). Le récit de dev, lui, vit dans `docs/devlogs/`.
Format : plus récent en haut.

## 0.1.0 — en cours

### Ajouté
- Scaffold app **RN / Expo managed** (SDK 57, TS, React Navigation, Zustand) — *scaffold init, 4 juillet*.
- Domaine du score (pur, testé) : barème, cumul, arrêt à 100, `roundWinner`, `directionOfPlay`, départage 2 niveaux.
- Store Zustand (brut seul : prénoms, manches, statut) ; scores/cumuls/vainqueur toujours dérivés.
- Écrans : démarrage-manche (grille 2×2), saisie de fin de manche, grille de score, splash.
- **Build Android EAS** (APK preview, `distribution: internal`) — première livraison à un tiers.
- **Splash** `game-box` (expo-splash-screen).
- **Garde de saisie** : une manche sans joueur à 0 est refusée (`isValidRoundInput`).

_Passe palier 01 (handoff `docs/2026-07-06-passe-palier-01.md`) :_

- **Soirée persistante** (AsyncStorage) : les parties du jour s'archivent (fin à 100 ou nouvelle partie) et se regroupent par soirée, avec tolérance nuit (partie finie avant 5h = veille). Navigation entre parties dans la grille.
- **Qui-donne-à-qui** : en début de manche, notif « gagnant manche préc. » et « donne / a donné sa meilleure carte » (avec coche), posées dans les pills.
- **Manches gagnées** : dérivé `manchesGagnees` + départage maison du dernier de manche (`roundLastPlace`, 3 niveaux : max cartes → cumul → proximité anti-horaire).
- **Écran de setup dédié** (`SetupScreen`) : saisie des 4 prénoms sur la grille 2×2, en forme compacte qui laisse la place au clavier ; Hub « QUI JOUE ? » → « READY » (seul le Hub valide et lance la partie).
- **Layout aligné sur le proto Claude Design (5a)** : grille 2×2 de cadrans à coins ronds, disque central (Hub) à l'intersection portant l'arc du sens de jeu, pills à taille fixe (3 chiffres + espace notif), notifs orientées vers le centre.
- **Grille de score enrichie** : cellules en cumul, toggle « détails » révélant le score de chaque manche (+N), palmarès (manches gagnées) en panneau séparé sous le carnet, grille de tableau complète (lignes horizontales + verticales), titre « Soirée du … ».
- **Easter egg Gang of Four** : appui long sur une pill (déclencheur seul, aucun indicateur au repos).
- **Nouvelle partie** : choix « mêmes joueurs » (rejoue avec les prénoms) ou « nouveaux joueurs » (retour setup).
- **Transitions en fondu** entre Splash / Setup / Manche (écrans à layout partagé, plutôt qu'un push latéral).

_2e retour Damien (FD-07/09/11/12) :_

- **Sens de jeu — 4 flèches** entre les joueurs, autour du hub, tournant dans le sens du cycle de table (remplace l'arc central, jugé ambigu par Damien — FD-07).
- **Fin de partie → feuille de score** : bascule automatique sur le carnet à la fin (l'accès aux stats ne se perd plus — FD-12) ; feuille ré-accessible depuis la carte vainqueur.

### Modifié
- **Ordre tour de table** : colonnes du carnet et sélecteurs de saisie présentés dans l'ordre des sièges (`SEAT_ORDER`, dérivé de `TABLE_SEATS`) plutôt que l'ordre `PlayerId` — cohérence saisie ↔ carnet visible pendant la partie.

### Ossature (refactor)
- Composants nommés et attrapables pour le polish : `Hub`, `Quadrant`, `QuadrantGrid`, `PlayerPill`, `ScoreCarnet`, `Palmares`.
- `CenterDisc` → `Hub` (composant-pivot à états).
- `modele-donnees.md` v0.5 : `GameArchive`, `Soiree`, persistance locale.

### Corrigé
- **BUG-01** : démarrage figé dès le 4e prénom → prénoms éditables jusqu'à la 1re manche ; disque central « point d'info d'état » (`START GAME ?` / `FIN DE MANCHE`).
- **BUG-02** : manche sans gagnant acceptée → garde de saisie (voir Ajouté). **Confirmé à l'usage** par Damien (FD-11).
- **FD-09** : flèche de sens du carnet inversée (manche 1 rendait `←` au lieu de `→`) → glyphe corrigé dans `ScoreCarnet`. Domaine `directionOfPlay` déjà juste, aligné sur la feuille officielle (manche 1 = `→`).

### Tests
- 49 tests verts (barème, cumul, arrêt à 100, départage bout-en-bout, garde de saisie ; soirée : `roundLastPlace`, `manchesGagnees`, tolérance nuit, archivage).
