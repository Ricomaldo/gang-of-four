---
title: 'Chantier — Refonte de la stèle (vers 0.3)'
created: '2026-10-02'
updated: '2026-10-02'
version: 0.1.0
status: active
type: chantier
---

# Chantier — Refonte de la stèle (vers 0.3)

**Ce que c'est :** le lieu d'étude de la refonte de la stèle. Ici vivent le constat, les décisions d'entrée et les **pistes** — rien n'y est codable. Quand Eric déclare la conception tranchée, le résultat s'écrit en article codable au contrat (`2026-10-01-passe-0.3.md`, A3), pas avant.
**Source :** `FP-09` (`_commission/journal-pierre.md`) · théorie : `signature/ecrans/03-stele.md`, `signature/palmares.md`, `specs/specs-stats.md`.

## Le constat

Pierre : « Feuille finale pas clair » = la stèle (`journal-pierre`, FP-09). Eric la trouve aussi peu claire. Capture du 02/10 (simulateur, 7 parties de démo) : trois joueurs à 2 parties gagnées, Bruno champion par les manches — la règle marche, **rien à l'écran ne le dit** ; en-têtes `P▲ P▼ M▲ M▼` sans clé. En interne aussi c'était flou : la doc se contredisait sur les branlées (réglé → contrat A2).

## Décisions d'entrée (Eric, 02/10) — la conception part de là

- **Refonte complète de l'écran**, chantier en soi (pas une retouche).
- Les en-têtes `P▲ P▼ M▲ M▼` **disparaissent**.
- **La langue de la table, pas celle du code.** « Manche » est une nomenclature de code ; entre joueurs on dit **« prendre / a pris la main »** et **« fini premier / dernier x fois »**. « Partie pliée » n'est pas leur langage. « Finit dernier » prête à confusion sur la stèle.
- **Hiérarchiser** : distinguer ce qui compte vraiment (première vue) du tableau de stats complet — utile, **pas indispensable** en première vue.
- Les **emoji** restent abandonnés (cohérence de tout le design) ; leur retour **se discute**, il n'est pas acquis.
- **Les branlées ne comptent pas** — signé (→ contrat A2).
- Inchangé par la théorie, sauf piste contraire ci-dessous : deux trônes en miroir indépendants, le « monde étrange » proclamé, seuls les pôles comptent.

## Pistes (non tranchées)

### P1 — Pas de départage forcé : ex aequo assumés *(Eric, 02/10)*

Il peut y avoir **2 champions et 2 loosers, ou plus**. Le tie n'a pas besoin d'être forcé : si deux joueurs ont gagné autant de parties, ils sont **à égalité**, et **seule une nouvelle partie peut les départager**.

*Portée si retenue (constat, pas décision) :* ce n'est pas qu'un affichage — la piste **retire tout le départage** des trônes, pas seulement les branlées : les manches (2ᵉ maillon) et le « tenant reste » (`palmares.md` §Départage) tombent aussi. Le domaine changerait (`stats.ts` : un titre = un **ensemble** de prénoms, plus un seul) et les tests du tenant (`__tests__/stats.test.ts:187+`) seraient à réécrire. A2 (branlées hors départage) reste juste dans tous les cas — il deviendrait un pas intermédiaire.

## Ouvert (à concevoir, pas à coder)

- Ce qui compte en première vue ; où vit le tableau complet.
- Le mot exact de chaque titre et compteur, dans la langue de la table.
- Si et comment l'égalité / le départage se lit à l'écran (lié à P1).
- Les emoji.
- Canal pressenti : Claude Design (comme le placard).
