---
title: GANG — Specs écrans (IA, architecture, thème)
created: '2026-07-12'
updated: '2026-07-13'
version: 0.2.2
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
| **le cartouche** | la voix calme (« {prénom} mène ») ; en **saisir** il devient le titre **« Saisie de la manche »** | fine ligne en haut, persistante ; change son texte sans animation ; porte le **« ← » persistant** (retour accueil, tous les états — fin du tunnel) |
| **le plateau** | la table : 4 quadrants (pills prénom + total) autour du **Gong** central. La **flèche du sens de jeu** (`PlayDirection`, réintégrée — absente des planches CD, elle ne disparaît pas) flotte **en overlay sur la zone du bas** (sous les quadrants), plus dans une bande dédiée | persistant ; les **annonces** l'éclaboussent (surdominants) |
| **la zone du bas** | conteneur à contenu d'état | hauteur **dépendante de l'état** (voir ci-dessous) |

**La navigation (Eric 11/08) :** un **« ← » persistant** en haut à gauche (posé sur le cartouche) rend l'accueil accessible dans **tous** les états — avant, seul `nommer` avait un retour, `jouer`/`saisir` étaient un tunnel. Retour sans risque : la partie est auto-sauvée à chaque manche (l'accueil propose « reprendre »).

**Hauteur par état — la contrainte que les rendus CD (70/30) ratent :**

| état du Round | zone du bas | contrainte dure |
|---|---|---|
| **nommer** | le **clavier natif** monte | le plateau (pills à nommer) reste entièrement visible au-dessus du clavier (~45-48 % d'écran) → plateau compressible à ~50 % |
| **jouer** (repos) | **la boîte du jeu en filigrane** (game-box.webp) + bouton **« la feuille de scores »** (ouvre la feuille complète ; la correction de la dernière manche vit DANS la feuille, ligne crayon éditable) | zéro vide mort *(l'aperçu chiffré des 2 manches — jugé obscur, redondant avec les totaux des pills — a été retiré, Eric 09/08)* |
| **saisir** | le **numpad-calculette 3×4** (0-9 · del · **« = »**) ; le cartouche titre **« Saisie de la manche »** + une ligne de guidage **« Combien de cartes restantes en main ? »** (texte des règles : on saisit les **cartes restantes**, 0–16, un seul joueur à 0 — pas des points) | la grille 3×4 tient dans ~40 % ; la pill active reste visible |
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
- **La passe de carte « {perdant} donne sa meilleure carte à {gagnant} »** —
  *validée par l'usage réel* (« ça sert à rien et pourtant ça a plu »). **Déplacée
  (11/08)** de la pill vers **une ligne unique sous le cartouche** (le Gong masquait
  les notifs posées « vers le centre ») : phrase interactive (tap = confirmé) ; un
  petit **▲** reste sur la pill du gagnant de manche.
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
  — **asymétrie sonore = exigence sémantique du lot 2, pas du polish** : la
  gloire prend le **son** (rugissement), la honte prend le **silence** (« la
  colonne », cf. `signature/reshape.md:350`).

Un seul surdominant à la fois : le plus fort claque, le cartouche absorbe le
reste.

## L'accueil

Manchette d'invite en haut (« on rejoue ? » / « on s'en refait une ? » — jamais
« revanche ») · le **disque-GANG** au centre — **variante 4c signée (12/07)** :
disque crème, le mot GANG noir, énorme, **coupé aux bords du cercle** (la grande
gueule littérale ; **pas** le logo) — **ombre portée ronde** sous le disque +
**libellé d'aide** dessous (« TAP → … ») · **« MES GANGS »** en bas *(polish
11/08)* : **ancré en bas d'écran**, titre entre **deux filets**, la liste des
rosters (4 prénoms, pas de nom de gang) + **temps relatif gros grain** (« hier ·
8 j · 1 mois ») ; **hauteur fixe de 4 slots** (lignes vides réglées si < 4 ;
**scroll vertical** si > 4) ; **noms longs → défilement horizontal** de la ligne ;
tap un roster → sa stèle. États : *vierge* (« nouveau gang ? », liste en germe) ·
*invite* (gangs connus) · *reprise* (reprendre / **annuler** avec confirmation
légère).

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
  (mêmes deux trônes) affiché tel quel. **Polish (11/08) :** entête = titre
  **« Palmarès du gang »** (le roster répété retiré) ; **☞ seulement sur le trône**
  (retiré du tableau détail) ; **symétrie des couleurs** — le **P▲ du champion**
  et le **P▼ du looser** en rougeClair ; la liste **« LES PARTIES »** porte le
  **lieu** et **surligne la plus récente** (repère du flux *consulter*).
