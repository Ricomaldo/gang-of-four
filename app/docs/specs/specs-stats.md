---
title: GANG — Specs stats & frontière P1/P2
created: 2026-07-07
updated: '2026-07-12'
version: 0.2.1
status: active
type: specs
---

# GANG — Specs stats & frontière P1/P2

Passe stats du **palier 1** : rendre visibles les stats du **gang, inter-sessions, local P1** (le vrac), et poser la **base minimale du relai API** (palier 2) sans construire la DB. Conçu au grill le 7 juillet ; révisé le 12/07 (passe signature — portée gang, miroirs, branlée).

## Le principe — collectif, pas perso

**Tout est collectif** : les stats appartiennent au **gang** (l'ensemble des 4 prénoms), pas à *la personne*. Aucune identité individuelle persistante n'est installée — le gang est **roster-scoped** : un joueur sous deux surnoms dans deux rosters = deux gangs distincts, **aucune réconciliation** (cf. signature/reshape.md §reste à signer, identité = A). *Note datée 12/07 : **la ligue est morte** — pas d'id joueur, pas d'UI single-player ; le collectif est l'objet, point (cf. reshape §fourches pt 7).*

## La frontière P1 / P2

- **Local (P1, maintenant)** — l'app **dérive et affiche** les stats à portée **gang, inter-sessions** : filtrage du **vrac** (toutes les `GameArchive` terminées, AsyncStorage étendu — cf. [[modele-donnees]], reshape §fourches pt 1) sur « les 4 mêmes prénoms ». Aucun compteur stocké : tout se dérive, conforme à *une seule source de vérité, le reste dérivé*.
- **Distant (P2, Hyperion)** — la DB devient une **migration du vrac**, pas un prérequis. Le serveur pourrait re-dériver l'all-time ; rien n'en dépend en P1.

**Relai = événements, pas agrégats.** L'app pousse les `GameArchive` **brutes** (les parties telles quelles) ; le serveur re-dérive les stats. On ne pousse jamais un total (ce serait du dérivé stocké *et* transmis, double faute) — les définitions de stats vont bouger, l'événement brut les laisse recalculables.

## Les stats — deux registres, plus la branlée

Toutes calculées **sur les parties `terminee` du gang uniquement** (le vrac filtré). Une partie se termine (cumul ≥ 100) ; une partie en pause ou annulée n'est pas un record partiel, elle **n'alimente aucune stat** — ni partie, ni manche. *Les emojis ci-dessous sont des **marques typographiques à concevoir**, pas des stickers (cf. signature/palmares.md §rendu des marques).*

**Compteurs (une valeur par joueur)**

| Stat | Marque | Définition |
|---|---|---|
| Manche gagnée | ⭐️ | nb de manches où le joueur est à 0 carte (`roundWinner`), sommé |
| Manche perdue | 💥 | nb de manches où le joueur est le dernier (`roundLastPlace`), sommé |
| Partie gagnée | 🏆 | nb de parties gagnées (`determineWinner`) |
| Partie perdue | 💩 *(ex-❌)* | nb de parties perdues (`gameLoser`) |
| Branlée donnée | *à signer (‡ rejeté — croix de Lorraine ; 💪 écarté)* | **+1 au donneur** (le joueur à 0 de la manche-branlée, `detectBranlee` — cf. [[logique-comptage]]) ; les preneurs par déduction, leur honte se lit dans la feuille |

**Titres (un seul porteur, dérivés des compteurs) — miroirs indépendants** (cf. signature/palmares.md)

| Titre | Marque | Attribution |
|---|---|---|
| Champion *(ex-« Leader »)* | ✌️ | le plus de 🏆 **seuls** ; départage : ⭐️ manches → **branlées données** → **le tenant reste** (dérivé par rejeu). **Jamais le 💩.** |
| Looser | 🐌 | **miroir strict** : le plus de 💩 **seuls** ; départage : 💥 manches perdues → **branlées prises** → **le tenant reste** (par rejeu). **Jamais le 🏆.** |

Les départages **croisés sont supprimés** (l'ancien « ✌️ départagé par moins de ❌ » interdisait le **monde étrange** — même joueur champion *et* looser, résultat **assumé**, cf. signature/palmares.md). Titres décernés **dès la 1ʳᵉ partie terminée** (pas de seuil). À 1 partie : champion = vainqueur, looser = dernier, les autres sans titre. Tie-break = **tenant par rejeu** (plus de « premier vu l'emporte »).

## Identité — agrégation par prénom, roster-scoped

Tout s'agrège **par `prenom`, jamais par siège**. Le siège (`PlayerId` 0-3) est réutilisé d'une partie à l'autre : agréger par siège **mélangerait deux personnes**. Le prénom est la seule identité honnête.

- L'identité d'un gang = **l'ensemble de ses 4 prénoms** (triés) — le vrac se filtre là-dessus, **aucune réconciliation** entre rosters (cf. signature/reshape.md, identité = A).
- « Mêmes joueurs » (revanche) → mêmes prénoms → même gang, cumul correct. Autres prénoms → autre gang, autre stèle.
- Limite assumée : deux « Marc » différents dans le même roster fusionnent, prénom vide exclu. Non-problème : le collectif est l'unité, l'individu n'existe pas.

*Note datée 12/07 : **la ligue est morte** — la « couture playerId » (remplacer la clé `prenom` par un id stable en P2) est **supprimée**, avec toute référence au brief-ligue.*

## La base du relai — deux champs semés sur la partie

À la **création** de la partie (`newGame`), deux champs de *provenance*, portés jusqu'à la `GameArchive` :

- **`id`** — identifiant de partie stable, **uuid v4 pur-JS** (helper 5 lignes, aucune dépendance native). Assure l'idempotence de l'upload (jamais compter deux fois la même partie). Généré à la création : une partie en pause puis reprise garde son id.
- **`leagueId`** — slug lisible, constante `DEFAULT_LEAGUE_ID = 'proto-ligue'`. **Reste au modèle, mais orphelin** : la ligue est morte (12/07) — le champ semé n'est plus adossé à aucun concept produit ; il survit comme provenance brute du relai, rien de plus.

Le payload joueur reste `{ id, couleur, prenom }` — **aucun embryon d'identité joueur** (l'individu n'existe pas dans le modèle).

## Le code

- **`domain/stats.ts`** — module **pur** (existe), agrège les `GameArchive` `terminee`. ⚠️ Il **croise les pôles** aujourd'hui (✌️ départagé par « moins de 💩 », 🐌 par « moins de 🏆 ») → **à corriger** en miroirs indépendants (cf. [[logique-comptage]], signature/palmares.md), sinon le monde étrange reste interdit. Portée à migrer : soirée → **gang** (filtrage du vrac).
- **`roundLastPlace` / `gameLoser`** — **existent** dans `winner.ts` (cf. [[logique-comptage]], retard spec/code résorbé).
- **`detectBranlee(round)`** — à ajouter : `null | 'petite' | 'grosse'`, seuils ~30/~45 sur le total distribué de la manche (cf. [[logique-comptage]], [[cas-reference-score]]).
- **`Game` / `GameArchive`** — `id` + `leagueId` (voir base du relai) + `gofCount` ([[modele-donnees]]).

## L'affichage — la stèle

Les stats vivent dans **la stèle** (cf. signature/ecrans/03-stele) — le monument d'un gang, atteint à froid (accueil → tap un roster) ou à chaud (fin de partie → consulter). Fini le bas de `ScoreGrid` et la `statsZone` du `SetupScreen` (écrans dissous).

- **Les 2 trônes** en tête — ✌️ champion / 🐌 looser, miroirs indépendants ; le **monde étrange** (même joueur sur les deux) est **proclamé**, pas caché.
- **Le détail par joueur** — 🏆 💩 ⭐️ 💥 + **branlées** (seuls les pôles comptent ; le milieu = rien).
- **La mention GOF** — le nb de GOF global par partie, jamais par joueur (rendu à caler — cf. reshape §fourches pt 6).
- La feuille (modale) reste le *ledger par partie* ; la stèle fige le palmarès du gang.

**État vide** (gang sans partie terminée) : placeholder invitant, pas technique (formule au copy-deck). Bascule automatique dès la 1ʳᵉ partie scellée.

## Parqué — palier 2

- Schéma DB Hyperion + forme de l'API (endpoints, upload des `GameArchive`) — la DB = **migration du vrac**, pas un prérequis.
- All-time cross-gangs — si un jour ça existe, ce sera re-dérivé des événements bruts.

*Note datée 12/07 : la **ligue est morte** — identité joueur permanente, comptes/codes et « vrai nom de ligue » sortent du parqué. `leagueId` reste au modèle, orphelin (voir base du relai).*

## La mise en forme

Comment poser les compteurs + 2 trônes à l'œil sur la stèle (pierre gravée, marques typo) : **terrain de design d'Eric**, non figé ici.
