---
title: GANG — Modèle de données
created: '2026-07-04'
updated: '2026-07-12'
version: 0.2.1
status: active
type: modele-donnees
---

# GANG — Modèle de données

Le socle d'état dont dépendent logique de score ([[cas-reference-score]]) et UI ([[specs-techniques]]). Une seule source de vérité stockée ; tout le reste est dérivé, jamais dupliqué.

## Stocké (état réel)

**Joueur**
- `id` : 0 à 3 — identifie le joueur et sa **position de quadrant** dans la grille 2×2 de l'écran. La position du quadrant à l'écran *est* le siège physique, vue depuis le proprio du téléphone (en bas) : les deux quadrants du haut = les joueurs d'en face, les deux du bas = le proprio et son voisin. `id` et siège se confondent — pas de champ `siege` séparé à saisir.
- `couleur` : une des 4 couleurs imposées (identité visuelle du quadrant, sans lien avec les couleurs de cartes du jeu) — palette « écho du jeu » ci-dessous
- `prenom` : saisi en début de partie directement dans la pill du quadrant (état *nommer* du Round) — affiché ensuite partout (la pill du plateau). Le tap-saisie vient des **pills uniquement** (cf. signature/reshape.md §fourches tranchées 12/07, pt 3) — plus de sélecteurs de joueur séparés (`SeatSelectors` retirés).

Le parcours horaire du départage niveau 2 (`tiebreakBySeatProximity`, [[logique-comptage]]) se dérive de la position des quadrants dans la grille — aucune donnée de siège supplémentaire à capter.

**Manche**
- `numero` : ordre de la manche (1, 2, 3…)
- `cartesRestantes` : `{ [joueurId]: 0-16 }` — la seule saisie utilisateur en fin de manche

**Partie**
- `joueurs` : `Joueur[4]`
- `manches` : `Manche[]`
- `statut` : couvre les **3 issues** (cf. signature/reshape.md §IA) — `'en-cours'` (pause, reprenable) | `'annulee'` (jetée — **jamais archivée, jamais dans le gravé**) | `'terminee'` (scellée → entre au vrac)
- `gofCount` : nb de **GOF global par partie** — **stocké** (événement brut, pas dérivable des manches : l'app ne modélise pas les cartes), jamais par joueur (cf. signature/reshape.md §fourches tranchées 12/07, pt 6) ; affiché en mention (feuille / stèle)

## Couleurs imposées — palette « écho du jeu » **[EN CHANTIER]**

⚠️ Cette palette est **à retravailler** — direction **placard** : noir/crème + les rouge/jaune du logo en accents chauds (source : signature/reshape.md §direction de style). Les **4 couleurs de siège** ne sont ni gardées telles quelles ni supprimées : **redessinées** (chantier ouvert, cf. signature/reshape.md §fourches tranchées 12/07, pt 5). La table ci-dessous documente l'existant alpha-core, pas la cible.

Attribuées par position de quadrant (grille 2×2, proprio en bas), telles que rendues dans les wireframes :

| Position | Joueur (données de test) | Hex | Nom |
|---|---|---|---|
| Haut-gauche | Bruno | `#C8483C` | rouge brique |
| Haut-droite | Damien | `#3E6DA6` | bleu |
| Bas-gauche | Franz | `#4E9D6C` | vert |
| Bas-droite | Jacques | `#E0A83A` | ambre |

Jaune pur écarté (illisible sur fond crème) → ambre. Les prénoms sont des données de test ; la couleur, elle, est liée à la position, pas au joueur.

## Dérivé (jamais stocké, toujours recalculé)

- score d'une manche = barème appliqué à `cartesRestantes` ([[cas-reference-score]])
- `gagnantManche` = le joueur à 0 carte ce tour-là
- `cumul` par joueur = somme des scores dérivés sur toutes les manches
- fin de partie = au moins un cumul ≥ 100
- `vainqueur` = cumul le plus bas ; départage niveau 1 (score de la dernière manche) puis niveau 2 (siège le plus proche en horaire du `gagnantManche`)
- `dernierManche` = joueur avec le plus de cartes ; départage L1 (cumul le plus élevé) puis L2 (siège le plus proche du gagnant en **anti-horaire**)
- `manchesGagnees` par joueur = compte de `gagnantManche` sur toutes les manches
- le **gang** = le groupe des **4 prénoms triés**, dérivé par **filtrage du vrac** (« les 4 mêmes ») — pas d'objet gang stocké, pas d'id : identité = ensemble de prénoms, roster-scoped, **aucune réconciliation** (cf. signature/reshape.md §reste à signer, identité = A)
- la **branlée** = dérivée **par manche** : total distribué sur la manche **≥ ~30 = petite**, **≥ ~45 = grosse** (seuils ajustables) ; le **donneur = le joueur à 0** ; détectée à la validation (cf. signature/branlee.md, seuils reshape §fourches pt 8)
- les **titres ✌️/🐌** = dérivés **par rejeu** de l'historique complet du vrac (ordonné) — **rien de stocké**, y compris le « en titre reste » du départage (cf. signature/reshape.md §fourches tranchées 12/07, pt 2) ; miroirs **indépendants** (cf. signature/palmares.md)

*Exception au « tout dérivé » : le **nb de GOF par partie** (`gofCount`, ci-dessus) est **stocké** — événement brut déclenché à la main, non dérivable.*

## Persistance locale (palier 1)

**GameArchive** — snapshot d'une `Partie` **terminée** (scellée) :
- `archivedAt` : timestamp JS (ms)
- `players` : les 4 joueurs au moment de l'archivage
- `rounds` : manches jouées
- `gofCount` : nb de GOF de la partie (cf. Stocké)

Le statut couvre les **3 issues** (cf. signature/reshape.md §IA) : **seule la terminée est archivée**. L'**annulée n'est jamais archivée** — jamais dans le gravé. L'en-cours est persistée à part comme état de *reprise* (pause), pas comme archive.

**Le vrac** — la mémoire du gang : **toutes les `GameArchive` terminées, inter-sessions, local (P1)** — AsyncStorage étendu (cf. signature/reshape.md §fourches tranchées 12/07, pt 1). La DB (P2) est une migration future, pas un prérequis. Tout le gravé (gangs, stèle, titres, branlées) se **dérive** du vrac.

**Session** — regroupement de parties :
- `date` : `YYYY-MM-DD` avec tolérance nuit (parties terminées avant 5h = veille)
- `lieu` : **optionnel** — la session titre la feuille (« Établi · 8 juin », cf. signature/palmares.md §scopes)

**Point de bascule** : une partie rejoint le vrac au game-over (cumul ≥ 100), scellée. L'annulation la jette (confirm légère à l'accueil), sans trace.

