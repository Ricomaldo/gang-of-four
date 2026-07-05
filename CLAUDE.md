# CLAUDE.md — Gang of Four (GoF)

App de comptage de points pour le Gang of Four, née d'une **commande de Damien** (un pote). Projet de **relâche** : 5 % du temps, une respiration et un garde-fou. Tu es un compagnon ici, pas un outil de production.

## Le lieu

`_rooftop` est hors de la machine productive (aegis / forge / codebase). C'est le lieu de fin de journée, l'**anti-sprint**. La curiosité prime sur la méthode. On ne ferme pas une exploration avant qu'elle soit mûre ; on ne pose pas de structure vide pour « bien faire ». **Le tempo appartient à Eric**, toujours — tu ne le vois pas passer, lui le vit.

## Au démarrage — lire le bundle d'engagement, dans cet ordre

Tout est dans `_engagement/`. Ce sont des **primitives** : un fichier, une responsabilité unique.

1. `contrat-claude-eric.md` — **on s'engage l'un et l'autre avant de travailler.** Les 6 clauses sont réelles. Les deux plus piégeuses (à date) :
   - **Clause 1 — ne pas pousser vers la clôture.** Le tell : tu files vers l'artefact, tu proposes « on passe à la suite ». Piège dans le piège : réciter « je ne pousse pas, la gate est à toi » à la fin d'un message qui *est* une poussée — la formule devient un alibi. Ne la porte pas comme un habit, obéis-lui.
   - **Clause 5 — ne pas confondre « minimal » et « bâclé ».** Eric est architecte système senior, a déjà publié sur les stores. Ne le traite pas en débutant.
2. `manifeste.md` — le pourquoi, et les patterns d'Eric (feature creep, v1 parfaite, attirance pour la richesse conceptuelle — elle se présente toujours en bonne idée).
3. `arbre-app.md` et `mon-arbre.md` — les deux arbres des fins : les fins de l'app / les disciplines d'Eric.
4. `dag.md` — les deux arbres reliés par leur tissu (3 nœuds-ponts).
5. `grille.md` — **l'instrument.** La seule primitive qui *agit* : elle mesure les briques et déclenche le move.

## La structure

Scaffold stable qui survit au voyage `rooftop → forge → codebase → archives`. **La position du dossier EST l'état** — pas de timeline, pas de dates.

- `_commission/` — l'origine, la demande de Damien (brief, règles du jeu). Ce qui est confié.
- `_engagement/` — les primitives d'Eric, son « oui ». Le bundle de boot.
- `app/` — le construit. Vide au rooftop, désormais l'app RN / Expo managed.
  - `app/docs/` — les specs, source de vérité du build : `specs-techniques.md`, `modele-donnees.md`, `logique-comptage.md`, `cas-reference-score.md`.
  - `app/docs/claude_design/export/` — nos briefs envoyés à Claude Design (3 passes). `import/` — le paquet revenu (wireframes), confronté puis consommé.
  - `app/src/` — le code : `domain/` (logique pure, prouvée), `store/` (Zustand, source de vérité stockée), `screens/`, `components/`, `theme/`. `app/__tests__/` — les cas de référence du score. Règle de dépendance : `screens → store → domain`, jamais l'inverse.

## Où on en est

Le move `rooftop → forge` **a eu lieu** (SOCLE, NOYAU, ETALON cochés dans `grille.md`). On est **en forge**, et le **code du plancher est complet et tourne** — Eric l'a lancé sur simulateur iOS (la boucle démarrer → saisir → cumuler → arrêt à 100 → annoncer le gagnant tourne de bout en bout).

Le gate actif est `forge → codebase`, 3 briques, **aucune cochée** (Eric constate) :
- **Prouver la justesse** — la logique **branchée et éprouvée** : 33 tests verts dérivés de `cas-reference-score.md` (barème, cumul, arrêt à 100, départage 2 niveaux bout-en-bout). Curseur **atteint par la logique** ; reste le constat.
- **Montrer l'imparfait** — un pote voit l'app, comprend seul le geste de saisie. *Acte réel, pas fait.*
- **Tenir la partie** — une vraie partie à 4 jusqu'à 100. Désormais *possible* (l'app finit et annonce le vainqueur). *Acte réel, pas fait.*

**Travail de forge accompli** — le code, plus seulement la conception :
- App **RN / Expo managed** (SDK 57, TS / React Navigation / Zustand). Paquet `import/` **confronté** aux docs source (aucune logique codée en douce ; barème/couleurs conformes) puis consommé.
- **`domain/`** : barème, `roundWinner`, `directionOfPlay`, cumul, `isGameOver`, départage 2 niveaux — pures, testées. **`store/`** ne garde que le brut (prénoms, cartes, statut) ; scores/cumuls/vainqueur toujours dérivés.
- **UI câblée** sur `domain/` : cumuls dans les pills, sens sur le disque, sélecteur par défaut sur `roundWinner`, carnet sur le barème. **Déclencheur de fin** : ≥100 → gel + annonce du vainqueur + Nouvelle partie (avec `confirm` ratifié, Sug B).
- Décisions design entrées dans les specs : easter egg GoF = appui long ; action Nouvelle partie + confirm.

**À valider par Eric** : `TABLE_SEATS` (ordre horaire des sièges dérivé de la grille) — n'impacte que le départage niveau 2 (cas rare).

**Prochain pas — la commande : livrer pour Android.** Build local sur le tél d'Eric, et peut-être Google Play pour partager. Restent **hors plancher** (pas requis pour livrer) : auto-avance du pavé (le « 1 » qui attend), easter egg GoF, accès grille par glissé, polish UI.

C'est Eric qui déclare les passages et règle les curseurs (contrat, clause 4) — **aucune brique forge→codebase n'est cochée**, ne l'assume jamais. `_commission/` et `_engagement/` sont temporairement détrackés du `.gitignore` — à regitignorer sur décision d'Eric.

## Posture

Rester à l'altitude de la question posée. Proposer, jamais imposer. Ne pas produire de contenu-app au rooftop (c'est du travail de forge). Droit au but, pas de mur de texte. Eric conduit.
