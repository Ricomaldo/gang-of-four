---
title: 'Rapport de soirée — Première partie à 4 (test du jalon « tenir la partie »)'
created: '2026-07-08'
updated: '2026-07-09'
version: 0.2.0
status: active
type: rapport-soiree
---

# Rapport de soirée · 01 — Première vraie partie à 4

> **Statut : trace du chemin — figée.**
> Ce document raconte comment on est passé du déballage à chaud (soirée du **8 juillet 2026**, première vraie partie à 4, test du jalon *tenir la partie*) aux décisions du lendemain. **§0 → §9** = le **verbatim brut** (hésitations, redites, « ? » conservés volontairement — l'état à chaud). **§10 → §11** = le **cheminement de décision** (unité-gang, axe signature). C'est le *pourquoi*.
> **Le *quoi* — le tri arbitré et le périmètre 0.2 — a quitté ce fichier** : il vit dans `2026-07-09-passe-0.2.md` (le handoff du 2e passage en forge, grillable à froid). Ne pas re-trier ici : cette trace ne rebouge plus.

---

## 0. Cadre posé par Eric lui-même

- On parle de la version **alpha 0.1** qu'il va pousser en **0.2** et partager via **APK ou TestFlight**.
- On **ne parle pas encore de palier 2** ni d'externalisation des données en DB.
- Le **crible d'admission** retenu pour cette liste : **les frictions de la soirée** — ce qui a *frotté en vrai* hier soir. Se méfier des « ce serait bien si… » (ils n'ont rien frotté → ils n'entrent pas).
- Grilles de tri envisagées, à appliquer plus tard :
  - par nature : **bloquant / polish / idée** (la grille utilisée le matin de la review) ;
  - par intensité / source : « **qu'est-ce qui me brûle, me frotte, me questionne** » ;
  - par décision : « **ce qui est sûr que je vais changer** / **ce qui est possible** » ;
  - test final de sélection : « **si je faisais qu'une seule chose…** ».

---

## 1. Constat général — la soirée

- **L'app a tenu.** La logique a tenu. L'app a été **utilisée toute la soirée. 3 parties.**
- Eric *pourrait* cocher la brique « tenir la partie » de `grille.md`, mais **un petit truc l'en empêche** (voir §2).
- Il a **une longue liste d'items** qui remonte en feedback — à lister demain. « Des idées, du polish et quelques ajustements d'UI. »

---

## 2. Ce qui empêche (d'abord) de cocher la brique — puis recadrage

### Version initiale (à chaud, en premier)
- Le premier truc bloquant : **aucun retour en arrière dans l'app.**
  - Pas de possibilité d'**annuler la partie**.
  - Pas de possibilité de **modifier un prénom**.
  - Et pire : pas de possibilité de **modifier un score**, à minima **un score à peine entré**.
- Bref : **l'app ne pallie pas assez à l'erreur humaine.** 😊

### Recadrage d'Eric ensuite
- En fait, **le retour en arrière n'est PAS la friction n°1.** « L'erreur d'un point, on s'en fout un peu au cours de la soirée » (ça se rattrape à la voix).
- **Le plus chiant, ça a été la veille automatique du téléphone du scribe.** ← *friction n°1 réelle.*
- (Le besoin de liberté / d'undo revient tout de même plus bas, §6 — lié au sentiment d'être « enfermé dans le flow ».)

---

## 3. L'animation signature — le gros enseignement

- **L'animation a beaucoup plu.** Elle va **quitter le rang d'easter egg.**
- Elle **va devenir le bouton central unique et signature.**
- « Ce que portait le hub peut facilement vivre ailleurs ou disparaître. »
- L'anim a tellement plu (avec ses **3 sons aléatoires**) qu'**ils ont demandé plus de sons et plus d'animations différentes.**
- Quelqu'un a même **proposé un soundboard** 😂 — et « c'est pas con car ça dit quelque chose » : **faire de l'app Companion de jeu un jeu en soi.**
- Exemple : il y a une feature qui indique « x donne sa meilleure carte » ; quand on clique dessus, ça dit « **X a donné sa meilleure carte** ». **Ça sert à rien et pourtant c'est interactif et ça a plu. Ça crée de l'interaction avec l'app.**
- « C'est intéressant et **ça rend encore plus difficile de placer le curseur.** »

### Précision d'Eric (apprentissage, pas tirage de dev)
- Il ne disait pas ça pour tirer le dev, **mais par apprentissage personnel.**
- Il est **étonné que ce truc qui sert à rien ait été utilisé.**
- « **C'est la magie d'un test grandeur nature.** »

---

## 4. Le débat arc de cercle vs flèche (sens de rotation)

- Dans le dev, il avait mis un **arc de cercle avec flèche** pour tracer le sens de rotation.
- **Damien avait vécu de la friction** → Eric a mis **une flèche.**
- À la soirée, en montrant le proto, **certains préféraient l'arc de cercle.** C'est un choix d'UI.
- Question posée : **est-ce que je crée une modale de settings pour personnaliser ?** « Ça peut être bien. » *(marqué comme « ça peut être bien » — à passer au crible.)*

### Le vrai enjeu autour de ça
- C'est l'été. **Un pote absent a vu passer un screen partagé et demande à tester en famille.**
- **C'est bien pour l'objectif que l'app vive sans lui.**
- C'est aussi une **occasion d'élargir le test pendant l'été sans lui**, et **à la rentrée recueillir les feedbacks.**
- « Je n'ai pas prétention à faire tous les choix d'UI tout seul… c'est le problème de créer des apps d'ailleurs : **ça couvre trop de choix et trop de métiers** 😅 »

---

## 5. Décisions déjà prises par Eric (fermes, « ça va partir de là »)

> Eric a explicitement dit avoir déjà pris ces décisions pendant la conversation.

- **Anim signature sortie de l'easter egg.**
  - **Déclenchée au tap simple dans le disque central.**
  - **Disque central plus gros.**
  - Motif : en easter egg c'était chouette pour la 1re soirée, mais **si on passe l'app à quelqu'un qui ne connaît pas, comment va-t-il trouver ?** Autant **assumer et le mettre au centre.**
  - Conséquence acceptée : « ça ne saura pas qui a eu la combinaison qui déclenche [l'anim] et ça ne le comptera pas, **mais c'est pas grave. La magie est celle du moment et il faut la pousser un peu.** »
- **Bloquer la veille auto** (empêcher la mise en veille pendant la partie).
  - « Si le gars est pas content, il aura qu'à activer la veille manuellement. Tant pis pour la batterie. »
  - Piste alternative évoquée : « **une veille qui ne demande qu'un tap pour réveil mais pas le code de déverrouillage.** Ça, c'était chiant. » *(le déverrouillage à code était le vrai irritant.)*
- **Assumer les trophées leader / looser** et **les afficher plus explicitement.**
- **Retenir la piste** de l'**écran d'accueil « sécurisant »** et de la **signature magnifiée.**

---

## 6. Le flow enfermant — besoin d'un écran principal / de liberté

- **Le cas du joueur qui a noté les scores** : très joueur et motivé. Intéressé par l'idée de **jouer des ligues**, **s'imaginait déjà en jouer plusieurs en même temps** avec différents groupes de joueurs. → **« Mais ça va chercher trop loin. »**
- Le palmarès est celui de la soirée (ou de la session si c'est pas en soirée) — **mais alors comment le reset ?**
  - Dès qu'on change de joueurs ?
  - Ou alors à l'allumage : **choisir « mêmes joueurs » ou « nouvelle partie »** qui propose après : nouvelle partie ?
- **Pour le moment**, à la fin de la partie, ça propose **nouvelle partie avec mêmes joueurs / joueurs différents** — « **mais c'est con.** C'est stop-ou-encore, l'option. »
- Il faut alors un **retour à un écran principal** avec des boutons :
  - **nouvelle partie / continuer / scores / palmarès** — « par exemple ».
- « Là, j'avais l'impression qu'**on était enfermé dans le flow prévu** et qu'**il manquait une forme de liberté** (cf. bouton **undo** aussi). »
- « Voilà, j'ai fait un peu le tour. »

### Détails UI en fin de tour
- L'écran **RoundScreen est un peu vide aussi, neutre.**
- Le **bouton carnet est trop caché.**

---

## 7. La question de fond — validité et devenir des stats

- La question de fond : **coder pour la bande de potes ou coder pour le monde.**
- Les idées de DB étaient bonnes, mais finalement **simplement les stats de soirées, c'est bien. Pas besoin d'aller tirer ça en ligue.**
- **Le problème** : ça ne vit alors que **sur le téléphone d'un seul joueur.** La **mémoire collective devient dépendante de sa présence.** **Mais est-ce que c'est si grave ?**
- Reformulée en fin de rédaction : la question de fond reste **la validité et le devenir des stats** —
  - liée à **plusieurs parties d'affilée** ?
  - liée à **un groupe de 4 joueurs fixes** ?
  - « **Ça, c'est assez important.** »

---

## 8. Le problème du vocabulaire — nommer l'unité du palmarès

> Bloc important : Eric bute sur le **mot** de l'unité de temps du palmarès.

- **« Session » n'est pas un mot de jeu de société.** On fait une **soirée jeu**, une **partie de jeu**, une **après-midi jeu**, etc.
- Là on parle d'**un jeu auquel on fait plusieurs parties d'affilée (2 ou 3)**, et **ça ouvre un petit palmarès de […]** — **« j'ai pas le mot en fait ».**
- « **Soirée** c'est cool. Mais c'est pas forcément une soirée » si **Pierre joue avec ses enfants pendant les vacances.** Et s'il joue avec **les 3 mêmes personnes plusieurs jours de vacances**, c'est marrant d'avoir **le palmarès de son groupe. Ou de son gang** — vu que c'est le nom du jeu.
- **« Un gang qui se mesure l'un à l'autre en plusieurs parties de plusieurs manches, c'est ? »** → **C'est cette unité qu'il faut nommer**, et **si le codename est `session`, ça ne peut pas être le mot de l'UI.**
- **Définition proposée par Eric : l'unité, c'est *tant que le même groupe de 4 joueurs reste uni*.**
- Argument contre le all-time : « Pour nous 4 ce soir, **ça n'a pas de sens de garder le palmarès vivant.** Car le mois prochain il y aura **2 ou 3 joueurs identiques et 1 ou 2 nouveaux**, et alors **compter les stats all-time favorise ceux qui viennent plus souvent** — ou en tout cas **crée une différence de "jugement"** — et **on ne va pas se mettre à faire des pourcentages !** »
- Ça (les stats fines / all-time), « **on le ferait dans un espace stats perso qui demande un id unique et une DB, qui serait sympa mais inutile au final** — et surtout **à ce stade où la friction n°1 est l'UI** et où **les insights UX méritent d'être poussés.** »

---

## 9. Note de séquencement (dit à chaud, à part)

- « C'est difficile de voir comment ça va se séquencer car **la codebase oblige** et **il y a quelques choix forts d'UI qui doivent déplacer la codebase.** C'est **un moment délicat** 😄😄 »

---

## Le tri — consommé

> Cette section annonçait un tri à faire. **Il a été fait** (09/07, en exercice d'assertivité) et a produit le **périmètre 0.2** → `2026-07-09-passe-0.2.md`. Cribles utilisés : frictions de la soirée · besoin ≠ solution · rôle ≠ tous-les-rôles. L'unité de vie des stats (§7-§8) a été tranchée : **le gang** (§10).

---

## 10. Évolution en discussion — l'unité tranchée : **le gang** (encore à chaud)

> Ajouté pendant la discussion qui a suivi la rédaction. Toujours proche du verbatim, non figé.

- Point de départ : « c'est **la volée** d'abord ». Mais « volée » est **juste mais ne fait pas partie du langage** — pareil que « session ». Ça ne peut pas être le mot d'UI.
- L'imaginaire visé, déjà dit plus haut : « **les membres d'un gang qui se mesurent les uns aux autres** ».
- Question posée puis dépassée : « **une volée d'un soir ou une volée sur plusieurs jours finalement ?** » → l'unité **n'est pas temporelle**, elle est **le groupe**.
- **Narration invitée** : « **qui forme le gang ? Palmarès du gang.** »
- Objection : « si une fois le gang change d'un seul membre, ça perd l'historique ? » → **Non, on ne perd pas** : sans aller jusqu'à la ligue en ligne, **mini-onboarding**, **donner un nom au gang**, et **vivre en local plusieurs ligues informelles avec possibilité de les effacer.**
- **Décision : « l'unité, c'est le gang of four finalement. »** « C'est bien en fait, et **ça joue sur la pluralité du nom du jeu.** »
- Écran d'accueil : **Créer un gang** / **Continuer avec un gang existant**. « Après, les potes se saisissent de ça comme ils veulent, après tout. »
- **Réconciliation** : ça réconcilie **le gang du soir des vacances** et **celui du mercredi.**
- Souplesse assumée : « si parmi **6 joueurs réguliers** il y a **10 gangs différents**, c'est pas gênant. » Ça vit sur **le tél du scribe (« animateur »)**. Il faut « **quelque chose qui rend facilement possible l'usage one-shot ET l'usage de celui qui veut plusieurs "ligues"**. »
- Rappel (dit en gras) : **l'unité, c'est celle du « même groupe de 4 ».**

### Item oublié à la rédaction — le partage
- **La feature partage a été beaucoup utilisée.** *(passe le crible : usage réel.)*
- Elle **gagnerait à avoir la date**, et alors… **le nom du gang formé.**

### Points de vigilance relevés en discussion (à confirmer par Eric, non tranchés ici)
- Ce modèle **reste en local** (store persistant déjà en place) — **ne franchit pas** le palier 2 (pas d'id unique, pas de DB serveur, pas de réseau). Cohérent avec « pas de palier 2 maintenant ».
- **Le one-shot ne doit pas payer l'onboarding du gang** : nommer / garder un gang doit rester un **geste optionnel**, jamais un péage à l'entrée. Défaut = jouer tout de suite.

### Libellés d'écran figés + posture de design (à chaud)
- **Écran d'accueil, libellés arrêtés : `Jouer une partie` · `Créer un gang` · `Continuer un gang`.** « Ça tranche l'appartenance du palmarès et c'est super. »
- **`Rejoindre son gang` écarté** : *rejoindre* est déjà un verbe du online (invitation, présence de l'autre). *Continuer* est local et juste.
- Observation d'Eric : même en traçant la ligne local / online, **le palier online « se rapproche »** — le modèle local (gangs nommés, rosters, palmarès étanches) préfigure proprement l'online. Lecture retenue : **ce n'est pas un danger, c'est un socle** — on *séquence* le futur, on ne le bloque pas.
- **Tension assumée** (« archi dur à trancher ») : « ce serait si facile de gérer des id de joueur unique »… mais **l'id unique rendrait l'interface individuelle**, or Eric veut du **collectif** à ce palier. Argument de **design**, pas de coût. → on reste local, opinionated.
- **Apprentissage de posture** (l'apprentissage réel de la soirée) :
  - **Opinionated** = l'app a un avis, elle ne délègue pas ses choix à un menu de réglages ni à un compte. **Le terrain est informateur, pas jury : écouter tout, signer seul.**
  - **Bascule de fond** : ne plus concevoir l'app comme *une donnée bien mise en forme*, mais comme *un objet qui a une identité*. D'où : **hero header + bannières qui portent l'identité assumée** (ils ne l'illustrent pas, ils l'incarnent).
  - Eric : « c'est vraiment nouveau pour moi de ne pas me baser sur la visualisation graphique mais sur l'identité signature. »

---

## 11. Clôture — le cadre de demain (posé par Eric avant de dormir)

- **Nouvel axe transversal identifié : *l'identité signature* de l'app.**
  - **Cœur : « l'anim frime ».**
  - **Le palmarès lié à un gang nommé (avec son roster)** est un **choix fort de design** qui *fait partie de la signature* — pas une simple feature.
  - Équation retenue : **Signature ⇄ idées fortes.**
- **Plan de demain — deux branches :**
  1. **Les idées fortes** (côté signature) ;
  2. **Les frictions** (le crible de la soirée, déjà en place — §0, §2, §6).
- « **Tout le reste s'en déduira. Et tout est nommé.** »

---

## 12. Le périmètre 0.2 — déplacé

> Le tri a produit la cible de la 0.2 (DANS / HORS). Pour ne pas mêler un plan actionnable à cette trace, **il a été déplacé dans son propre handoff** : `2026-07-09-passe-0.2.md`. C'est le fichier que le 2e passage en forge doit ouvrir — et celui qu'Eric grillera à froid.

