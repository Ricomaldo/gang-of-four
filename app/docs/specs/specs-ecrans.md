---
title: GANG — Specs écrans (IA, architecture, thème)
created: '2026-07-12'
updated: '2026-07-12'
version: 0.2.1
status: active
type: specs
---

# GANG — Specs écrans

La spec née de la passe reshape : l'**IA/navigation**, l'**architecture d'écran**
et le **thème** n'avaient pas de maison (ils vivaient dans `App.tsx` et
`tokens.ts`, sans spec). Le *pourquoi* vit dans `signature/reshape.md` (fait foi)
et les fiches `signature/ecrans/0*.md` (wireframes + planches Claude Design
figées dans `claude_design/2-alpha-signature/retour/`). Ici : le **quoi
buildable** et ses contraintes.

## IA — hub-and-spoke

**3 écrans + 1 modale** (remplacent Splash / Setup / Round / ScoreEntry /
ScoreGrid) :

- **l'accueil** — le moyeu. Porte + carrefour des deux mondes (jouer /
  consulter). Toujours à un geste depuis partout.
- **le Round** — l'écran de jeu. **Absorbe** : *nommer* (ex-Setup), *jouer*,
  *saisir* (ex-ScoreEntry) — des **états**, pas des écrans.
- **la stèle** — le palmarès d'un gang (une destination, deux chemins : accueil
  à froid, fin de partie à chaud).
- **la feuille** *(modale)* — la grille d'une partie ; monte par glissé (depuis
  le Round : la partie en cours ; depuis la stèle : une partie passée), se
  referme.

**Navigation** : tout passe par l'accueil, pas de lien direct écran↔écran.
**Anti-enfermement** : une partie en cours est **en pause, jamais perdue** ; on
peut roamer (accueil, stèle) et *reprendre*.

**Les 3 issues d'une partie** : **en cours** (pause → reprendre) · **annulée**
(imprévu ; confirmation légère, à l'accueil ; **jamais archivée**) · **terminée**
(à 100 → scellée → entre au vrac). Seules les terminées entrent dans la mémoire.

## Le Round — architecture

Trois conteneurs empilés :

| conteneur | rôle | comportement |
|---|---|---|
| **le cartouche** | la voix calme (« {prénom} mène ») | fine ligne en haut, persistante ; change son texte sans animation |
| **le plateau** | la table : 4 quadrants (pills prénom + total) autour du **Gong** central + la **flèche du sens de jeu** (`PlayDirection`, réintégrée — absente des planches CD, elle ne disparaît pas) | persistant ; les **annonces** l'éclaboussent (surdominants) |
| **la zone du bas** | conteneur à contenu d'état | hauteur **dépendante de l'état** (voir ci-dessous) |

**Hauteur par état — la contrainte que les rendus CD (70/30) ratent :**

| état du Round | zone du bas | contrainte dure |
|---|---|---|
| **nommer** | le **clavier natif** monte | le plateau (pills à nommer) reste entièrement visible au-dessus du clavier (~45-48 % d'écran) → plateau compressible à ~50 % |
| **jouer** (repos) | **aperçu feuille** : ≥ 2 dernières manches + la ligne vierge + accès « feuille complète » | jamais une seule ligne orpheline (illisible) ; zéro vide mort |
| **saisir** | le **numpad-calculette 3×4** (0-9 · del · **« = »**) | la grille 3×4 tient dans ~40 % ; la pill active reste visible |
| **annonce / cérémonie / fin** | inchangée ou masquée | le surdominant se joue **sur le plateau** |

**Le battement** (détail : `reshape.md` §battement) : tap une **pill** (seule
cible de saisie — la ligne vierge est un écho visuel, pas un bouton) → elle
s'allume, le numpad monte → le nombre s'affiche **sur la pill** → ordre libre →
« = » actif à 4/4 (exactement un joueur à 0) → calcul → annonces.

## Hérités de la passe 0.2 — les frictions de la soirée 01 *(confrontation 12/07)*

Le reshape n'était **qu'un des enjeux** de la 0.2 (`journal/2026-07-09-passe-0.2.md`,
périmètre gelé). Ce qui vient des frictions réelles et **survit tel quel** :

- **Veille bloquée (keepAwake) pendant une partie en cours** — la **friction n°1**
  de la soirée (le téléphone du scribe se verrouillait, code de déverrouillage
  irritant). S'active à l'entrée en jeu, se relâche hors partie.
- **La notif « {prénom} donne sa meilleure carte »** (sur la pill du perdant de
  manche, interactive) — *validée par l'usage réel* (« ça sert à rien et pourtant
  ça a plu »), gardée telle quelle, non généralisée.
- **L'undo minimal** — couvert : corriger le **dernier score** (le crayon,
  dernière ligne éditable) · **annuler la partie** (accueil, confirmation
  légère) · **éditer un prénom** en cours de partie — **geste signé (12/07) :
  appui long sur la pill** → renommer (le long-press est libre depuis que le
  GOF vit au Gong ; tap = saisie, appui long = identité).
- **Défaut flèche** (sens de jeu) : l'arc = **donnée à récolter** cet été, pas
  une modale de réglages.

