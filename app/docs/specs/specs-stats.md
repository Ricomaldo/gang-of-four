---
title: GoF — Specs stats & frontière P1/P2
created: 2026-07-07
updated: 2026-07-07
version: 0.1.1
status: active
type: specs
---

# GoF — Specs stats & frontière P1/P2

Passe stats du **palier 1** : rendre visibles les stats **collectives de la soirée**, et poser la **base minimale du relai API** (palier 2) sans construire la DB. Conçu au grill avec Eric le 7 juillet ; chaque décision tranchée point par point.

## Le principe — collectif, pas perso

En P1, **tout est collectif** : les stats appartiennent à *la table de ce soir*, pas à *la personne*. Le perso (le palmarès qui suit un joueur dans le temps) attend la **DB externe** (P2). Aucune identité persistante n'est installée aujourd'hui — on pose seulement sa *place*.

## La frontière P1 / P2

- **Local (P1, maintenant)** — l'app **dérive et affiche** les stats à portée **soirée** (somme sur `Soiree.parties[]`). Elle oublie au-delà d'une soirée. Aucun compteur stocké : tout se dérive, conforme à *une seule source de vérité, le reste dérivé*.
- **Distant (P2, Hyperion)** — le serveur **accumule l'all-time par personne / par ligue**. Seul niveau qui exige une identité de joueur stable → rejoint le germe [[brief-ligue]].

**Relai = événements, pas agrégats.** L'app pousse les `GameArchive` **brutes** (les parties telles quelles) ; le serveur re-dérive les stats, y compris l'all-time. On ne pousse jamais un total (ce serait du dérivé stocké *et* transmis, double faute) — les définitions de stats vont bouger, l'événement brut les laisse recalculables.

## Les 6 stats — deux registres

Toutes calculées **sur les parties `terminee` de la soirée uniquement**. Une partie se termine (cumul ≥ 100) ; une partie interrompue n'est pas un record partiel, elle **n'alimente aucune stat** — ni partie, ni manche.

**Compteurs (une valeur par joueur)**

| Stat | Emoji | Définition |
|---|---|---|
| Manche gagnée | ⭐️ | nb de manches où le joueur est à 0 carte (`roundWinner`), sommé sur la soirée |
| Manche perdue | 💥 | nb de manches où le joueur est le dernier (`roundLastPlace`), sommé |
| Partie gagnée | 🏆 | nb de parties gagnées (`determineWinner`) |
| Partie perdue | ❌ | nb de parties perdues (`gameLoser` — **fonction à créer**) |

**Titres (un seul porteur, dérivés des compteurs)**

| Titre | Emoji | Attribution |
|---|---|---|
| Leader | ✌️ | le plus de 🏆 ; départage : moins de ❌, puis plus de ⭐️ |
| Looser | 🐌 | le plus de ❌ ; départage : moins de 🏆, puis plus de 💥 |

Titres décernés **dès la 1ʳᵉ partie terminée** (pas de seuil). À 1 partie : Leader = vainqueur, Looser = dernier, les autres sans titre.

## Identité — agrégation par prénom

La soirée s'agrège **par `prenom`, jamais par siège**. Le siège (`PlayerId` 0-3) est réutilisé : « Autres joueurs » en cours de soirée ferait hériter le siège 0 au nouveau venu et **mélangerait deux personnes**. Le prénom est la seule identité honnête du soir.

- Le scoreboard n'est pas une table fixe à 4 lignes : c'est une **liste variable par prénom** (tous ceux qui ont joué ce soir).
- « Mêmes joueurs » → mêmes prénoms → cumul correct. « Autres joueurs » → nouveaux prénoms → nouvelles lignes.
- **C'est la couture de l'ID permanent** : en P2 on remplace la clé `prenom` par un `playerId` stable, rien d'autre ne bouge.
- Limite assumée : deux « Marc » différents fusionnent, prénom vide exclu. Faible enjeu à l'échelle soirée. Côté social, Eric demandera à chacun un **pseudo unique** (pré-règle l'identité avant la DB). L'ID permanent (P2) corrige proprement.

## La base du relai — deux champs semés sur la partie

À la **création** de la partie (`newGame`), deux champs de *provenance*, portés jusqu'à la `GameArchive` :

- **`id`** — identifiant de partie stable, **uuid v4 pur-JS** (helper 5 lignes, aucune dépendance native). Assure l'idempotence de l'upload (jamais compter deux fois la même partie). Généré à la création : une partie interrompue puis reprise garde son id.
- **`leagueId`** — slug lisible, constante `DEFAULT_LEAGUE_ID = 'proto-ligue'` (placeholder, vrai nom à décider hors-code). En P2, le choix setup « partie locale / ligue » ([[brief-ligue]]) basculera cette valeur.

Le payload joueur reste `{ id, couleur, prenom }` — **aucun embryon d'identité joueur en P1** (c'est la dimension perso, elle appartient à la DB).

## Le code

- **`domain/stats.ts`** — nouveau module **pur**, agrège sur `Soiree.parties[]` filtrées `terminee`. Retourne les 4 compteurs (par prénom) + les 2 titres. Testable une fonction à la fois → nourrit « prouver la justesse ».
- **`gameLoser(rounds, seats)`** — à ajouter (dans `winner.ts` ou `stats.ts`) : le cumul final le plus haut, avec départage. Symétrique de `determineWinner`.
- **`Game` / `GameArchive`** — ajout de `id` + `leagueId` (voir base du relai).

## L'affichage

- **`Palmares` promu → scoreboard soirée** : les 6 stats collectives par prénom (4 compteurs + 2 titres). Portée soirée, plus portée partie.
- Rendu à **deux emplacements, même composant, même donnée** :
  - bas de **`ScoreGrid`** — toujours la soirée entière, indépendamment de la partie dont on regarde le carnet au-dessus ;
  - **`statsZone` du `SetupScreen`**.
- Vu sur **tous les chemins de rejeu** : allumage neuf + « autres joueurs » via Setup ; « mêmes joueurs » via la feuille ScoreGrid (atteignable depuis Round après toute partie).
- **`ScoreCarnet` inchangé** — reste le *ledger par partie*, navigable dans la soirée. Le ledger navigue le temps, le scoreboard fige le classement du soir.

**État vide** (0 partie terminée ce soir — allumage, début de soirée) : placeholder invitant, pas technique, ex. *« Le palmarès s'ouvre après la première partie 🏆 »* (formule placeholder). Bascule automatique vers le scoreboard dès la 1ʳᵉ partie archivée. Le splash dragon reste avant tout ça, inchangé.

## Parqué — palier 2

- Schéma DB Hyperion + forme de l'API (endpoints, upload des `GameArchive`).
- **Identité de joueur permanente** — résolution des pseudos, comptes/codes de ligue.
- All-time cross-soirée par personne.
- Vrai nom de ligue (remplace `'proto-ligue'`).

## La mise en forme

Comment poser 4 compteurs + 2 titres à l'œil (grille, couronnes qui se déplacent) : **terrain de design d'Eric**, non figé ici.
