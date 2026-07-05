---
created: '2026-07-05'
status: active
title: Journal Damien
---

# Journal — Damien

Le fil avec le commanditaire. Ce qu'on lui envoie, ce qu'il renvoie. Sert le canal **Écouter** de [[mon-arbre]] : écouter les comportements, pas les compliments. Plus récent en haut.

---

## 2026-07-05 — 1er envoi de l'app (APK preview)

**Canal :** Signal.

**Envoyé :**
- Lien direct de l'APK Android (EAS preview, signé) : `expo.dev/artifacts/eas/pz1LZSxWVqTyi3H3N2CtcZ8rHF5Dt0EFdhegsxTI_c4.apk`
- Geste d'install : « DL — autorise sources tierces — install ».
- Cadrage : « Avant d'aller plus loin j'aimerai savoir si tu piges. Et j'ai fait des choix à valider avant de pousser le dev. »
- Réserve nommée (hors plancher) : la grille de score et l'anim easter egg. « Mais je te montre déjà le niveau plancher de l'app. »

**Ce qu'on écoute (pas le compliment) :**
- Installe-t-il seul, sans que j'explique à côté ?
- Comprend-il le geste de saisie de fin de manche tout seul ?
- Que dit-il de ce qui *manque* — recoupe-t-il la réserve (grille, easter egg) ou pointe-t-il autre chose ?

**Comportement (le vrai signal) :** a tout installé seul depuis le lien Expo, sans explication à côté. A répondu **au bout de 26 min, un dimanche matin, non sollicité**. Indicateur `mon-arbre` « il la ressort d'elle-même » : atteint.

**Retour — capture brute (découpée, ordre de rédaction préservé, non décodée) :**

- **FD-00-ca-fait-le-job** — « ça fait le job ». Le jugement racine. _Décodé par Eric : validation de l'approche produit ET de la pipeline eas-sdk._ Contexte : premier tiers à télécharger un build d'Eric aussi vite ; testé à 50 km, un dimanche matin, depuis un lien Expo. Réf émotionnelle : « hier il n'y avait rien, aujourd'hui quelqu'un a testé mon travail » — pipeline vécue comme bien plus rapide que son expérience TestFlight.
- **FD-01-suivi-scores-papier** — « il manque les fioritures, le suivi des scores qu'on peut avoir sur papier avec tous les indices »
  - _Éric → FD-01 :_ « fioritures » est le mot de Damien et il **minimise**. Requalification d'Éric (joueur depuis 20 ans) : ce ne sont **pas** des fioritures jetables mais des **features implicitement désirées** qui enrichissent la commande initiale. Le design de grille envisagé est bon mais devra être **enrichi** pour les porter. Détail porté par FD-02/03/04.
  - _Éric → FD-01 (langage) :_ Éric avait lui-même posé « fioritures » comme **pendant de « plancher »**. Que Damien emploie spontanément ce registre **valide l'approche** plancher / au-dessus — le mot confirme la carte, pas seulement des envies.
- **FD-02-manches-gagnees** — « nombre de manches gagnées »
  - _Éric → FD-02 (sens) :_ **narratif, pas mécanique**. Bande de potes de 30 ans qui se vannent → les stats alimentent le récit. La « feature frime » de la commission n'était que la pointe de l'iceberg.
  - _Éric → FD-02 (contexte pool) :_ ~10 joueurs dans le pool, 6–7 réguliers. Partie à 4 selon dispos ; parfois la place est chère, parfois on court après le 4e.
  - _Éric → FD-02 (déballage « champ stats » — brainstorm, à couper en synthèse, « tout bon à prendre atm ») :_
    - DB de joueurs réguliers
    - dropdown joueurs connus + ajouter un joueur à la DB
    - stats multi-parties hébergées sur serveur perso d'Éric → « refaire le film 3 mois après »
  - _Éric → FD-02 (tier proposé) :_ **plancher +1** (terme proposé : **palier**) = sous la grille de score, une **section stats basique** valorisant le nombre de manches gagnées. Grain actionnable minimal. _Classement tier formel → synthèse._
