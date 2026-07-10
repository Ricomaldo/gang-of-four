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

| pilier | passe UX | passe UI |
|---|---|---|
| **1 · le mot dit tout** | *discipline transversale* (voir §3, principes) — pas une passe d'écran |
| **2 · l'app gueule** (Gong) | ✅ mûr | 🟡 objet **nommé** (`Gong` ✅), forme/layout différés |
| **3 · les points, une honte** (voix) | 🟡 posé (copy-deck + 3 surfaces) | 🟡 surfaces identifiées, à **signer** + dessiner |
| **4 · tout s'oublie sauf la branlée** | ✅ conçue | 🟡 crayon/gravé proposé, à signer + dessiner |
| **5 · on mérite le gang** (palmarès) | ✅ conçue | 🟡 étagère + grille identifiées, accueil esquissé |

**Socle transversal (10/07) :** méthode ✅ · principes 🟡 · langue (`Gong` ✅ ;
*statut / annonce / étagère* à signer) 🟡 · 1re fiche-écran (accueil) 🟡.

**Lecture honnête :** la **passe UX est largement posée** ; la **passe UI est à
son commencement** (rien de *signé + dessiné* sauf le nom du `Gong` ; wireframes
non commencés). Le 10/07 a coulé le **socle** de la passe UI. *On ne recommence
pas : l'UX est finie, l'UI est amorcée.*

---

# 2 · La méthode

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
| **le statut** | murmure · calme | **persistant**, ambient, discret — l'état continu | « {prénom} mène » | *à signer* |
| **l'annonce** | éclat · fort | **transitoire** — surgit, domine, s'efface ; intensité variable | « colle une branlée », « GANG ! » | *à signer* |
| **le palmarès** | portée gang | un **lieu durable** qu'on visite | « le gang est à {prénom} » | *l'étagère* (codename) |

**Le `Gong` est double** : un **objet** qu'on frappe *et* la surface de l'**éclat
maximal** (le carré → « GANG ! », la frime).

## Les organes (le physique)

| organe | nom | statut | rôle |
|---|---|---|---|
| l'objet-voix central | **`Gong`** | **✅ signé** | frappé → rugit (entrée 1× + carré rare) ; **renomme l'ancien `Hub`** |
| l'interstice central | *le disque* | layout | trou au croisement des quadrants (Round) — **pas** l'objet |
| la grille des joueurs | *les quadrants* | layout | les 4 cellules 2×2 |
| le lieu de retour + palmarès | *l'étagère* | codename | rosters joués, revanche, palmarès |

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

## Reste à signer / trancher

- **noms de surfaces** : le **statut** · l'**annonce** · l'**étagère**.
- **F1 · la dualité-mère** : murmure/éclat ≡ crayon/gravé (pilier 4) ? Si oui,
  GANG tient sur **une seule** dualité — la colonne des wireframes. *Ouvert.*
