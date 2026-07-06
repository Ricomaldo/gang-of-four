---
title: 'Handoff — Passe de dev · Palier 1'
created: '2026-07-06'
updated: '2026-07-06'
version: 0.1.0
status: active
type: handoff-passe
---

# Handoff — Passe de dev · Palier 1

**Pour :** l'instance d'implémentation (à froid).
**Deadline dure :** partie IRL **mercredi 8/07 20h**. **Budget réel :** ~8h sur 2 jours (5 % relatif → 25 % ces deux jours).
**Vrai jalon derrière la passe :** *Tenir la partie* — une vraie partie à 4 jusqu'à 100 mercredi. Ce qui ne sert pas ça mercredi n'est pas dans cette passe.

Aligné avec Eric le 2026-07-06. Ce fichier est le **périmètre gelé** de la passe ; il n'invente rien au-delà.

## Point de départ (déjà en place — ne pas repartir de zéro)

- **Écrans** (`app/src/screens/`) : `SplashScreen`, `RoundScreen`, `ScoreEntryScreen`, `ScoreGridScreen`.
- **Composants** (`app/src/components/`) : `CenterDisc`, `NumPad`, `PlayerPill`, `SeatSelectors`.
- **Domaine** (`app/src/domain/`, pur et testé) : `scoring`, `winner`, `direction`, `model`.
- **Store** : `gameStore` (Zustand). **Tests** : `scoring.test`, `gameStore.test`.

La passe **finit et étend** cet existant. Premier geste attendu : lire `ScoreGridScreen.tsx` et `gameStore.ts` pour **mesurer le delta réel** avant de coder.

## Périmètre — 5 chantiers

### 1. Grille au niveau du handoff design
`ScoreGridScreen` existe → l'aligner sur le paquet Claude Design (`app/docs/claude_design/import/`, pistes `4b`/`5b`). Colonnes = joueurs (pastille + initiale), lignes = manches, colonne gauche = sens de jeu alterné, ligne TOTAL = cumul, cellule à 0 = `roundWinner`, en-tête « 1er à 100 déclenche la fin ». Pas de barème affiché. **Consultation seule** — le partage est palier 2.

### 2. Qui-donne-à-qui (FD-03) — dans le quadrant
Rappel visuel dans le quadrant joueur, **visible pendant le jeu** : qui était 1er / dernier à la manche précédente → qui donne à qui. **Dérivé** : 1er = `roundWinner` (0 carte) ; dernier = plus de cartes restantes à la manche précédente — *définition « dernier » à confirmer avec Eric si le cas d'égalité se pose.* **Jamais** de valeur de carte (l'app ne modélise pas les cartes). ⚠️ Amende le quadrant « une pill et rien d'autre » du handoff — **voulu**.

