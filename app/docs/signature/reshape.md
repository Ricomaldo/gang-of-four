---
title: 'GANG — Reshape (hub)'
created: '2026-07-10'
updated: '2026-07-10'
version: 0.2.1
status: active
type: reshape-hub
---

# GANG — Reshape · le hub

> **Le seul fichier d'outillage du reshape.** Fusionne `00-carte` + `reshape-methode`
> + `langue-ui` (fondus le 10/07 pour dégonfler l'inflation). Trois sections :
>
> 1. **La carte & l'état** — où sont les fichiers, où en est le chantier.
> 2. **La méthode** — comment on traduit l'identité en écrans.
> 3. **La langue** — les organes, les surfaces, les principes.
>
> L'**identité** (essence + 4 piliers) est ailleurs — c'est la *source*. Ici,
> c'est l'*atelier*.

---

# 1 · La carte & l'état

## Le dossier `signature/` — 2 familles

**● IDENTITÉ (le *pourquoi* / le *quoi*) — intention : la mémoire des décisions.**
Le scribe ; survit aux changements d'instance.

| fichier | tient | statut |
|---|---|---|
| `essence.md` | LE manifeste : colonne + 5 piliers + nom + audience. La source. | propre |
| `frime.md` | pilier 2 — le **Gong** / la frime | mûr |
| `copy-deck.md` | pilier 3 — la voix (registres × portées + chaînes) | scratch |
| `branlee.md` | pilier 4 — la branlée (mémoire sélective, cérémonie, crayon/gravé) | scratch |
| `palmares.md` | pilier 5 — le gang (trophées, ✌️/🐌, départage) | scratch |

**○ RESHAPE (le *comment*) — intention : préparer la traduction** vers les
wireframes (Claude Design) et l'intégration (Claude Code). De l'outillage, pas de
la mémoire.

| fichier | tient | statut |
|---|---|---|
| `reshape.md` *(ce fichier)* | la carte + l'état · la méthode · la langue | actif |
| `ecrans/01-accueil.md` | 1re fiche-écran — la porte | draft |

*Le fil : `essence` (source) → les 4 piliers la détaillent → `reshape` dit
comment traduire → `ecrans/` sont les livrables, un par écran.*

## L'état du chantier

> Cadre d'Eric : **5 piliers × 2 passes (UX puis UI) = 10 cases.** Plus un
> **socle transversal** (méthode + langue + principes), préalable à la passe UI.
> Légende : ✅ posé · 🟡 amorcé · ☐ pas commencé.

| pilier (handle) | passe UX | passe UI |
|---|---|---|
| **1 · Le Mot** | *discipline transversale* (voir §3) — pas une passe d'écran |
| **2 · La Frime** (le Gong) | ✅ mûr | 🟢 langue OK (`Gong` ✅) → forme = **2a** |
| **3 · La Voix** (cartouche + annonce) | 🟡 posé (copy-deck) | 🟢 langue OK (cartouche ✅ ; annonce concept nailé) → forme = **2a** |
| **4 · La Mémoire** (crayon/gravé) | ✅ conçue | 🟡 crayon/gravé posé → forme = **2a** |
| **5 · Le Gang** (carnet + vue gang) | ✅ conçue | 🟢 modèle réglé (vrac=carnet, vue gang, roster-scoped) → forme = **2a** |

**Lecture honnête (11/07) :** la **passe UX est posée** ; la **langue (temp 1)
est quasi bouclée** — signés `Gong`, `cartouche`, `carnet` ; concepts nailés pour
l'annonce et la vue gang (mots cueillables en 2a). On **entre en temp 2**.

## Temp 2 — tracker (les formes)

**Cadre bendé (11/07)** : on a plongé dans le **flow de saisie** (2b) car c'est le
cœur — et le flow s'est révélé le **squelette** où les organes (2a) s'**accrochent**.
Donc 2a et 2b avancent **ensemble**, pas en séquence. Coché = *fait*.

**Le squelette — le battement + la scène** *(cf. §2)*
- ✅ **le plateau + la zone du bas** (la scène)
- ✅ **le battement** ①→④ **complet** : entrée (tap la pill) · valider (« = ») · ④ (*rareté = intensité* · cérémonie · **fin de partie** = final plein plateau, miroir gloire/💩 → scelle → gravé).

**Le gravé — la mémoire du gang** *(cf. §2)*
- ✅ l'**après-partie** (porte : scelle → revanche / consulter)
- ✅ la **revanche** (reboucle sur ①, mêmes 4)
- ✅ la **vue gang / palmarès** (2 trônes ✌️/🐌 + détail · monde étrange)
- ✅ la **feuille** (crayon/gravé, la branlée pèse)
- ☐ l'**accès à froid** (depuis l'accueil : trouver un gang) → *phase écrans*

