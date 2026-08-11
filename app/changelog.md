---
created: '2026-07-05'
status: active
title: Changelog — Gang of Four
---

# Changelog — Gang of Four

Changements par version (produit). Le récit de dev, lui, vit dans `docs/devlogs/`.
Format : plus récent en haut.

## 0.2.0 — alpha-signature (le PLACARD)

L'ère **signature** : l'app prend son identité visuelle (« le placard ») et devient **GANG**. Reshape des 5 écrans, sons, et une passe de polish confrontée sur device.

### Identité — le placard
- **Fontes d'affiche chargées au boot** : Anton (l'affiche), IBM Plex Mono (l'appareil), Caveat (le crayon) — `expo-font`, `App.tsx`.
- **Palette placard** (`theme/tokens.ts`) : noir/crème pour la mémoire, chauds (rouge/orangé/ambre/brique) réservés au **vivant** (le Round). Règle d'or du chaud.
- **Restyle des 5 écrans** (Accueil, Round, Stèle, Feuille, Annonce) + composants (Cartouche, GangList, Gong, PlayerPill, Quadrant, Feuille).
- **Marque branlée `‡` / `‡‡`** (supersede l'encoche `/` `//`).
- **Logo GANG en asset** (PNG rendu Claude Design : disque encre + double anneau) sur l'accueil — fin du texte-dans-cercle qui rognait. **Famille d'icônes app** posée (icon, adaptive Android, favicon, splash).

### Sons
- **4 sons de gong** (pool aléatoire sans répétition immédiate) au tap du Gong en jeu.
- **Son d'ouverture** au démarrage délibéré d'une partie (après la saisie des prénoms).
- Son de « gloire » de l'annonce finale débranché (un asset dédié viendra) ; la honte reste silencieuse.

### Accueil
- Disque-GANG tappable (nouveau gang) + **ombre portée ronde** + libellé d'aide **« TAP → NOUVEAU GANG »**.
- Section **« MES GANGS »** : full-bleed, titre centré entre 2 filets, **hauteur fixe 4 slots** (lignes vides si < 4, scroll vertical si > 4), ancrée en bas ; noms longs en **défilement horizontal** (fin de la troncature), dernier gang en bande inversée (revanche).

### Round
- **« ← » persistant** en haut à gauche (retour accueil dans tous les états — fin du tunnel jouer/saisir).
- **Cartouche** : « Qui joue ? » en saisie des prénoms → « {meneur} mène » en jeu → **« Saisie de la manche »** pendant la saisie, avec la ligne de guidage **« Combien de cartes restantes en main ? »**.
- **Meneur** = cellule **orange** (rouge abandonné), ◀ retiré (le fond suffit), fond masqué pendant la saisie (pas de concurrence avec le feedback orange).
- **Passe de carte** en une ligne unique sous le cartouche (remplace les notifs par-pill masquées par le Gong) ; **▲** conservé sur le gagnant de la manche préc.
- **Zone du bas (jeu)** : la boîte du jeu en **filigrane** + bouton **« la feuille de scores »** ; l'aperçu chiffré (obscur, redondant avec les totaux des pills) retiré.
- **Flèche du sens de jeu** en overlay flottant sous les quadrants (plus de bande dédiée) ; prénoms des quadrants agrandis (lisibilité).

### Feuille
- **Colonne sens de jeu** de retour en 1ʳᵉ colonne (`→`/`←` par manche, mapping FD-09), remplace le « Mx » ; entête `↔`.
- **Filtre « détails »** : cumul simple par défaut, détail par manche + branlées derrière le filtre ; le partage suit le mode affiché.
- **Correction de la dernière manche migrée DANS la feuille** : ligne crayon (dernière manche vivante) tappable → rouvre la saisie pré-remplie (signal store `correctRequest`).
- **Date + lieu en tête de grille** (dans la zone capturée au partage), lieu éditable inline ; titre modale « Établi · date » → **« la feuille »** ; ligne total sans label « TOT » ; min. 4 lignes + 1 vide tant que la partie vit.

### Stèle
- Titre **« Palmarès du gang »** (roster répété retiré).
- **Colonne branlée (‡) retirée** du détail (P▲ P▼ M▲ M▼) ; **mention GOF retirée** ; champion **« N partie(s) pliée(s) »** ; **« il y a … »** sur LES PARTIES (sauf aujourd'hui/hier) + lieu affiché, partie la plus récente surlignée ; ☞ réservé au trône.
- Bumps lisibilité (détail/entêtes/labels/retour).

### Modèle / technique
- `lieu?: string` sur `Game` + `GameArchive` (+ action `setLieu`, scellé au vrac) ; signal transitoire `correctRequest`.
- Dépendances alignées sur **Expo SDK 57** (`expo install --check`).
- **107 tests verts, tsc clean.**

## 0.1.0 — alpha-core (diffusée)

### Ajouté
- Scaffold app **RN / Expo managed** (SDK 57, TS, React Navigation, Zustand) — *scaffold init, 4 juillet*.
- Domaine du score (pur, testé) : barème, cumul, arrêt à 100, `roundWinner`, `directionOfPlay`, départage 2 niveaux.
- Store Zustand (brut seul : prénoms, manches, statut) ; scores/cumuls/vainqueur toujours dérivés.
- Écrans : démarrage-manche (grille 2×2), saisie de fin de manche, grille de score, splash.
- **Build Android EAS** (APK preview, `distribution: internal`) — première livraison à un tiers.
- **Splash** `game-box` (expo-splash-screen).
- **Garde de saisie** : une manche sans joueur à 0 est refusée (`isValidRoundInput`).

_Passe palier 01 (handoff `docs/journal/2026-07-06-passe-palier-01.md`) :_

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

_Axe frime & stats collectives :_

- **Animation « Gang of Four »** : overlay plein écran (scale overshoot, jitter de rotation, respiration), fond spectre criard, son aléatoire parmi 3, déclenchée à l'appui long sur une pill. Lecture via `expo-audio`.
- **Stats collectives de la soirée** : `Palmares` promu en **scoreboard soirée** — 6 stats par prénom (⭐️ manches gagnées, 💥 manches perdues, 🏆 parties gagnées, ❌ parties perdues, ✌️ Leader, 🐌 Looser), agrégées sur les seules parties terminées, affichées au Setup et sous le carnet. **Base du relai API** semée : `id` de partie (uuid) + `leagueId` (`proto-ligue`).
- **Partage de la feuille** : capture image du carnet affiché (WYSIWYG, respecte le toggle détails) → partage natif (`react-native-view-shot` + `expo-sharing`).

_Passe review pré-soirée (correctifs + polish + nom) :_

- **Persistance de la partie en cours** : la partie vive est sauvegardée **à chaque manche** (`gof:game`, AsyncStorage) et **reprise au lancement** (Splash → Round si une partie est engagée, sinon Setup). Une app tuée (SMS, éviction OS) ne perd plus les scores — seule une saisie de manche non validée est volatile.
- **Nom d'app** : « Gang of Four » → **« GoF Companion »** (compteur d'accompagnement, pas le jeu ; prudence marque déposée en vue du store).

### Modifié
- **Ordre tour de table** : colonnes du carnet et sélecteurs de saisie présentés dans l'ordre des sièges (`SEAT_ORDER`, dérivé de `TABLE_SEATS`) plutôt que l'ordre `PlayerId` — cohérence saisie ↔ carnet visible pendant la partie.
- **Équilibrage RoundScreen** : cadrans recentrés (`align="center"`) — les 4 pills se resserrent autour du hub, fin du rendu « 2 contre 2 » où le joueur d'en face paraissait trop loin.
- **Flèche de sens franche** : hampe + tête (formes CSS), gris `bordureForte`, posée sous les pills du bas — remplace le triangle seul, jugé timide.
- **Affordance carnet** : mot « carnet » seul (plus de flèche/poignée) pour ne plus concurrencer la flèche de sens.
- **Défaut de saisie de fin de manche** : toujours le joueur le plus à gauche (`SEAT_ORDER[0]`), départ prévisible — remplace le défaut « gagnant précédent », jugé arbitraire.
- **Splash unique** : image retirée du splash natif (fond crème uni) — fin du double splash natif + JS.

### Ossature (refactor)
- Composants nommés et attrapables pour le polish : `Hub`, `Quadrant`, `QuadrantGrid`, `PlayerPill`, `ScoreCarnet`, `Palmares`.
- `CenterDisc` → `Hub` (composant-pivot à états).
- `modele-donnees.md` v0.5 : `GameArchive`, `Soiree`, persistance locale.
- `TotRow` extrait de `ScoreCarnet` (composant exporté, prop `hideTot` disponible).

### Corrigé
- **BUG-01** : démarrage figé dès le 4e prénom → prénoms éditables jusqu'à la 1re manche ; disque central « point d'info d'état » (`START GAME ?` / `FIN DE MANCHE`).
- **BUG-02** : manche sans gagnant acceptée → garde de saisie (voir Ajouté). **Confirmé à l'usage** par Damien (FD-11).
- **FD-09** : flèche de sens du carnet inversée (manche 1 rendait `←` au lieu de `→`) → glyphe corrigé dans `ScoreCarnet`. Domaine `directionOfPlay` déjà juste, aligné sur la feuille officielle (manche 1 = `→`).
- **BUG-03 à BUG-06** (`bugs.md`) — passe review pré-soirée :
  - **Pills sous le clavier (Setup)** : `gridZone` capé à 52 % → les pills du bas restent au-dessus du clavier en saisie.
  - **Carnet dès la manche 0** : affordance carnet toujours visible + ligne vide placeholder dans `ScoreCarnet` → consultation immédiate de la partie précédente.
  - **Hub état « invite »** : le label tombait sur « FIN DE MANCHE » → branche « QUI JOUE ? » ; l'estompage `discDisabled` n'affecte plus l'invite (fond transparent).
  - **Doublons de prénoms** : validation `isDuplicate` (bordure terracotta sur la pill, `namesReady` bloqué).
  - **Flèche `dirCell` manquante** sur la ligne 0-manche du carnet → `directionOfPlay(1)`.
  - **TOT invisible sur longue partie** : `ScoreGrid` scrolle en fin de contenu (`scrollToEnd`).
  - **Swipe changement de partie** : `panHandlers` étendus au carnet **et** au palmarès.

### Tests
- **62 tests verts** — ajout des suites `stats` (6 stats collectives, agrégation par prénom, parties terminées) et `gofSound`, en plus du barème / cumul / arrêt à 100 / départage / garde de saisie / soirée.
