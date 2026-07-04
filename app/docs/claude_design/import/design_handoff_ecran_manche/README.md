# Handoff — Gang of Four : écran de manche, saisie & grille de score

## Overview

Application de **comptage de points** pour un jeu de cartes physique à 4 joueurs, jouée sur **un seul téléphone posé à plat sur la table**. L'app ne joue pas les cartes : elle compte les points entre les manches jusqu'à ce qu'un joueur atteigne 100 (fin de partie).

Ce paquet couvre **4 écrans** de la V1 :

0. **Splash** (dragon plein écran, court)
1. **Démarrage** (saisie des 4 prénoms — même layout que l'écran manche)
2. **Écran de manche** (ambient, affiché en continu pendant le jeu)
3. **Saisie de fin de manche** (pavé numérique + 4 sélecteurs)
4. **Grille de score** (tableau type carnet officiel)

Hors scope V1 : écran de fin de partie / classement, compteur « Gang of Four » par joueur (Phase 2), réglages.

---

## About the design files

Les fichiers de ce paquet (`Wireframes écran de manche.dc.html`) sont des **références de conception créées en HTML** — des prototypes qui montrent l'agencement et le comportement voulus, **pas du code de production à copier tel quel**.

La cible d'implémentation calibrée est **React Native + Expo**, en montant d'abord un **squelette présentationnel « zéro-logique »** (UI et navigation d'abord, logique de comptage branchée ensuite depuis la spec `logique-comptage`). Recréez ces écrans avec les patterns et composants habituels du codebase RN/Expo — n'importez pas le HTML.

Le HTML est un **Design Component** : pour l'ouvrir localement, il faut `support.js` (fourni ici à côté). Il s'ouvre dans un navigateur. Chaque piste porte un identifiant (`5a`, `5b`, `3a`, `4b`…) affiché en badge et référencé ci-dessous.

---

## Fidelity — **basse fidélité (lofi)**

Boîtes, labels, placeholders. Les **couleurs joueur sont figées** (voir Design Tokens) et **doivent être respectées**. Le reste (police définitive, ombres, espacements exacts, micro-typo) est **indicatif** : appliquez le design system du codebase. Les polices du proto (Kalam / Space Mono) ne sont pas prescriptives — seule compte la **hiérarchie** : le **score cumulé en très gros chiffres noirs** est l'élément dominant de chaque quadrant.

Pistes de référence dans le HTML :
- Écran de manche + sens de jeu → **`5a`**
- Accès à la grille (piste retenue = B) → **`5b`**
- Flux de saisie (ouverture / règle du pavé / prêt) → **`3a`** cadres ③④⑤
- Grille de score → **`4b`** (et `5b` cadre « grille ouverte »)

---

## Décisions figées (rappel)

- **Couleur = position du quadrant**, pas le joueur. Les prénoms **Bruno / Damien / Franz / Jacques** ne sont que des **données de test**.
- **6 questions** tranchées : le calcul des scores, `roundWinner`, le sens de jeu, l'ouverture de la grille et la fin de partie sont **dérivés de la logique déjà spécifiée** (`logique-comptage`) et de `modele-donnees.md v0.4` — voir « State & logic » ci-dessous pour le résumé.
- **Suggestions** : A (contrainte du pavé) **acceptée** · C (re-tap d'un sélecteur écrase la valeur) **acceptée** · B (`confirm` avant reset) **validée** — mais **strictement sur l'action reset / nouvelle partie**, jamais sur le flux normal ni sur l'easter egg. Ce n'est pas de la persistance, juste un garde-fou d'un tap.
- **Zéro persistance** : aucune sauvegarde. Un refresh / kill de l'app perd la partie en cours (voulu). Seule concession : le `confirm` avant reset ci-dessus.

---

## Screens / Views

### 0 — Splash
- **Purpose** : ouverture de marque.
- **Layout** : un **dragon plein écran** (asset fourni par Eric), court, puis enchaîne **directement** sur l'écran de démarrage. Pas d'onboarding dédié. Un tap peut le sauter.

### 1 — Démarrage (saisie des prénoms)
- **Purpose** : renseigner les 4 prénoms avant la manche 1.
- **Layout** : **identique à l'écran de manche** (grille 2×2), mais les **pills sont vides et éditables**. Tap dans une pill → **clavier système qui monte** → saisie du prénom.
- **La position dans la grille 2×2 = le siège physique** vu par le propriétaire du téléphone (assis en bas) :
  - Haut-gauche / Haut-droite = les joueurs d'en face.
  - Bas-gauche / Bas-droite = le propriétaire et son voisin.
  On saisit chaque prénom dans le quadrant qui correspond à la vraie place à table.
- **Contrainte de layout CRITIQUE** : les pills des **deux quadrants du bas** doivent être positionnées **assez haut** dans leur quadrant pour **ne pas être recouvertes par le clavier** qui monte. C'est le point que le layout naïf rate — à traiter explicitement (dans le proto, `5a`/démarrage : les pills sont alignées vers le haut de chaque quadrant).
- **Fin** : les 4 pills remplies → la partie démarre (manche 1).

### 2 — Écran de manche (ambient)
- **Purpose** : affiché en continu pendant le jeu ; score de chacun visible en permanence ; point d'entrée vers la saisie de fin de manche.
- **Layout** : grille **2×2** plein écran, un quadrant par joueur, **placement = table réelle** (cf. écran 0). **Tous les quadrants sont lus depuis le sud** — une seule orientation, **pas** de rotation par siège.
- **Contenu d'un quadrant** — une **pill d'identité** et rien d'autre :
  - Pastille de **couleur du siège** (voir tokens) + **prénom** (secondaire, gris).
  - **Score cumulé** en **très gros chiffres noirs** = élément dominant.
  - **Pas** de manches gagnées (exclusif à la grille), **pas** de compteur GoF (Phase 2).
  - **Aucun indicateur du déclencheur Gang of Four** : c'est un easter egg, il ne se signale pas.
- **Zone centrale** — un **disque unique « FIN DE MANCHE »** :
  - Sa **bordure est un arc de ~¾ de cercle terminé par une flèche courbe en bout d'arc** (type ↺/↻). Cette flèche **porte le sens de jeu** — pas d'icône séparée.
  - Le **sens alterne à chaque manche** : manche 1 = **anti-horaire** (par le livret), puis alternance stricte (dérivé, `directionOfPlay`). Visuellement, l'arc et sa pointe sont **mis en miroir** d'une manche à l'autre (cf. `5a`, manche 1 vs manche 2).
  - **Tap** → ouvre l'écran de saisie.

### 3 — Saisie de fin de manche
- **Purpose** : saisir le **nombre de cartes restantes** de chaque joueur ; l'app calcule les points.
- **Layout vertical** (lu du sud) : header → grand pavé → rangée de sélecteurs → bouton Valider.
  - **Header** : le **prénom complet** du joueur **actuellement sélectionné** + « cartes restantes ? ».
  - **Un seul pavé numérique, grand** (pas 4 petits pavés). Chiffres 1–9, 0, effacer (⌫).
  - **Rangée horizontale de 4 sélecteurs**, gauche → droite dans l'ordre des sièges : **couleur + initiale seule** (B / D / F / J). **Pas de prénom complet** ici (il vit dans le header). Chaque sélecteur affiche **en direct** le nombre de cartes en cours de saisie pour ce joueur.
  - **Bouton « Valider »** sous les sélecteurs.
- **Sélection par défaut à l'ouverture** :
  - **Manche 1** : le sélecteur le plus à gauche (premier prénom renseigné).
  - **Manches suivantes** : le **gagnant de la manche précédente** (`roundWinner`).
- **Ordre libre** : taper un sélecteur le désigne comme cible active — pas forcément B→D→F→J.
- **Règle de saisie du pavé** :
  - Le **premier chiffre 0, ou 2–9** valide **immédiatement** la valeur et **passe au joueur suivant**.
  - Seul le chiffre **1** attend un **second chiffre** (pour couvrir **10 à 16**). Sug A : après un « 1 », **seuls 0–6 sont valides** (max 16 cartes).
  - Sug C : **re-taper un sélecteur déjà rempli l'écrase** (correction, saisie libre).
- **Valider** : **actif seulement une fois les 4 joueurs renseignés** → déclenche le calcul des scores (écran de récap hors scope).

### 4 — Grille de score
- **Purpose** : consulter le détail par manche + le cumul. C'est le **carnet officiel du jeu**, rien de plus qu'un **tableau**.
- **Accès (piste retenue = B)** : **aucun élément d'UI permanent** sur l'écran de manche. Un **glissé depuis un bord** fait apparaître la grille (elle « pointe » puis se déploie en plein écran, lue du sud). Fermeture par **glissé inverse**. (Piste A — onglet permanent « SCORES » au bord nord — a été écartée ; visible dans `5b` pour mémoire.)
- **Layout du tableau** :
  - **Colonnes = joueurs** (en-tête : pastille couleur + **initiale**).
  - **Lignes = manches**.
  - **Colonne de gauche = sens de jeu**, qui **alterne** à chaque ligne (← / →), exactement comme le carnet papier.
  - **Ligne TOTAL** (en bas) = le **cumul** repris dans les pills de l'écran de manche.
  - Convention : une **cellule à 0** = le joueur qui a **fini** la manche (`roundWinner`).
- **Pas de barème** affiché : l'objectif n'est pas d'expliquer les règles. Seule mention d'en-tête : **« 1er à 100 déclenche la fin »**.

---

## Interactions & behavior

- **Splash → Démarrage → Manche** : enchaînement automatique ; démarrage terminé quand les 4 pills sont remplies.
- **Tap pill (démarrage)** : ouvre le clavier système ; les pills basses restent au-dessus du clavier.
- **Tap disque « FIN DE MANCHE »** : ouvre l'écran de saisie.
- **Appui long sur une pill (écran manche)** = easter egg **Gang of Four** : déclenche une **animation plein écran + un son aléatoire**. **Aucun indicateur visuel** au repos. (L'ancienne mécanique d'« arc qui se remplit dans le quadrant » est **supprimée**.)
- **Pavé de saisie** : auto-avance selon la règle 1 vs 0/2–9 ; ⌫ efface ; re-sélection écrase.
- **Valider** : désactivé tant que < 4/4 ; à 4/4 → calcul.
- **Glissé depuis un bord** : ouvre/ferme la grille de score.
- **Reset / nouvelle partie** : précédé d'un `confirm` léger (Sug B).
- **Sens de jeu** : purement dérivé de l'index de manche (aucun toggle manuel) ; l'arc du disque central est mis en miroir à chaque manche.

---

## State & logic (résumé — source de vérité : `logique-comptage`, `modele-donnees.md v0.4`)

Modèle indicatif (à aligner sur les specs du codebase) :

- `players[4]` : `{ name, seat /* position 0..3 = couleur */, score }`. **La couleur dérive du siège**, pas d'un champ couleur par joueur ; le siège dérive de la position dans la grille 2×2 (plus de champ `siege` séparé).
- `rounds[]` : `{ direction, cardsLeft[4], points[4], winner }`.
- `directionOfPlay` : dérivé de l'index de manche — manche 1 anti-horaire, alternance ensuite.
- **Calcul des points** (à confirmer/brancher depuis `logique-comptage`) : `points = cartesRestantes × multiplicateur` selon le barème du jeu (1–7 = ×1, 8–10 = ×2, 11–13 = ×3, 14–15 = ×4, 16 = 80). Le joueur à **0 carte** (`roundWinner`) marque **0**.
- `activeSelector` : sélecteur de saisie courant (défaut = 1er en manche 1, sinon `roundWinner`).
- `inputBuffer` : gère l'attente du 2e chiffre après un « 1 ».
- **Fin de partie** : dès qu'un cumul atteint/dépasse **100**, la partie s'arrête (écran de fin hors scope V1 mais le déclencheur doit être câblé).
- **Aucune persistance.**

---

## Design Tokens

**Couleurs joueur — figées, liées à la position (grille 2×2, propriétaire en bas)**

| Position     | Hex       | Nom          |
|--------------|-----------|--------------|
| Haut-gauche  | `#C8483C` | rouge brique |
| Haut-droite  | `#3E6DA6` | bleu         |
| Bas-gauche   | `#4E9D6C` | vert         |
| Bas-droite   | `#E0A83A` | ambre        |

**Neutres & surfaces (indicatifs)**
- Encre / texte principal : `#1A1A1A`
- Chiffres de score : `#111111`
- Fond écran (crème carnet) : `#F4F1E8`
- Fond pill : `#FFFEFB`
- Fond clavier système (proto) : `#E2DDD0`
- Accent saisie (chiffre en attente « 1_ ») : `#C86A4A`
- Bordures : `rgba(0,0,0,0.18)` à `rgba(0,0,0,0.40)`

**Typo (indicatif — remplacer par le design system)**
- Manuscrite (titres, prénoms) : Kalam → à remplacer.
- Monospace (chiffres, labels, score dominant) : Space Mono → à remplacer.
- Règle qui compte : **score cumulé = plus gros élément noir de chaque quadrant**.

**Formes (indicatif)**
- Pill : rayon ~15 px, bordure ~2.5 px.
- Disque central : ~88 px de diamètre, arc/bordure ~6 px, ~¾ de cercle + pointe de flèche tangente.

---

## Assets (dépendances)

- **Splash dragon** : image/animation plein écran, **fournie par Eric** (format/durée à confirmer).
- **Sons Gang of Four** : **pool de sons aléatoires** (easter egg) — à fournir.
- **Animation plein écran GoF** : à définir/fournir.
- Aucune icône propriétaire n'est requise ; utilisez la bibliothèque d'icônes du codebase pour ⌫, flèches, etc.

---

## Files

- `Wireframes écran de manche.dc.html` — prototype de référence (toutes les pistes ; V1 = pistes `5a`, `5b`, `3a`, `4b`).
- `support.js` — runtime nécessaire pour ouvrir le HTML localement (ne pas porter en prod).

> Le HTML empile plusieurs tours d'exploration (tours 1→5, le plus récent en haut). **La V1 à implémenter = le tour 5 (`5a` manche/sens, `5b` accès grille) + la saisie `3a` + la grille `4b`.** Les tours 1–4 sont l'historique des explorations.