**Les organes — formes transversales**
- ✅ le **cartouche** (La Voix) · ✅ le **crayon/gravé** (La Mémoire — feuille + cérémonie) · ✅ la **cérémonie**
- 🟡 l'**annonce** (La Voix) — placée ; reste le rendu léger *(+ mot à cueillir)*
- ✅ le **Gong** (La Frime) — objet-voix central : **un objet, deux tailles** (porte *dominante* · plateau *partagé*), **même geste** (frappe → rugit, tethered)
- ✅ le **wordmark** (Le Mot) — le mot, **typographique, jamais illustré** (porte + titre gravé)

**Puis les écrans** *(assemblage — ils composent les organes)*
- ☐ accueil · ☐ Setup · ☐ Round · ☐ gravé (l'accès)

---

# 2 · La méthode

## Temp 2 — cadrage ÉPINGLÉ (le contrat)

> On est en **temp 2 : les formes.** Ce bloc est le contrat à **relire à chaque
> pièce** — le cadre se tient par structure, pas par mémoire (« borner le moment
> plutôt que forcer la volonté »).

**🎯 Objectif — traduire la langue en formes, transversal d'abord :**
- **2a · formes transversales** = donner sa forme à chaque *pilier incarné*, **hors
  de tout écran**. Les 2 mots restants (annonce, vue gang) s'y cueillent.
- **2b · formes d'écran** = chaque écran **compose** les transversaux + son
  spécifique. Assemblages, pas inventions.

**Les piliers = les unités de conception :**

| pilier | handle | incarnation transversale (2a) |
|---|---|---|
| 1 | **Le Mot** | le wordmark GANG + « jamais illustré » |
| 2 | **La Frime** | le **Gong** |
| 3 | **La Voix** | le **cartouche** + l'**annonce** |
| 4 | **La Mémoire** | le **crayon / gravé** |
| 5 | **Le Gang** | le **carnet** + la **vue gang** |

**🛠 Règles :** séquence (forme depuis le pilier d'abord, **code fermé**) → tag
(hérité/reshapé/neuf) → un reshape *remplace*. Gabarit strict (Rôle · Forme ·
États). **Une pièce à fond** avant la suivante. **Forme ≠ rendu** (pas de
couleur/ombre : ça, c'est plus tard).

**⚠️ Risques → gestes vérifiables :**
1. le code commande → *code fermé d'abord.*
2. sauter au rendu/UI → *zéro couleur dans la fiche.*
3. illusion de travail → *le tracker (§1), coché = **fait**.*
4. feature creep → *étiquette ornement / candidate.*
5. trancher ta carte → *je pose en **fork**, tu signes.*

Et : je **nomme ma dérive** au lieu de la jouer. **Dev gelé** — on produit des
**fiches**, pas du code. Grill dispo (ni systématique ni évité).

## Le contexte qui change tout

On n'est **pas en conception** (greenfield). L'app existe, tourne, est prouvée
(62 tests, plancher diffusé). On est en **reshape post-soirée** : affirmer la
signature sur un objet debout. Le livrable de manuel (user flows + IA + wireframes
à blanc) serait un *retour en arrière*.

**La hantise d'Eric** (fondée) : que le code existant *commande*, et que l'UI se
réduise à des diffs ciblés sur le carnet neutre. La méthode est bâtie *contre* ça.

## La frontière UX / UI / contenu

- **UX** = comportement et structure. *Quoi, dans quel ordre, comment ça réagit.*
  → flow, états, forme (squelette).
- **UI** = surface et langue visuelle. *À quoi ça ressemble, ce qui se réutilise.*
  → tokens, composants.
- **contenu (la voix)** = fil transversal → vit dans `copy-deck.md`.

## Les 5 étapes (le fil, pour ne pas le reperdre)

1. **← les principes + la langue** (transversal, §3) — nommer organes et rôles.
2. **par écran · la forme depuis le pilier** (à blanc, code fermé).
3. **par écran · le tag du code** — hérité / reshapé / neuf ; y poser les noms signés.
4. **par écran · le reshape** — la forme remplace.
5. **au bout · wireframes + variantes** (Claude Design).

## La règle de séquence — l'anti-« le code commande »

Pour chaque écran, dans cet ordre strict :

1. **La forme naît du pilier** — on dessine depuis l'identité, à blanc. Le code
   n'est **pas ouvert**.
2. **Puis on ouvre l'écran actuel** — on tague chaque zone : **hérité** (le neutre
   qui survit) · **reshapé** (le neutre que la signature remplace) · **neuf**.
3. **Un reshape *remplace*, il ne se bolt pas.** Si une zone ne peut être que
   patchée, c'est qu'on a ouvert le code trop tôt.

Le code est **consulté en dernier.** C'est la colonne ; le gabarit n'en est que
la trace.

## Le gabarit — taillé au strict (une fiche par écran)

Clause 4 du pacte appliquée *au livrable* : « ce qui ne doit pas manquer », pas
« ce qui serait bien ».

- **Cœur (ne doit pas manquer)** : *Rôle signature* · *La forme* (wireframe
  annoté hérité/reshapé/neuf) · *Les états* (où l'identité de GANG vit le plus).
- **Conditionnel** : *Flow* — seulement si la signature déplace le chemin.
- **Pointeurs (pas des sections à remplir)** : *Voix* → pointe vers `copy-deck` ·
  *Composants* → tombe du dessin de la forme.

## État existant par écran (code lu le 10/07 — pour l'étape 3)

| Écran | Existe | La signature vise |
|---|---|---|
| **Splash** | 2 logos 1400 ms → Setup | la **porte** = objet-voix (le `Gong`), tappable |
| **Setup** | 4 prénoms + palmarès ; péage | cesse d'être un péage → *le chemin jouer* ; étagère |
| **Round** | quadrants + Hub central ; frime = long-press caché | `Hub` → `Gong` (tap) ; le **statut** ; la voix |
| **ScoreEntry** | numpad + sélecteurs + Valider ; cérémonie absente | la **cérémonie** branlée au calcul |
| **ScoreGrid** | carnet + palmarès ; neutre, ❌ | **gravé** (crayon/gravé) ; palmarès → gang |

## L'architecture cible — le plateau + la zone du bas *(11/07)*

Le point qui débloque la Voix : les écrans pleins (Round / saisie / carnet) se
**cachaient** l'un l'autre → aucune scène stable pour le cartouche ni les
annonces. La cible **casse le plein-écran** :

- **le plateau** *(= la table, ✅ signé)* — contenant UI **clairement stylé** des
  quadrants + disque + pills. Un style de contenant net **suffit** à dire « ta
  place est au sud » : plus besoin du plein écran pour l'affordance. Position :
  **en haut, ~50 %, persistant** (même place en Setup et en Round ; aujourd'hui
  Setup = 50 %, Round = 100 % → on unifie à 50 %).
- **la zone du bas** *(~40 %, un **conteneur** — nom pas forcé)* — **n'est PAS le
  tableau de score** (le plateau le fait). Rôle premier : **la saisie**. Porte
  aussi, selon le moment : la **feuille** (peut s'agrandir pour consulter) · le
  **palmarès** · le clavier de noms. **Contenu flou, flow-dépendant** — se pose
  dans le flow de saisie, pas dans l'abstrait. *(Les annonces, elles, montent sur
  le **plateau**, pas ici.)*
- **saisie unifiée** *(geste **observé** : Bruno, soirée 01 — bloqué alors par
  l'easter-egg sur la pill, **libéré** par le déménagement de la frime dans le
  Gong central)* : on **tape la pill** d'un joueur *sur le plateau* → le numpad
  (3×4) monte dans la zone du bas. *(Ouvert : le tap-saisie vient de la **pill**
  ou d'une **ligne vierge** de la feuille ? — duplication à trancher dans le
  flow.)*

**Ce que ça résout :** le plateau **reste** → le cartouche vit au-dessus, les
annonces éclaboussent le plateau, la cérémonie s'y joue ; seule la zone du bas
change. La Voix a enfin une scène. *Le transversal a fait son boulot : il a
révélé que le plein-écran devait sauter.*

## Le gravé — la mémoire du gang *(11/07, en cours)*

Le territoire **d'après le cœur** : ce qui reste des parties, inter-sessions.
Modèle en §3 (vrac = carnet · vue gang · roster-scoped, zéro id individuel).

- **L'après-partie** *(porte du gravé — forme validée)* : le final retombe → la
  **feuille se scelle** (entre dans le carnet du gang) → **deux portes,
  asymétriques** (défaut = jouer) : **la revanche** (grande, par défaut — rejouer
  mêmes 4, prénoms gardés → **reboucle sur ①** ; le gang se forme *en silence*,
  sans formulaire) · **consulter** (discrète — carnet / palmarès). *Placement à
  voir (plateau ?).*
- **La revanche** = quasi triviale : nouvelle partie, même roster, retour au
  battement.
- **La vue gang / le palmarès** (consulter) *(base validée)* : le tableau
  d'honneur du gang, il **pèse** (gravé). **Deux trônes en tête** — ✌️ champion /
  🐌 looser, miroir permanent — + le **détail** par joueur (🏆 💩 ⭐️ 💥, branlées).
  Le **monde étrange** (même joueur = les 2 trônes) est **proclamé**, pas caché.
  Reshape de `Palmares.tsx` : les titres **hissés** de l'annotation au trône.
- **La feuille** (l'atome — reshape de `ScoreCarnet`) *(direction validée)* :
  grille manches × joueurs + totaux, à **deux matières** — le **crayon** (léger,
  la partie en cours, une seule ligne éditable = la dernière) / le **gravé**
  (lourd, scellé : les branlées en direct, toute la feuille après la fin). **La
  branlée pèse** (relief, marque). C'est **La Mémoire (crayon/gravé) rendue
  visible** — le rendu fin (l'épaisseur exacte) plus tard.

## Le battement de saisie (le cœur) *(11/07)*

*Saisir → calculer → afficher* = le cœur ; le reste = fioritures voulues,
**accrochées aux temps** ci-dessous (le battement rend leurs crochets clairs).

- **① manche vierge** — le plateau montre les 4 + leurs totaux.
- **② l'entrée** *(✅ nailé — le geste de Bruno)* — tap une **pill** → elle
  s'allume + le numpad (3×4) monte dans la zone du bas → le nombre s'affiche **sur
  la pill** (l'œil reste au plateau) → tap la suivante (**ordre libre**) → 4/4.
  **Remplace les `SeatSelectors`** (fini les pills dupliquées). Rappel écrit :
  *exactement un à 0* = celui qui plie.
- **③ valider → calcul** *(✅ nailé)* — le numpad **est une calculette 3×4** :
  0-9 + **del** + **« = »** ; le « = » *est* le valider, qui déclenche le calcul,
  actif à 4/4 (un seul à 0). **Auto impossible** (une main = 1-2 chiffres → l'app
  ne peut jamais savoir si c'est fini) → le « = » volontaire est une *nécessité*.
  Barème par paliers, **prouvé** (`logique-comptage`). *(Ouvert : la marge autour
  du numpad — espace négatif ou à réutiliser.)*
- **④ affichage + annonces** *(principe validé : **rareté = intensité**)* — totaux
  mis à jour sur les pills. L'app **claque le plus fort** (le titre du moment), le
  **cartouche absorbe le reste** (se repose sur le nouvel état) — *pas de
  cascade*. Échelle : *plie la manche* (chaque manche) = **discret** (la pill
  respire) · *passe devant* = **flash léger** · *branlée* = **cérémonie** (arrête
  tout) · *fin 100* = **final**.

**Crochets de fioritures :** le « 0 » de ② → *« plie la manche »* en ④ · la
**cérémonie branlée** au calcul (③→④, cf. `branlee.md`) · *passe devant / gagne /
💩* en ④.

**La cérémonie (branlée, ④) — forme validée :** plateau **figé** + surdominant
(projecteur sur la manche) → **dialogue à 2 sorties** : *corriger* (le **crayon**,
réversible) / **graver** (le **gravé**, scellé, irréversible). C'est le point de
rencontre **La Voix ∩ La Mémoire** (l'annonce *et* le passage crayon → gravé,
pilier 4). Mot du bouton « graver » = **provisoire** (à cueillir avec *annonce* et
*vue gang*).

**La fin de partie (④, le final) — forme validée :** quelqu'un touche **100**
(`cas-reference-score`) → la partie se **fige**, le final prend **tout le plateau**
(climax, la grosse cousine de la frime) : le **vainqueur** (score le plus bas) en
gloire (poing levé, projecteur) + le **dernier** au **💩** (le doigt) — le
**miroir côte à côte**. Puis la feuille se **scelle** (gravée) → **deux portes** :
**revanche** (mêmes 4 → le gang se forme) ou **consulter** (carnet / palmarès).
*Ces deux portes = le **gravé**, prochain chantier.*

---

# 3 · La langue

## Du contenu aux surfaces (le geste pro)

On ne nomme pas les organes au hasard. On part du contenu **déjà modélisé** dans
`copy-deck.md` — chaque chaîne porte un **registre** (murmure / éclat) et une
**portée** (manche / partie / gang) — et on le **mappe à des surfaces**.
*Content model → surface model.* Les surfaces se **déduisent**, ne s'inventent pas.

## La voix → trois surfaces

Pas une bannière unique : **une surface par registre.** Le murmure et le
rugissement sont des surfaces **différentes** de la **même** voix.

| surface | registre | comportement UX | exemples | nom |
|---|---|---|---|---|
| **le cartouche** *(ex-statut)* | murmure · calme | **persistant**, ambient, discret — le récitatif en marge (« pendant ce temps… ») | « {prénom} mène » | **✅ signé** |
| **l'annonce** | éclat · fort | **le flash officiel** : projecteur + rugissement + sceau (« légitimité univoque »). **Miroir :** gloire = avec son, poing levé, *« force le respect »* / honte = sans son, le doigt qui montre, *« ne peut pas se cacher »*. L'asymétrie du son = la colonne (bruyant dans l'instant, impitoyable en silence). | « colle une branlée », « GANG ! » | *concept nailé ; mot à cueillir (tend vers « le jugement / verdict »)* |
| **le palmarès** | portée gang | un **lieu durable** qu'on visite | « le gang est à {prénom} » | *l'étagère* (codename) |

**Le `Gong` est double** : un **objet** qu'on frappe *et* la surface de l'**éclat
maximal** (le carré → « GANG ! », la frime).

## Les organes (le physique)

| organe | nom | statut | rôle |
|---|---|---|---|
| l'objet-voix central | **`Gong`** | **✅ signé** | frappé → rugit (entrée 1× + carré rare) ; **renomme l'ancien `Hub`** |
| l'interstice central | *le disque* | layout | trou au croisement des quadrants (Round) — **pas** l'objet |
| le contenant (**la table**) | **le plateau** | **✅ signé** | contient les **quadrants** + le **disque** + les **pills** ; UI clairement stylé ; en haut ~50 %, persistant (cf. archi §2) |
| la grille des joueurs | *les quadrants* | layout | les 4 cellules 2×2, **dans le plateau** |
| la zone sous le plateau | *la zone du bas* | à nommer | ~40 % ; **swappe** (numpad · clavier noms · feuille · palmarès — idées ouvertes) |
| le gravé (mémoire du gang) | *le vrac + la vue gang* | modèle (« étagère » **abandonné**) | **le vrac** = toutes les feuilles (= « carnet » ✅) ; **la vue gang** = un filtre « les 4 mêmes » (une *vue*, pas un objet) |

*« La gueule » (pilier 2 ; colonne) est **garée** — réutilisable ailleurs.*

## Les principes

- **Pilier 1 · le mot dit tout** *(discipline transversale — sa maison, faute de
  mécanisme)* : **on n'illustre jamais ce que le mot porte.** Aucun feutre, aucun
  « Parrain » à l'écran ; la swagger est dans le ton et le mot GANG. Police la
  voix et le visuel.
- **P1 · Object-first** — ✅ posé. L'app ouvre sur son objet-voix (le `Gong`),
  jamais sur un menu ni un formulaire.
- **P2 · Murmure / éclat** — *concept posé, noms de surfaces à signer.* Deux
  registres, trois axes : **temporalité** (permanent / transitoire), **hiérarchie**
  (discret / dominant), **style** (fin / fort). Murmure = le **statut** ; éclat =
  l'**annonce** (la frime en est le maximum).

## La dualité-mère — crayon / gravé *(confirmée 10/07)*

L'axe du **temps / de la permanence** — la colonne de GANG (enterre l'ancien
« F1 », qui polluait en mélangeant deux axes). Lue par les **questions du
joueur** (la curiosité) :

- **crayon = pendant la partie** — live, réversible, effacé après :
  *qui mène ? · combien j'ai de points ? · qui donne sa carte ?*
- **gravé = après** — le record permanent, sur deux niveaux :
  - *la partie :* qui a gagné ? · combien de manches ?
  - *le gang (au-dessus) :* combien de victoires ? · le champion en titre ? ·
    le plus gros looser ?

À **distinguer de murmure / éclat**, qui est l'axe du **volume** (et vit surtout
dans le crayon, pendant le jeu). Le seul éclat qui **passe au gravé**, c'est la
**branlée** (pilier 4) — le pont d'un axe à l'autre.

## Reste à signer

- *Signés : **`Gong`** (objet) · **le cartouche** (statut).*
- **l'annonce** — **concept nailé** (le flash-jugement, miroir gloire/honte,
  asymétrie du son) ; **le mot se cueille plus tard.** Pas un blocage.
- **le gravé — modèle** *(réglé 11/07)* : « étagère » **abandonné** (on ne range
  pas des *vues*). **le vrac** = toutes les feuilles = le **carnet** ✅
  (`ScoreCarnet` → *feuille*). La **vue gang** = filtre « les 4 mêmes » (une vue).
  **Identité = A** : le gang = **un ensemble de prénoms**, zéro id individuel — le
  palmarès est **roster-scoped**, donc un joueur sous deux surnoms dans deux
  rosters = deux gangs distincts, **aucune réconciliation** (non-problème, fidèle
  au 08/07 : le collectif est l'unité, l'individu n'existe pas). *Reste : le mot
  de la vue gang — cueillable plus tard.*
