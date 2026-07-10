---
title: GoF — Specs design v3 (écran manche + saisie)
created: '2026-07-04'
updated: '2026-07-04'
version: 0.3.0
status: active
type: brief-design
---

# GoF — Specs design v3 (écran manche + saisie)

Troisième et dernière passe Claude Design. Consolide et corrige les deux rounds précédents ([[brief-wireframes-ecran-manches]] round 1, [[brief-wireframes-1b-saisie]] round 2). Deux écrans en scope : l'**écran manche** (ambient, affiché en continu — jamais vraiment spécifié jusqu'ici) et l'**écran de saisie** (raffiné, avec 3 corrections nommées).

## Corrections à apporter au rendu précédent

Le rendu round 2 était bon sur le principe mais a dérivé sur trois points — à corriger explicitement :

1. **Sélecteurs de joueur (écran saisie)** : rendus en liste verticale empilée avec prénoms complets. Attendu : **une rangée horizontale, gauche → droite, couleur + initiale seule** (B / D / F / J). Pas de prénom complet sur les sélecteurs — le prénom complet vit dans le header.
2. **Sens de jeu (écran manche)** : disparu du rendu car fusionné avec le bouton central. Il ne doit plus être une icône séparée qu'on oublie : il est **porté par la forme même du bouton central** (voir Centre ci-dessous).
3. **Écran manche** : laissé « inchangé » donc jamais détaillé. Il est entièrement spécifié ci-dessous.

## Style transversal

Esprit **tableau de score papier** (carnet classique du jeu) : fond neutre / crème, la couleur réservée à l'identité joueur, le **score cumulé en gros chiffres noirs** = l'élément visuel dominant de chaque quadrant. On lit un score d'un coup d'œil ; le reste confirme « c'est bien moi » sans dominer. Basse fidélité.

---

## Écran 0 — Démarrage (même layout que l'écran manche)

Pas d'écran d'onboarding dédié :

- **Splash** : un dragon plein écran (asset fourni par Eric), court.
- Puis on arrive directement sur le **layout de l'écran manche**, mais les **pills sont vides et éditables**. Tap dans une pill → **clavier qui monte** (classique) → saisie du prénom. On remplit les 4 quadrants, puis la partie démarre (manche 1).
- **Contrainte de layout critique** : les pills des **deux quadrants du bas doivent être positionnées assez haut** pour que le clavier qui monte ne les recouvre pas pendant la saisie. À traiter explicitement — c'est le point que le layout naïf rate.

La position de chaque quadrant dans la grille 2×2 **est** le siège physique, vue depuis le proprio du téléphone (assis en bas) : quadrants du haut = les joueurs d'en face, quadrants du bas = le proprio et son voisin. On saisit donc chaque prénom dans le quadrant qui correspond à la vraie place à table.

---

## Écran 1 — Manche (ambient, affiché en continu)

Layout hérité de 1b : **4 quadrants, tous lus depuis le sud** (une seule orientation, pas de rotation par siège). Mais leur **placement dans la grille 2×2 reflète la table réelle** (voir écran 0) — ce n'est pas un ordre arbitraire.

### Contenu d'un quadrant

- Une **pill d'identité** : prénom + score cumulé (le score global, celui qu'on suit tout le long de la partie).
- Le **déclencheur Gang of Four est intégré dans cette même pill, en opacité réduite** — discret, esprit easter-egg (le brief d'origine dit « tap sur la zone du joueur », pas un gros bouton). Pas de libellé criard.
- **Rien d'autre** sur le quadrant : ni manches gagnées (exclusif à l'écran tableau de score), ni compteur GoF (Phase 2, non affiché en V1).

### Mécanique du bouton Gang of Four (dans le quadrant)

- **Appui long**. Pendant l'appui, un **arc de cercle se remplit** progressivement.
- Si on relâche trop tôt, l'arc **se vide un peu** (pas de reset brutal).
- Si l'appui est tenu assez longtemps, une **seconde animation plein écran + un son aléatoire** se déclenchent (le « 🎉 Gang of Four »).

### Centre

- Un **disque unique dont le contour extérieur dessine une flèche**. Cette silhouette-flèche **porte l'information du sens de jeu** — pas d'icône séparée. Le sens alterne à chaque manche (dérivé : manche 1 = anti-horaire par le livret, puis alternance — [[logique-comptage]] `directionOfPlay`).
- Ce même contour sert de **tracé d'animation** (remplissage le long de la flèche).
- Au centre du disque, le texte : **« FIN DE MANCHE »**. Tap → ouvre l'écran de saisie.

---

## Écran 2 — Saisie de fin de manche

Ouvert au tap sur le disque central. Flux validé au round 2, à re-rendre avec la correction #1.

- **Un seul pavé numérique, grand** — pas 4 petits pavés côte à côte.
- **En haut, un header** avec le prénom complet du joueur actuellement sélectionné.
- **En dessous du pavé, une rangée horizontale de 4 sélecteurs** (couleur + initiale seule, gauche → droite, ordre des sièges), affichant en direct le nombre de cartes en cours de saisie pour chaque joueur.
- Tap sur un sélecteur = le désigne comme cible de saisie active — **ordre libre**, pas forcément B→D→F→J.
- **Sélection par défaut à l'ouverture** :
  - Manche 1 : le sélecteur le plus à gauche (Bruno, premier prénom renseigné).
  - Manches suivantes : le gagnant de la manche précédente ([[logique-comptage]] `roundWinner`).
- **Règle de saisie** : le premier chiffre tapé (0, ou 2 à 9) valide immédiatement la valeur et passe au suivant ; seul le chiffre **1** attend un second chiffre, pour couvrir 10 à 16.
- **« Valider »** actif une fois les 4 joueurs renseignés. Déclenche le calcul (écran de récap hors scope).

---

## Hors scope de cette passe

- **Écran tableau de score** (détail par manche, cumul, sens par ligne) : ressemblera au carnet physique du jeu ([[../../_commission/regles-jeu.pdf]]) — session UI dédiée.

Jeu de données pour peupler les wireframes : **Bruno, Damien, Franz, Jacques**.

---
*v0.3.1 — pli des décisions de fin de session : le siège = position du quadrant (départage niveau 2 dérivé de la grille, plus de champ `siege` séparé — [[modele-donnees]]) ; l'onboarding n'est plus un écran à part mais l'écran manche avec pills éditables, précédé d'un splash dragon ; contrainte clavier sur les pills du bas ajoutée.*