### 3. Manches gagnées — dans la grille
Stat de la grille (pas le quadrant), **dérivée** du compte de `roundWinner` par joueur. (Eric avait dit « grille ou palmarès » ; comme le palmarès n'est **pas** une surface de stats mais l'accès aux grilles passées, la grille est le seul hôte possible — d'où grille.)

### 4. Soirée — rétention + navigation carnet
- **Entité `Soirée`** = ensemble de `Partie` regroupées **par date**, avec **tolérance nuit** (une partie finie à 2h compte pour la soirée de la veille). Le « 3 parties » évoqué = **indicatif de test**, pas une constante.
- **Persistance locale** (AsyncStorage / équivalent RN) — offline-first, **préfigure la sync DB du palier 2** (≠ DB externe, qui reste palier 2). ⚠️ Amende le « zéro persistance » figé du handoff / `modele-donnees` — **voulu**.
- **Accès aux parties précédentes** : rouvrir leur grille par **bottom-slide successif** (métaphore carnet papier, tourner les pages).
- **Point de bascule** (à pinner en tête du plan) : une `Partie` rejoint la `Soirée` **à la fin de partie (game-over) ou au lancement d'une nouvelle partie** — c'est là que le flux « reset / nouvelle partie » (avec son `confirm`) archive la partie courante dans la soirée du jour et en démarre une fraîche.
- **Pas** d'agrégat de stats, **pas** de palmarès all-time.

### 5. Easter-egg Gang of Four — déclencheur seul
- **Déclencheur** : appui long sur une pill (nom du joueur).
- **Effet palier 1** : le rond central change d'état → affiche « GANG OF FOUR » + `player_name`. **Transitoire** (revient à « FIN DE MANCHE »).
- **Pas** de son, **pas** d'animation plein écran pour l'instant. L'animation réelle est **reportée dans la séquence** (voir plus bas) — Eric la garde en tête, l'expliquera après la grille + tests verts.

## Le rond central — composant-pivot à états (décision *carte*, à trancher par Eric)

Eric le remonte dans la carte : le rond central devient **l'interface principale de l'UX**. Toute l'UI repose sur **le rond + les 4 quadrants** ; il doit être un **composant nommé, à état explicite, repérable dans le layout** — surtout pas noyé dans le code.

**États à modéliser explicitement :**
- `roundEnd` (défaut) — « FIN DE MANCHE » + arc de sens de jeu (miroir selon la parité de manche) ; tap → écran de saisie.
- `gofTriggered` (transitoire) — « GANG OF FOUR » + `player_name` ; retour auto à `roundEnd`.

**Nom — à trancher par Eric** (le composant actuel s'appelle `CenterDisc`). Options armées, **non tranchées** :
- `CenterDisc` — garder (géométrique, déjà en place).
- `CenterHub` / `Hub` — dit le rôle de moyeu (les 4 quadrants gravitent autour).
- `CorePivot` / `Pivot` — dit le statut de pivot d'UX.

→ **L'implémenteur ne choisit pas seul** : il propose, Eric tranche (pacte, clause 6). Ne pas couler ce choix dans le code comme un fait acquis.

## UX carnet — cohérence gestuelle (piège d'affordance repéré des deux côtés)

Trois gestes ne doivent pas se marcher dessus :
- **Ouvrir la grille** : glissé depuis un bord (handoff, piste B).
- **Tourner les pages** (parties précédentes de la soirée) : bottom-slide successif.
- **Fermer** : le « glissé inverse » du handoff est **abandonné** (il collisionnerait avec les deux gestes ci-dessus). Le geste de fermeture est une **décision *carte*, à trancher par Eric** — principe qu'il pose : *« privilégier l'affordance app moderne Android ».* Options armées, **non tranchées** :
  - croix (X) — ⚠️ en Material moderne, le X d'une surface plein écran est plutôt **en haut à gauche** (le X haut-droite est une convention iOS/web) ;
  - pour une surface « carnet » émergeant du bas, l'idiome Android penche plutôt vers **swipe-down / poignée de glissement / tap sur le scrim**.
  → Eric applique son principe et tranche ; l'implémenteur ne fige pas ce choix seul (comme pour le nom du rond).

À câbler proprement : le bottom-slide de pages ne doit **pas** partager le bord/geste de l'ouverture.

## Séquence d'exécution (imposée)

1. **Plan** de la passe par l'implémenteur.
2. **Implémentation** des chantiers 1–4 + le déclencheur du chantier 5 (déclencheur + changement d'état du rond, **sans** anim).
3. **Tests** — unitaires sur les nouveaux dérivés (manches gagnées, qui-donne-à-qui, regroupement soirée) **et visuel sur simulateur**.
4. **Seulement après grille finie + tests verts** : Eric expose son idée d'animation → on la pose.

## Hors périmètre — palier 2 (rangé, pas effacé)

DB externe / sync, partage social natif, polish, **animation avancée** du GoF.

## Docs à mettre à jour *dans* la passe

- `modele-donnees` : entité `Soirée`, persistance locale (amende « zéro persistance »).
- specs quadrant : + qui-donne-à-qui.
- `cas-reference-score` / tests : couvrir les nouveaux dérivés.
- `grille.md` : cocher **Prouver la justesse** quand les nouveaux tests passent — **constat d'Eric, jamais auto-assumé.**

---
*Handoff figé le 2026-07-06 après validation d'alignement d'Eric. Toute extension au-delà de ce périmètre = hors passe.*