*Supersedes assumés (l'identité, née la nuit du 9→10, a dépassé deux points du
périmètre 0.2) : les libellés d'accueil `Jouer une partie · Créer un gang ·
Continuer un gang` → le **Gong** (jouer) + **tes gangs** (continuer), et « créer »
disparaît — le gang **naît de la revanche, sans baptême** (pilier 5) ; le « gang
nommé » → le gang **n'a pas de nom**, c'est le roster (4 prénoms).*

## Les annonces — rareté = intensité

Sur **le plateau**, jamais dans la zone du bas. Échelle :

- *manche gagnée* (chaque manche) → **discret** (la pill respire) ;
- *passe devant* → **flash léger** ;
- *branlée* → **la cérémonie** : le plateau se fige, surdominant, dialogue à
  **2 sorties** — *corriger* (retour saisie, rien de gravé) / *graver* (scellé,
  irréversible). Copy : « petite / grosse branlée de {prénom} ! » ;
- *fin de partie (100)* → **le final** : plein plateau, miroir gloire/💩
  (vainqueur = cumul le plus bas), puis la feuille se scelle → portes *on
  rejoue ?* (même roster → nouveau battement) / *consulter* (→ stèle) / accueil.

Un seul surdominant à la fois : le plus fort claque, le cartouche absorbe le
reste.

## L'accueil

Manchette d'invite en haut (« on rejoue ? » / « on s'en refait une ? » — jamais
« revanche ») · le **disque-GANG** au centre — **variante 4c signée (12/07)** :
disque crème, le mot GANG noir, énorme, **coupé aux bords du cercle** (la grande
gueule littérale ; **pas** le logo) · **tes gangs** en bas : la liste des rosters
(4 prénoms, pas de nom de gang) + **temps relatif gros grain** (« hier · 8 j ·
1 mois ») ; tap un roster → sa stèle. États : *vierge* (« nouveau gang ? », liste
en germe) · *invite* (gangs connus) · *reprise* (reprendre / **annuler** avec
confirmation légère).

**Masquer un gang** *(décision 12/07)* : un roster se **masque** de la liste —
ses feuilles **restent au vrac** (« n'oublie rien » : on ne détruit jamais la
mémoire). **Démasquage, deux voies** : (1) *le geste* — si les 4 mêmes rejouent,
le gang **renaît de lui-même** dans la liste (dérivé du vrac, il revit en
jouant — pilier 5) ; (2) *la consultation* — une ligne discrète en pied de liste
(« + N gangs masqués ») le révèle sans jouer. Pas de réglage, pas d'écran de
gestion. **Limite assumée (12/07)** : l'appariement des rosters se fait par
**prénoms normalisés** (trim + casse) — sans id joueur, homonymies et collisions
restent possibles ; c'est le prix d'Identité = A (« aucune réconciliation »),
**on ne complexifie pas** pour ce cas.

## La stèle & la feuille

- **Stèle** : les **2 trônes** (✌️ le champion / 🐌 le looser — miroirs
  indépendants, « en titre reste » dérivé **par rejeu** du vrac) + le détail par
  joueur (parties, manches, branlées) + la **mention GOF** (« N gang-of-four
  pendant cette partie ») + *on rejoue ?* + **`[partager]`** (la stèle se
  partage à tout moment — cf. [[specs-partage]], périmètre B). Monde étrange
  (mêmes deux trônes) affiché tel quel.
- **Feuille** : grille manche × joueur, cellules = **scores de manche** (le
  cumul vit sur TOT et les pills) ; **deux matières** — crayon (dernière manche,
  éditable sans confirmation) / gravé (le reste ; la **branlée pèse** : ligne
  inversée + marque + légende) ; titre = la session « Établi · 8 juin » (lieu
  optionnel) ; `[partager]` (capture WYSIWYG — la signature part dans l'image).

## Le thème — direction « l'affiche » (placard)

- **Base** : noir / crème — bandes pleines, aplats, zéro ombre décorative.
- **Typo** : condensée bold pour ce qui proclame (titres, totaux, manchettes) ;
  mono pour le chrome (labels, listes). **Le mot, jamais illustré** : aucune
  imagerie hors le logo.
- **Chaleurs** : le rouge / jaune-orangé **du logo** en accents (le meneur, le
  disque qui rayonne, la manche éditable) — intensité entre « braise » (4d) et
  « brasier » (4f), calée aux tokens.
- **Logo vs wordmark** : le logo `gang-of-four.webp` = la marque du **jeu** →
  **uniquement** dans le Gong du Round. Le mot **GANG** = l'app → l'accueil
  (disque-GANG) et les titres.
- **Marques typographiques** (remplacent les emojis stock) : ☞ le looser · ▲▼
  standing · la marque branlée **à signer par Eric** (‡ REJETÉ — croix de Lorraine ; 💪 écarté — emoji stock ; aucune retenue).
- **Couleurs de siège** : les 4 couleurs actuelles (`tokens.ts`) sont **en
  chantier** — à redessiner en cohérence placard (ni gardées telles quelles, ni
  supprimées).
- **Deux matières** (l'axe crayon/gravé, transversal) : léger / manuscrit /
  réversible vs lourd / inversé / définitif.

## Renommages composants (le tag du code suit)

`Hub` → **`Gong`** (2 tailles : porte dominante / table partagée, même geste) ·
`ScoreCarnet` → **`Feuille`** · `SeatSelectors` → supprimé (les pills du plateau
sont la cible) · `Palmares` → absorbé par la **stèle** (miroirs corrigés) ·
`PlayDirection` → conservé, autour du Gong · app **GANG**.

## Parqué

Le rendu fin des anims d'annonce (flash léger, final) — famille de la frime, à
spécifier au build · la marque branlée (à signer par Eric) · le départage exact
disque-GANG 4b/4c et l'intensité 4d/4f (aux tokens) · les seuils branlée
ajustables à la récolte.