## Démarrage — pas d'écran séparé

L'app ouvre sur l'**accueil** (cf. [[specs-ecrans]] — le moyeu, object-first). La saisie des 4 prénoms n'a pas d'écran dédié : c'est l'état ***nommer* du Round** — pills vides sur le plateau, le **clavier monte dans la zone du bas** (cf. signature/reshape.md §IA : le Round absorbe nommer / jouer / saisir). Splash et Setup sont dissous.

---
*v0.2 — ajout de `prenom` sur Joueur : omis à tort dans la v0.1 (absent du brief initial), confirmé essentiel par Eric. Implique un écran de démarrage non encore spécifié.*
*v0.3 — résolution du siège : la position du quadrant à l'écran EST le siège physique (vue proprio, en bas), `id` et siège se confondent, plus de champ `siege` séparé ; le départage niveau 2 dérive de la grille. Le démarrage n'est plus un écran à part : c'est l'écran manche avec pills éditables, précédé d'un splash dragon.*
*v0.4 — palette « écho du jeu » figée (rouge brique / bleu / vert / ambre), attribuée par position de quadrant.*
*v0.5 — ajout `dernierManche` (règle maison, 3 niveaux de départage), `manchesGagnees` ; section persistance locale : `GameArchive`, `Soiree`, point de bascule. Amende « zéro persistance ». Hub (ex-CenterDisc) devient le composant-pivot à états.*
*v0.2.1 (passe signature, 12/07) — 3 issues au statut (annulée jamais archivée) ; `gofCount` stocké ; le vrac (gravé P1 local) remplace la soirée unique ; session = date + lieu optionnel ; dérivés gang / branlée / titres par rejeu ; palette marquée en chantier ; démarrage = accueil + état nommer du Round ; `SeatSelectors` retirés.*
