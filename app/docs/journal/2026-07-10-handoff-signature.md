---
title: 'Handoff — Nuit signature · identité GANG'
created: '2026-07-10'
updated: '2026-07-10'
version: 0.2.1
status: active
type: handoff-passe
---

# Handoff — Nuit signature · identité GANG

**Pour :** une instance à froid (ou Eric), **sans la conversation**. Ce doc +
le dossier `signature/` = tout ce qu'il faut pour reprendre. La conversation ne
survit pas ; ces fichiers, oui. La clarté ne doit reposer sur la mémoire de
personne.

**Contexte :** nuit du 9→10 juillet 2026, lendemain de la 1re vraie partie à 4.
On a forgé l'**identité** de l'app — **renommée GANG** — pas encore son UI.
Session arrêtée par Eric : trop de patinage de l'agent, méthode non tenue. Ce
handoff sauve ce qui a été posé.

---

## 1. État honnête — pas d'illusion de travail

- **Avancé :** l'identité (la colonne + les 5 piliers) et la **conception** de 3
  piliers sur 5 (2, 3, 4).
- **PAS avancé :** la méthode promise — *trancher l'UX **et** nommer l'UI pour
  chaque pilier, jusqu'à l'écran réel* — n'a **pas** été tenue. Sur l'axe qui
  compte (UI / écrans / flows), on est resté à **~1/10**. La discussion UI n'a
  **pas** commencé.
- **Risque nommé par Eric, fondé :** à l'intégration, un **diff ciblé** où le
  **code neutre actuel écrase l'identité** qu'on assume. Preuves en §4.

## 2. La couche identité — DURABLE dans `app/docs/signature/`

| Fichier | Pilier | Contenu | Maturité |
|---|---|---|---|
| `essence.md` | index + **1** | Colonne + 5 piliers + nom (GANG, triple sens) + parti pris (pour qui). **C'est le manifeste/index.** | propre |
| `frime.md` | **2** | L'anim frime, signature #1 (disque central, tap, 3 sons surprise, « Gaaang ooof foooooour »). | **mûr** |
| `copy-deck.md` | **3** | La voix (2 registres, 3 scopes, chaînes). *À renommer `voix.md`.* | scratch |
| `palmares.md` | **5** | Le gang : grille emoji, scopes, tie miroir, monde étrange. *À renommer `gang.md`.* | scratch |
| `branlee.md` | **4** | La branlée : mémoire sélective, cérémonie, crayon/gravé, POV donneur. | scratch |

**Les 5 piliers.** Colonne : **« une grande gueule qui n'oublie rien. »**
1. Le mot dit tout · 2. L'app gueule, la table joue · 3. Ici les points sont une
honte · 4. Tout s'oublie sauf la branlée · 5. On ne rejoint pas un gang, on le
mérite.

### ⚠ Corrections aux ancrages périmés de `essence.md` (footer)
Décidés APRÈS l'écriture d'`essence.md`, son footer est en partie faux :
- la branlée est **binaire** (branlée ou rien — **pas** de petite/grosse), dès
  **~30 pts cumulés** sur la manche, seuil ajustable ;
- **💩 = partie perdue** (ex-**❌**, pas ex-🐌) ; **🐌 reste** = looser du gang
  (celui qui a le plus de 💩).

## 3. Décisions signées (rappel dense)

- App renommée **GANG** (triple sens : la boîte · le carré · le roster de 4).
- **Audience assumée** : les hardcore qui veulent glorifier leurs parties. Le
  joueur crayon-papier n'est **pas** le public.
- **Opinionated sur l'événement** (la branlée compte, l'app la proclame),
  **agnostique sur la morale** (gloire/hantise = le siège du joueur).
- **Gang = roster** (mêmes 4 → même palmarès, inter-sessions ; 1 joueur change →
  autre gang). **Session** = temps+lieu, contenant, **mot interdit en UI**.
- **La revanche** fait naître le gang (palmarès dès la 2ᵉ partie). Zéro péage :
  défaut = jouer.
- Grille emoji : manche ⭐️/💥 · partie 🏆/💩 · gang **✌️** champion / **🐌**
  looser. Seuls **1er et dernier** comptent (2ᵉ/3ᵉ = rien).
- **✌️ et 🐌 = miroirs indépendants** → un même joueur (le all-in) peut tenir les
  deux : le « monde étrange », assumé. Tie ✌️ : 🏆 → ⭐️ → branlée → tenant reste.