- **FD-03-donneur-courant** — « donneur de carte à qui »
  - _Précision Damien (réponse à relance d'Eric) :_ « En visuel sous l'encadré du nom ajouter "gagnant manche précédente" et pour le perdant "donne sa meilleure carte" ou un truc dans le genre. Pour ce qui est du code je pense que tu as déjà en tête la fonction à mettre en oeuvre »
  - _Éric → FD-03 (⚠ règle absente du brief ET des specs — À AJOUTER au brief) :_ entre deux manches, après la nouvelle donne, phase à **fort impact émotionnel** : le **dernier** de la manche précédente donne sa **meilleure carte** (imposé, pas de choix), le **gagnant** rend **la carte de son choix**.
  - _Éric → FD-03 (solution retenue, idée Damien, simple/rapide) :_ **rappel visuel dans l'espace libre du quadrant joueur** — qui était 1er, qui était dernier à la manche précédente. **La valeur de carte n'apparaît jamais.** Un simple « remember : qui donne à qui ? ». Pas de modélisation de cartes (conforme arbre-app).
  - _Impl à cadrer au plan :_ le 1er est déjà connu (`roundWinner`) ; dériver le **dernier** (max de cartes de la manche précédente) + gérer une égalité éventuelle. Enrichit `modele-donnees` / specs.
  - _Méta :_ Éric a demandé à Damien plutôt que trancher seul — *Écouter* en acte.
- **FD-04-manches-jouees** — « nombre de manches jouées »
  - _Éric → FD-04 :_ **stats de bilan**, pas repère fonctionnel vivant. Rejoint le champ narratif de FD-02.
- **FD-05-tableau-partageable** — « Une vue affichage de tableau pour que Bruno ou autres envoient en screenshot la feuille de jeu peut aussi être sympa pour voir quand on s'est losé »
  - _Éric → FD-05 (la vue existe déjà) :_ grille de score détaillée (manche × joueur) présente dans le paquet handoff Claude Design (créée hier), accessible par **swipe bas→haut** avec **handle discret**. → confirme : tableau détaillé, au-delà du classement final.
  - _Éric → FD-05 (partage) :_ **partage natif du tél** du propriétaire (Share sheet iOS/Android), retenu au vu de la facilité de dev. Option screenshot-DL écartée au profit du partage natif direct. **Zéro backend** → c'est le « communautaire » de la strate (c) obtenu par le bas.
  - _Éric → FD-05 (persona Bruno) :_ « ça va beaucoup plaire à Bruno ». Bruno = **persona frimeuse par excellence**, demandeur de la **feature frime** (le tél gueule « Gang of Four ! »).
  - _Contexte « Gang of Four » :_ nom du jeu ET surtout nom de la **combinaison de cartes maîtresse et rare** — le sel du jeu, qui repose sur la maestria. Éclaire la feature frime : l'easter egg n'est pas gratuit, il célèbre la combinaison reine.
- **FD-06-scores-sup-1** — « ce qui m'a interpelé c'est qu'il accepte qu'il n'y ait que des joueurs avec des scores >1 en nombre de cartes de fin de manche »
  - _Éric → FD-06 :_ **trou de logique** (validation de saisie). L'app ne peut pas accepter une manche où **aucun joueur n'est à 0** — c'est **intrinsèque** (chaque manche a exactement un joueur qui vide sa main). `roundWinner` lève déjà une erreur domaine, mais l'**UI ne garde pas la saisie** en amont.
  - _Éric → FD-06 (pourquoi c'est passé) :_ absent de `cas-reference-score.md` car il repose sur une **erreur de saisie**, pas une logique de jeu. Les 33 tests prouvent le **calcul**, pas la **validation d'entrée** — catégorie distincte.
  - _Porté au registre :_ **BUG-02-saisie-manche-sans-gagnant**.

_FD-02/03/04 sont éclatés depuis FD-01 (ses composantes). FD-05 nomme Bruno (groupe élargi). Décodage à suivre._

---

## ⚑ Pivot de scope — à trancher en synthèse (5 juillet)

Insight d'Éric déclenché sur FD-04 : « stats de bilan » → « les stats basiques sont plancher » → « accéder aux anciennes parties fait partie de la commande » → « **l'app devient communautaire** ».

**Faits opposés à l'insight (source : `brief.md`) :**
- Le brief **noyau V1 (ligne 15)** contient déjà « Score, **manches gagnées**, nb GOF par joueur dans chaque quadrant ». Donc FD-02 = **reste de commande**, pas nouveauté → poser les stats de quadrant au plancher est **fondé**.
- Le brief **ne contient PAS** : historique, anciennes parties, DB joueurs, serveur, « communautaire ». Hors scope V1 : « on épure, on livre, on joue ».
- Damien a jugé « ça fait le job » sur l'app **sans persistance** → l'historique multi-parties **n'est pas** « ce qui casse à la table ».

**Décomposition en 3 strates (arme le tier) :**
- **a.** Stats de quadrant (manches gagnées, GOF), 1 partie, sans persistance — _dans le brief_ → candidat **plancher**.
- **b.** Bilan de fin de partie persisté **localement** (single-device) — _hors brief_ → palier proche.
- **c.** Historique multi-parties + DB joueurs + serveur = **communautaire** — _hors brief, change la nature de l'app_ (rouvre les nœuds « single-device » et « la partie vit puis oublie » tranchés dans arbre-app) → palier lointain + **décision-carte**.

_Signal clause 4/6 posé, non tranché. Classement plancher/palier = synthèse._

---

## Décodage clos — synthèse actée (5 juillet)

Découpage validé par Éric (il place le curseur sur recommandations) :
- **Plancher** : tenu, figé.
- **Nouvel axe : « Le Social »** — 3e branche d'arbre-app (le jeu se raconte).
- **Palier 1 : « Le Palmarès »** — FD-03 (rappel 1er/dernier) + manches gagnées + FD-04 (manches jouées) + FD-05 (vue détaillée + partage natif). Local, zéro backend.
- **Paliers suivants** : frime complète, bilan persisté local, communautaire lourd.
- **Robustesse hors palier** : BUG-01, BUG-02.

Version arrêtée : [[brief-02-complement]]. Ce journal reste la matière brute.

## Fin de passe — fait

- ✅ `brief.md` → `brief-01-amorce.md` (références redirigées, aucun lien mort).
- ✅ `brief-02-complement.md` créé.
- ✅ Colmatage plancher : **BUG-02** (garde de saisie + 4 tests) et **BUG-01** (fix b + disque « point d'info d'état ») corrigés — typecheck propre, 37 tests verts. Rendu UI à confirmer sur simu.