- **Feuille** : grille manche × joueur, cellules = **scores de manche** (le
  cumul vit sur la ligne total — **sans label « TOT »**, 11/08 — et les pills) ;
  **deux matières** — crayon (dernière manche, **tappable → rouvre la saisie
  pré-remplie** du Round pour corriger) / gravé (le reste ; la **branlée pèse** :
  ligne inversée + marque + légende) ; **date + lieu en tête de grille** *(11/08,
  **dans la zone capturée** → portés au partage)* — le **lieu** est **éditable
  inline** pour la partie en cours ; **fini le « Établi · … »** (titre modale =
  **« la feuille »**) ; **min. 4 lignes + 1 vide** tant que la partie vit ;
  `[partager]` (capture WYSIWYG — la capture **nettoie placeholder/curseur** du
  lieu ; la signature part dans l'image).

## Le thème — direction « l'affiche » (placard)

> **Fait foi désormais : `GANG - Specs placard`** (Claude Design, projet
> « Wireframes GANG app », 17/07 — importée via le canal direct Design→Code). Elle
> **fixe les valeurs** que cette section posait en placeholder : fontes nommées
> (**Anton** l'affiche · **IBM Plex Mono** le chrome · **Caveat** le crayon),
> palette aux hexs exacts, **règle d'or du chaud** (le vivant seul), matières
> crayon/gravé. Elle **supersede** trois placeholders de cette section (implémentés
> 18/07) : les **4 couleurs de siège sont RETIRÉES** (plateau noir/crème, seul le
> meneur s'allume **orange** — ex-rouge, jugé trop criard le 09/08 ; **masqué
> pendant la saisie** pour ne pas rivaliser avec l'orange du feedback ; **plus de
> ◀** sur le meneur, le fond suffit) · le **disque-accueil est en 4b (noir)** (et non 4c crème)
> · les chaleurs sont **pinnées** (plus « aux tokens »). Ci-dessous = l'intention ;
> les valeurs vivent dans la spec placard + `theme/tokens.ts`.

- **Base** : noir / crème — bandes pleines, aplats, zéro ombre décorative.
- **Typo** : condensée bold pour ce qui proclame (titres, totaux, manchettes) ;
  mono pour le chrome (labels, listes). **Le mot, jamais illustré** : aucune
  imagerie hors le logo.
- **Chaleurs** : le rouge / jaune-orangé **du logo** en accents (le meneur **en
  orange**, le disque qui rayonne, la manche éditable) — intensité entre « braise »
  (4d) et « brasier » (4f), calée aux tokens.
- **Logo vs wordmark** : le logo `gang-of-four.webp` = la marque du **jeu** →
  **uniquement** dans le Gong du Round. Le mot **GANG** = l'app → l'accueil
  (disque-GANG) et les titres.
- **Marques typographiques** (remplacent les emojis stock) : ☞ le looser · ▲▼
  standing (pris / rendu) · la **marque branlée = ‡** (petite) · **‡‡** (grosse) —
  la croix de branlée, gravée sur la cellule du donneur dans la feuille, cumulable
  sur la stèle (fait d'armes comptabilisé, froid) ; rendu fin à l'écran.
  **Décidé (18/07) : ‡ supersede l'encoche `/` `//`** (spec placard, ok Eric) —
  l'encoche typographique est retirée. **Rejetés :** 💪 (stock) · † (silhouette de
  croix). Source : `GANG - Specs placard` §Typo · `signature/branlee.md`.
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
spécifier au build (⚠️ l'asymétrie **son/silence** du final n'est PAS du rendu
fin — c'est l'exigence sémantique du lot 2, cf. §annonces) · le départage exact
disque-GANG 4b/4c et l'intensité 4d/4f (aux tokens) · les seuils branlée
ajustables à la récolte.