- **Branlée** : la manche-cérémonie. Détectée au calcul → **alerte + confirmation
  = cérémonie** (la friction magnifie). Registre : présent clément (édit dernière
  ligne, sans confirm) / mémoire gravée (grille + screenshot, irréversible).
  Emoji **💪 candidat, NON scellé** (« pas mal », pas « oui »). POV **donneur**
  (+1), preneurs par déduction.

## 4. Conception NON encore filée — capturée ici pour ne pas la perdre

### L'accueil (pilier 5 — décidé, à verser dans `gang.md`)
- La **porte de GANG = le disque signature** (le même que la frime). On ouvre →
  le disque, grand, centré, **tappable = il rugit**. Object-first : l'app ouvre
  sur sa **voix**, pas sur un menu.
- Défaut → **on joue** (les 4 sièges ; `SetupScreen` cesse d'être un péage,
  devient *le chemin jouer*). **L'étagère des gangs** derrière = le *lieu de
  retour* qui lève le « flow enfermant ».
- Pas un objet neuf : **le Hub promu** — sorti de la grille pour être d'abord
  l'accueil, puis le cœur de la manche.

### Carte d'effacement (où le code actuel aplatit l'identité — vérifié)
- `SplashScreen` : 1400 ms de logos passifs → `Setup`. **Pas d'accueil ; 1er
  geste = nommer les 4.**
- Frime = **long-press caché** (`RoundScreen` l.108) ; Hub = **bouton-texte
  d'état**. Pilier 2 veut disque central, tap, asset GOF.
- `Hub.tsx` l.5 : *« Pas de SVG, pas d'emoji »* — **principe contraire** à
  l'identité.
- Voix neutre ; **« {prénom} mène » n'a aucun bandeau** ; le **flow enfermant**
  est l'alert `RoundScreen` l.62-79 (« Rejouer avec qui ? / Nouveaux / Mêmes »).
- Branlée / gravé / palmarès-hiérarchie : **inexistants** — des surfaces neuves,
  pas des diffs.

### Discipline anti-effacement : **reshape vs diff**
- **Reshapes** (la forme — l'identité y vit ou y meurt) : l'accueil · le Hub →
  disque-frime · le bandeau standing · la cérémonie+gravé · le palmarès-gang.
- **Diffs** (cosmétique, sûr) : ❌→💩 · chaînes neutres→voix · long-press→tap.
- Règle : un reshape **remplace** la forme de l'écran, il ne se bolt pas dessus.
  Sinon le carnet neutre gagne. « Ne pas patcher le carnet — le refaire gueuler. »

## 5. Méthode à tenir (elle n'a PAS été tenue)

Pour **chaque** pilier : trancher la face **UX** (comportement) ET nommer la face
**UI** (langue visuelle), **jusqu'à l'écran réel** (flows, ajustements
screens/composants). NB : sur les piliers mûrs (2, 4), UX et UI **fusionnent** —
un seul geste. **Chaque keystone doit gagner une section « à l'écran »** (son
reshape des écrans réels) : c'est le **pont manquant**.

## 6. Fils ouverts

- **UI / écrans** : seuls pilier 2 (mûr) et l'accueil (esquissé) touchent
  l'écran. Piliers 1, 3, 5 : UI non faite. UX : 3 et 4 conçus, 5 partiel, 1 =
  discipline.
- **Branlée** : emoji **💪 non scellé** ; mot de la **cérémonie** (copy) ; entrée
  dans le **tie**.
- **Structure** : renommer `copy-deck→voix`, `palmares→gang` ; faire d'`essence`
  l'index qui **lie** les keystones ; verser l'accueil (§4) dans `gang.md`, le
  Hub-frime dans `frime.md`, le bandeau dans `voix.md`, la cérémonie/gravé dans
  `branlee.md` ; corriger le footer d'`essence` (cf. §2).

## 7. Reprise — pour l'instance à froid

1. Lis `signature/essence.md` puis les 4 keystones, **avec les corrections §2**.
2. Lis ce handoff §4 (conception non filée) et §5 (la méthode).
3. **Tiens la méthode** : UX + UI par pilier, **jusqu'à l'écran**. Compteur
   honnête, pas d'illusion de travail.
4. **Discipline reshape/diff** (§4) : ne patche pas le carnet, refais-le gueuler.
5. Premier reshape à concevoir en entier : **l'accueil** (la porte n'existe pas).
6. Aligne la structure (§6) quand tu touches ces fichiers — assumée, pas bricolée.
