---
title: GANG — Specs anim frime
created: 2026-07-07
updated: '2026-07-13'
version: 0.2.2
status: active
type: specs
---

# GANG — Specs anim frime

L'animation « Gang of Four » déclenchée par **tap sur le Gong central** (cf. [[specs-techniques]], signature/frime.md). Née du [[brief-01-amorce]] (« animation + son aléatoire »), spécifiée le 7 juillet, révisée le 12/07 (le Gong remplace le long-press).

## L'intention — la ligne qui commande tout

La frappe du Gong, c'est un **« GANG OF FOUR ! »** jeté à la table. L'anim doit donner envie de se lever. **Frime totale, aucune retenue** — celui qui frappe se met à danser, exaltation intérieure intense. Tout ce qui sert cette intention entre, tout ce qui la dilue sort.

## Déclencheur

- **Tap sur le Gong central** — visible, gros, l'asset `gang-of-four.webp` (cf. signature/frime.md : sorti de l'easter-egg, le long-press sur une pill est abandonné — affordance). Lance **simultanément** l'anim + un **son aléatoire** parmi les 3.
- La frime **n'est pas associée à un joueur** (prix assumé, cf. signature/frime.md §prix assumé). Compté : le **nb de GOF global par partie** (`gofCount`, [[modele-donnees]]) — jamais par joueur.
- Durée : **5 s** fixe. Le son joue par-dessus (déborde ou finit avant, sans importance — c'est de la frime, pas de la synchro).

## Le rugissement d'entrée

Le **même geste rugit aussi à l'entrée en partie** — il marque *un gang complet qui prend la table* (cf. signature/frime.md, fiche 01-accueil) : **immédiat pour une revanche**, **après les prénoms pour un roster neuf**, **jamais à la reprise** d'une partie en pause. Non compté dans `gofCount` (ce n'est pas un carré).

## Les beats (tous simultanés, dès la 1ʳᵉ frame)

Assets : image `assets/official/gang-of-four.webp` (fond transparent), sons `assets/sounds/gof-01..03.mp3`.

- **Scale overshoot** — l'image part du **disque central**, grandit jusqu'à **dépasser** le plein écran, puis **claque** en place. Arrogant, pas propre.
- **Jitter de rotation** — micro-tremblement en rotation (±3°). L'image ne tremble pas de peur, elle **vibre d'énergie**. Démarre tout de suite, pas après le scale.
- **Respiration** — pulse de scale par-dessus le shake (gonfle/dégonfle vite), « halète d'exaltation ».
- **Fond plein spectre, cuts durs** — coupures franches entre couleurs saturées (rouge / vert / cyan / magenta…), mode disco, **criard assumé**. L'image transparente flashe dessus. *(Plus de biais couleur joueur — la frime n'est associée à aucun joueur.)*
- **Rayons de gloire** — sunburst tournant lentement derrière l'image (traitement « star »).
- **Board qui recule** — pendant l'anim, **le plateau entier s'assombrit / se ratatine** (pas de quadrant déclencheur — le geste vient du Gong). Le rugissement prend toute la lumière.
- **Freeze triomphal** — à la dernière frame, tout se **fige ~0,5 s** sur une pose héroïque avant de rendre la main au plateau.

## La variance narrative — délégué, critère assets

**Multiplier les anims** pour la surprise, et **mapper chaque anim à un son** (les apparier, les reconnaître) — cf. signature/frime.md §visuel. Il y a celle qu'on préfère et celle qui fait un peu flop — le flop **participe à la narration**. Production des sons **déléguée** (potes monteurs audio), **intégration gardée** : le critère est aux **assets**, pas au code.

## Périmètre — ce qui reste dehors

La frime se joue **avec ces beats exactement**. Tentations à refuser tant que le brique du jour tient : particules, confettis, haptics, easing sophistiqué. Chacune se présentera en bonne idée.

## Parqué — palier ultérieur

- **Alerte épilepsie** — warning en début d'app. À poser au **palier 3** (mise en ligne store), pas avant.
- **Variante « dragon fracassé »** — pour un futur palier avec **personnalisation** (choix des couleurs + choix d'anim). Le dragon est la carte solo la plus forte du jeu, **abattue par le Gang of Four** (4 cartes identiques). Il n'entre donc **jamais en allié** de la frime : la seule mise en scène juste est le dragon **fracassé** par l'image — le geste même du GOF. Réservé à une bibliothèque d'anims sélectionnables.

## Implication build

La lecture des sons passe par **`expo-audio`** — **déjà installé et embarqué dans l'APK diffusé** (`expo-av` écarté — retiré des SDK Expo récents, non viable sur Expo 57). **Aucun build EAS requis par le reshape** — le build / déploiement est porté par une instance dédiée. Animation en `Animated` API + `react-native-svg` (déjà présents).
