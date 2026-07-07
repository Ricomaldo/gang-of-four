---
title: GoF — Specs anim frime
created: 2026-07-07
updated: 2026-07-07
version: 0.1.0
status: active
type: specs
---

# GoF — Specs anim frime

L'animation « Gang of Four » déclenchée au tap sur le quadrant d'un joueur. Née du [[brief-01-amorce]] (« animation + son aléatoire au tap »), spécifiée ici après conception avec Eric le 7 juillet.

## L'intention — la ligne qui commande tout

Le tap sur son quadrant, c'est un **« GANG OF FOUR ! »** jeté à la table. L'anim doit donner envie de se lever. **Frime totale, aucune retenue** — celui qui appuie se met à danser, exaltation intérieure intense. Tout ce qui sert cette intention entre, tout ce qui la dilue sort.

## Déclencheur

- Tap sur la zone d'un joueur → lance **simultanément** l'anim + un **son aléatoire** parmi les 3.
- Durée : **5 s** fixe. Le son joue par-dessus (déborde ou finit avant, sans importance — c'est de la frime, pas de la synchro).

## Les beats (tous simultanés, dès la 1ʳᵉ frame)

Assets : image `assets/official/gang-of-four.webp` (fond transparent), sons `assets/sounds/gof-01..03.mp3`.

- **Scale overshoot** — l'image part du **disque central**, grandit jusqu'à **dépasser** le plein écran, puis **claque** en place. Arrogant, pas propre.
- **Jitter de rotation** — micro-tremblement en rotation (±3°). L'image ne tremble pas de peur, elle **vibre d'énergie**. Démarre tout de suite, pas après le scale.
- **Respiration** — pulse de scale par-dessus le shake (gonfle/dégonfle vite), « halète d'exaltation ».
- **Fond plein spectre, cuts durs** — coupures franches entre couleurs saturées (rouge / vert / cyan / magenta…), mode disco, **criard assumé**. L'image transparente flashe dessus.
- **Biais couleur joueur** — le spectre penche vers la **couleur du joueur qui a tapé** : sa couleur revient plus souvent, c'est *sa* victoire qui repeint l'écran.
- **Rayons de gloire** — sunburst tournant lentement derrière l'image (traitement « star »).
- **Board qui recule** — pendant l'anim, les 3 autres quadrants **s'assombrissent / se ratatinent**. Le gagnant prend toute la lumière.
- **Freeze triomphal** — à la dernière frame, tout se **fige ~0,5 s** sur une pose héroïque avant de rendre la main au plateau.

## Périmètre — ce qui reste dehors

La frime se joue **avec ces beats exactement**. Tentations à refuser tant que le brique du jour tient : particules, confettis, haptics, easing sophistiqué. Chacune se présentera en bonne idée.

## Parqué — palier ultérieur

- **Alerte épilepsie** — warning en début d'app. À poser au **palier 3** (mise en ligne store), pas avant.
- **Variante « dragon fracassé »** — pour un futur palier avec **personnalisation** (choix des couleurs + choix d'anim). Le dragon est la carte solo la plus forte du jeu, **abattue par le Gang of Four** (4 cartes identiques). Il n'entre donc **jamais en allié** de la frime : la seule mise en scène juste est le dragon **fracassé** par l'image — le geste même du GOF. Réservé à une bibliothèque d'anims sélectionnables.

## Implication build

Aucune lib audio installée à ce jour (pas d'`expo-audio` / `expo-av`). La lecture des sons demande un ajout de dépendance → **nouveau build EAS** pour tester en natif. À grouper avec l'implémentation de l'anim, pas à déclencher isolément.
