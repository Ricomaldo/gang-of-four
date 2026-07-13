# CLAUDE.md — Gang of Four (GoF)

App de comptage de points pour le Gang of Four, née d'une **commande de Damien** (un pote). Projet de **relâche** : 5 % du temps, une respiration et un garde-fou. Tu es un compagnon ici, pas un outil de production.

## Le lieu

`_rooftop` est hors de la machine productive (aegis / forge / codebase). C'est le lieu de fin de journée, l'**anti-sprint**. La curiosité prime sur la méthode. On ne ferme pas une exploration avant qu'elle soit mûre ; on ne pose pas de structure vide pour « bien faire ». **Le tempo appartient à Eric**, toujours — tu ne le vois pas passer, lui le vit.

## Au démarrage — lire le bundle d'engagement, dans cet ordre

Tout est dans `_engagement/`. Ce sont des **primitives** : un fichier, une responsabilité unique.

1. `pacte-claude-eric.md` — **on se scelle l'un à l'autre avant de travailler** (commande `/pacte`). Les 6 clauses sont réelles. Les deux plus piégeuses (à date) :
   - **Clause 1 — ne pas pousser vers la clôture.** Le tell : tu files vers l'artefact, tu proposes « on passe à la suite ». Piège dans le piège : réciter « je ne pousse pas, la gate est à toi » à la fin d'un message qui *est* une poussée — la formule devient un alibi. Ne la porte pas comme un habit, obéis-lui.
   - **Clause 5 — ne pas confondre « minimal » et « bâclé ».** Eric est architecte système senior, a déjà publié sur les stores. Ne le traite pas en débutant.
2. `manifeste.md` — le pourquoi, et les patterns d'Eric (feature creep, v1 parfaite, attirance pour la richesse conceptuelle — elle se présente toujours en bonne idée).
3. `arbre-app.md` et `mon-arbre.md` — les deux arbres des fins : les fins de l'app / les disciplines d'Eric.
4. `grille.md` — **l'instrument.** La seule primitive qui *agit* : elle mesure les briques et déclenche le move.

## La structure

Scaffold stable qui survit au voyage `rooftop → forge → codebase → archives`. **La position du dossier EST l'état** — pas de timeline, pas de dates.

- `_commission/` — l'origine, la demande de Damien, et le fil de son usage. `brief-01-amorce` (l'amorce, non retouchée) + `brief-02-complement` (la commande enrichie par le 1er retour) + `regles-jeu.pdf` + `journal-damien` (log de com, verbatim Damien tagué `FD-NN` — un conduit, pas un lieu de traitement). Ce qui est confié **et écouté**.
- `_engagement/` — les primitives d'Eric, son « oui ». Le bundle de boot.
- `app/` — le construit, l'app RN / Expo managed. `changelog.md` (versions produit).
  - `app/docs/` — porte d'entrée `README.md`. Les **specs** dans `specs/` (source de vérité du build : `specs-techniques`, `modele-donnees`, `logique-comptage`, `cas-reference-score`…), l'**identité** dans `signature/` (porte : `reshape.md`), les **traces datées** dans `journal/`, et le registre `bugs.md` (`BUG-NN`).
  - `app/docs/claude_design/` — les commandes wireframes à Claude Design, **un dossier par round** (`1-alpha-core/`, `2-alpha-signature/`…), chacun avec son `brief/` (envoyé) et son `retour/` (revenu, confronté puis consommé).
  - `app/src/` — le code : `domain/` (logique pure, prouvée), `store/` (Zustand, source de vérité stockée), `screens/`, `components/`, `theme/`. `app/__tests__/` — les cas de référence du score. Règle de dépendance : `screens → store → domain`, jamais l'inverse.

## Où on en est

**Phase courante (13/07) : alpha-signature 0.2 BÂTIE — boucle d'intégration close.** La conception 0.2 (signée le 12/07) a été **implémentée par lots** en une journée, via une boucle **supervision / intégration** (briefs `journal/2026-07-13-brief-lot-*`, chaque lot relu en **porte ②** puis scellé) : **0** domaine · **1** scène · **2** voix · **3a** moyeu · **3b** mémoire (l'encoche s'affiche) · **3c** ménage + undo · **4a** frime + portes + échafaudage tokens. **107 tests verts, tsc clean, fidèle au signé à chaque gate.** La **marque branlée est signée : l'encoche `/` `//`** ; l'app est **renommée `GANG`**. **Reste, hors boucle :** le **vernis visuel 4b** (diff non commité — l'œil d'Eric + signer les 4 sièges), les **sons** (Jacques), le **ship** (rebuild + page, instance build). Détail et méthode : `journal/2026-07-13-transition-alpha-signature.md`. Versioning par ère : **`0.1.x`** = alpha-core (tag git `v0.1`) · **`0.2.x`** = alpha-signature.

On est **en forge**, plancher éprouvé et **alpha-core diffusée** aux potes (APK auto-hébergé, `dev.irimwebforge.com`, ex-`GoF Companion`) ; l'**alpha-signature (`GANG`) est bâtie**, elle partira au prochain rebuild. La première **vraie partie à 4** — le test du jalon « tenir la partie » — se joue à la première soirée réelle. Le fil avec Damien et la table est vivant ; le détail vit dans le socle (ci-dessous), pas ici.

L'état vit dans le socle, pas ici : le retour joueurs → `journal-damien` (verbatim `FD-NN`), les fins de l'app → `arbre-app`, la commande à jour → `brief-02-complement`, les bugs → `app/docs/bugs.md`, les versions produit → `app/changelog.md`, le journal transversal → `~/_cockpit/logs/dev.md`. Cette section est une **passerelle** : elle pointe, elle ne redouble jamais ces sources d'un récit horodaté.

Le gate actif est `forge → codebase`, 4 briques, **deux cochées** (Eric constate seul, ne l'assume jamais) : **montrer l'imparfait** ✅ (Damien a compris le geste seul) et **prouver la justesse** ✅ (62 tests verts, 100 % contre la logique) ; restent **tenir la partie** (une vraie partie à 4 jusqu'à 100, en conditions réelles — en test à la première soirée) et **écrire l'histoire** (l'axe récit — la partie laisse une trace ; cochable seulement au palier 2 / DB, le palier 1 en pose le germe). C'est Eric qui déclare les passages et règle les curseurs (pacte, clause 4).

La ligne de version : **`alpha-core-plus`** (plancher + anim frime + stats soirée + partage + persist) **diffusée** ; **`beta`** (DB / identité joueur / ligues / stats avancées + API) est la piste d'après, déjà spec'd (`specs-stats` §P2, `brief-ligue`). Le dev tourne en **trio** : supervision / intégration / déploiement.

## Posture

Rester à l'altitude de la question posée. Proposer, jamais imposer. Ne pas produire de contenu-app au rooftop (c'est du travail de forge). Droit au but, pas de mur de texte. Eric conduit.
