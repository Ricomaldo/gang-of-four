---
title: 'GANG — Transition : la boucle d''intégration close, ce qui reste'
created: '2026-07-13'
updated: '2026-07-13'
version: 0.2.0
status: active
type: transition
---

# Transition — l'alpha-signature bâtie, la suite

> **Log de clôture du soir (13/07).** La conception 0.2 (signée, close le 12/07) a
> été **implémentée par lots** en une journée, via une **boucle supervision /
> intégration**. Ce doc dit **où on s'arrête**, **comment on a travaillé** (pour
> reprendre pareil), et **ce qui reste hors de la boucle**.

## Ce qui est bâti — 0 → 4a, scellé

L'app est **fonctionnellement complète**. Chaque lot : un brief (`journal/
2026-07-13-brief-lot-*`), une instance d'intégration jetable, une **porte ②** de
relecture (tests + diff vérifiés sur pièce), un seal, un commit.

| lot | ce qu'il a posé | gate |
|---|---|---|
| **0** | le domaine (detectBranlee, miroirs ✌️/🐌 décroisés + tenant par rejeu, le **vrac** stockage neuf) | 82→ tests verts, zéro UI |
| **1** | la **scène** — le nouveau Round (nommer/jouer/saisir en états, le battement, keepAwake) | partie jouable |
| **2** | la **voix** — cérémonie branlée (2 sorties) + final (son gloire / silence honte) | branlée→cérémonie, fin→final |
| **3a** | le **moyeu** — accueil (disque-GANG), nav hub-and-spoke, tes gangs, renommer | app navigable |
| **3b** | la **mémoire** — stèle (2 trônes dérivés) + feuille (**l'encoche `/` `//` se rend**) + partage | une partie d'hier se rouvre |
| **3c** | **ménage** (code mort, `gofCount` requis, `soireeStorage→vracStorage`) + **undo crayon** | tests verts + correction |
| **4a** | la **frime** (Gong tap→anim+gofCount, rugissement) + portes final (corriger/consulter) + **échafaudage tokens** | Gong+portes+tokens réglables |

**107 tests verts · tsc clean · domaine prouvé intouché · fidèle au signé à chaque
gate.** La **marque branlée est signée : l'encoche `/` `//`**. L'app est **renommée
`GANG`** (`app.json`, nom d'affichage ; slug/bundleId/version inchangés).

## Comment on a travaillé — pour reprendre pareil

- **Supervision (une instance, l'overview) ↔ instances d'intégration (jetables, une
  par lot).** Deux portes : ① le brief auto-suffisant (validé par Eric avant lancement)
  · ② le diff relu contre le brief (tests vérifiés soi-même). Le sceau est à Eric.
- **Le contexte lourd (le code, les images) vit et meurt dans l'instance dédiée** ;
  la supervision reste légère. Pour le visuel : une **instance design isolée** tient
  les wireframes, rend un **diff + résumé sans images** → gate ② sur le diff.
- **La conception signée ne se re-questionne pas** — on l'exécute, on la gate, on la
  rend belle. On n'appelle Eric que sur une **vraie contradiction / un vrai trou / un
  fork**. Les décisions signées ne se re-surfacent pas.
- **Eric conduit le tempo** — chaque barreau attend son go ; coché = fait, vérifié.

## Ce qui reste — HORS de la boucle (la suite)

1. **Le vernis visuel (lot 4b)** — un **diff NON commité** dort dans l'arbre (tokens
   recalés sur le logo, matière pierre de la stèle, halo final). Il attend **l'œil
   d'Eric à froid** (device + planches Claude Design) **+ signer les 4 couleurs de
   siège** (proposées mécaniquement, aucune planche ne les couvre). *Tech OK (tests
   verts) ; le seal est visuel, il est à Eric.*
2. **Les sons élaborés** — Jacques les monte depuis les mp3 (email parti). Placeholder
   (`gofSound`) en attendant. Intégration au retour.
3. **Le ship** — instance de **build/déploiement** : le **rebuild APK** (couvre aussi
   le **keepAwake natif** du lot 1, jamais testé sur device), la propagation du
   rename, la page `dev.irimwebforge.com`, le **bump `app.json` 0.1.0 → 0.2.0**
   (décision de version, Eric déclare — ADR-014).
4. **Le device-verify accumulé** (jamais fait à l'œil ici) : timing du rugissement ·
   alignement Gong/anim · clipping des overlays sur petit écran · la fidélité visuelle.
5. **Le vrai jalon : « tenir la partie »** — une vraie partie à 4 jusqu'à 100, en
   conditions réelles, à la **prochaine soirée**. C'est là que l'alpha-signature se
   prouve, pas dans le vert des tests.

## Notes

- **« écrire l'histoire »** (l'axe récit) : son **germe palier 1 est bâti** — le vrac
  + la stèle + la feuille persistent inter-sessions, en local. Le palier 2 (DB / API)
  reste la piste **beta** (`specs-stats` §P2, `brief-ligue`).
- Aucune dette technique ouverte : les dettes du lot 0 (code mort, `gofCount`, rename)
  ont été balayées au lot 3c.
