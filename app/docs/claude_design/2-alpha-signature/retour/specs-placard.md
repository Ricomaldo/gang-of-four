---
title: 'GANG — Specs placard (capture figée · Claude Design, passe 5)'
created: '2026-07-17'
updated: '2026-07-18'
version: 0.2.3
status: active
type: cd-spec
---

# GANG — Specs placard · « LE PLACARD »

> **Capture figée** de la spec précise revenue de Claude Design (17/07), via le
> **canal direct Design→Code** (`/design-login`, projet « Wireframes GANG app »).
> **Source vivante rendue** (pixel-vrai, éditable) :
> `https://claude.ai/design/p/c576dd43-2e49-4ef4-a049-497c87d8be6f?file=GANG+-+Specs+placard.dc.html`
>
> **Les valeurs LIVE vivent dans `app/src/theme/tokens.ts`** (source unique qui
> propage). Ce fichier = le **record** de ce que CD a livré + l'intention par
> écran. Il ne se met pas à jour quand Eric ajuste un token : c'est un instantané.
> Implémenté sur les 5 écrans le 18/07.

## 01 · La palette

**Le socle — noir / crème (partout, toujours) :**

| hex | rôle |
|---|---|
| `#1B1814` | encre — la mémoire, les traits, l'inverse |
| `#F2EDE0` | crème page — le fond, le papier |
| `#F7F3E8` | crème relief — le disque, surfaces relevées |
| `#6E675C` | gris murmure — labels secondaires, la voix calme |
| `#B7AF9E` | gris estompé — inactif, la ligne vierge, méta |
| `#8A8272` | pierre — texte 2ᵈ sur fond noir |

**Les chauds — du logo Gang of Four, LIVE uniquement :**

| hex | rôle |
|---|---|
| `#C0231F` | rouge — le meneur (le projecteur), branlée live |
| `#B3402E` | brique — revanche, légende branlée *(la cicatrice, seule chaleur tolérée sur la mémoire)* |
| `#E06B1A` | orangé — le crayon (manche éditable), rayonnement |
| `#F0A11C` | ambre — la lumière, halo disque, nom du meneur |
| `#D98573` | rouge clair — ‡ / ☞ sur fond noir (lisible sans crier) |

> **Règle d'or du chaud.** Le chaud ne se pose que sur ce qui est **vivant** → le
> **Round** seul (meneur, disque, manche éditable). La **mémoire** (stèle, feuille
> passée) reste strictement noir/crème. Une seule couleur chaude dominante par
> écran ; le reste en accent. Jamais un déluge.

## 02 · La typo & les marques

- **Anton** — l'affiche : wordmark GA/NG, totaux, trônes, manchettes. TOUJOURS
  capitales, letter-spacing 1–4.
- **IBM Plex Mono** — l'appareil : labels, grille de données, chrome, méta, cartouche.
- **Caveat** — le crayon : annotation manuscrite du live, usage **rare** (le crayon
  s'exprime surtout par l'orangé + le dashed).

**Marques typographiques (remplacent les emojis stock) :**
- **▲** pris (partie/manche gagnée) · **▼** rendu (perdue).
- **‡** la branlée — posée sur le **donneur** (le joueur à 0 qui a plié). *Extension
  implémentée : `‡` petite / `‡‡` grosse, pour garder la sévérité au coup d'œil.*
- **☞** le geste de la honte, désigne le dernier. Le **mot**, lui, s'écrit « le looser ».
- **La gloire n'a pas de glyphe** : l'inverse + la lumière (halo ambre) + le plus
  gros corps. Miroir volontairement **inégal** : la gloire crie, la honte se lit en creux.

## 03 · Les deux matières

- **Le crayon** (présent, léger, réversible) : cadre **dashed orangé**, chiffres
  gris, fond crème (option jaune pâle `rgba(240,161,28,.10)`). Éditable sans confirm.
- **Le gravé** (mémoire, lourd, définitif) : bande **inversée** (fond encre, texte
  crème), **inset shadow** (creusé), trait épais. Ça pèse — non éditable. *(RN ne
  fait pas d'inset-shadow ; approximé par un filet clair en tête.)*

## 04 · Les 4 écrans

**Accueil — 4b, le disque noir.** Cartouche bande noire (mono crème, ls 3). Le
**disque-GANG** : cercle Ø290, fond encre, **double anneau** (`0 0 0 4px crème,
0 0 0 8px encre`), GA/NG en Anton ~104px crème, line-height .85, 2 lignes. C'est
l'objet qu'on frappe → jouer. **Le logo Gang of Four n'est PAS ici.** « Tes gangs »
= liste, entête entre 2 traits 3px, **dernier joué = bande inversée** (revanche).

**Round — 4e, la chaleur.** Le seul écran chaud. Cartouche noir, nom du meneur en
**ambre**. Plateau ~70 %, grille 2×2 (traits 2px, bord haut 4px), pill = prénom
(mono 15px) + total (**Anton 96px**) vers les coins extérieurs ; **le meneur =
cellule inversée rouge `#C0231F`**, prénom crème, marqueur ◀. Centre : le disque =
**le logo Gang of Four** (Ø170, fond crème-relief, bord noir 5px, **halo orangé**
`0 0 36px rgba(224,107,26,.45)`), tap → frime. Zone du bas : aperçu feuille
(manche en cours = crayon dashed + ligne vierge). *Où le chaud se pose (verrouillé) :
meneur rouge · disque halo orangé · nom meneur ambre · crayon dashed orangé. Le
reste noir/crème.*

**Stèle — 3f, le monolithe.** La mémoire cross-parties, **strictement noir/crème**.
Une **dalle** encre qui monte du bas (radius haut, inset shadow + drop). **Le
champion** (gloire, en haut) : label « LE CHAMPION » mono ls 4 pierre, nom **Anton
58px crème**, « ▲ N parties prises ». **Le looser** (honte, plus bas) : nom Anton
34px gris `#8A8272`, « ☞ {nom} », « ▼ N fois dernier » brique. **Détail** : colonnes
**P▲ P▼ M▲ M▼ ‡**. **Socle = revanche** : bande brique `#B3402E`, Anton crème.

**Feuille — 3h, placard.** Modale qui monte du bas. Entête bande noire : titre
session **Anton 20px crème** « ÉTABLI · 8 JUIN » + ✕. Grille : entête colonnes mono
12px gris sous trait 3px ; manches mono 17px bold, trait 1px ; **TOTAL** trait 4px,
Anton 24px, le total du meneur **inversé**. **La branlée = le gravé** : bande
inversée (chiffres Anton 20px crème), le « 0 ‡ » du donneur en rouge clair `#D98573`,
légende mono 11px brique « ‡ … branlée de {nom} ! ». **Partager** : bande noire.

## 05 · La langue de la table & les invariants

**Copies scellées :** « on rejoue ? » (revanche) · « {prénom} gagne la manche »
(**jamais** « plie ») · « petite / grosse branlée de {prénom} ! » (petite < ~45,
grosse ≥ ~45 pts, **seuil à caler**) · « le looser » = le mot · **☞** = le geste ·
« le champion » · « les deux trônes » / « le monde étrange » (rare).

**Ce qu'on ne fait jamais :** zéro illustration (la signature est typo &
structurelle) · le logo Gang of Four vit **uniquement** au centre de la table · aucun
emoji stock · **pas de chaud sur la mémoire** · rien ne s'anime « pour faire joli ».
