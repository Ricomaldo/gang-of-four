---
title: 'GANG — La branlée (pilier 4)'
created: '2026-07-10'
updated: '2026-07-10'
version: 0.2.1
status: draft
type: branlee
---

# GANG — La branlée

> **SCRATCH — conception du 10/07** (pilier 4 : *« tout s'oublie sauf la
> branlée »*). Écrit **d'un bloc, sans séparer UX et UI** : ici l'identité est
> *un même geste* qui est à la fois comportement et surface. La distinction
> UX/UI était un échafaudage de méthode ; la conception signature la fond.

## Le parti pris — la mémoire sélective

GANG **oublie presque tout, exprès.** Les scores se remettent à zéro, le trône
est éjectable, l'undo pardonne, la partie s'efface. Là où les apps thésaurisent,
GANG **fait le vide.** Et c'est *parce que* tout s'oublie autour d'elle que **la
branlée devient inoubliable.** La mémoire sélective comme arme : GANG choisit la
seule chose qui mérite de rester, et il est impitoyable là-dessus.

## Ce qu'est une branlée

- **Binaire : branlée ou rien.** Pas de petite / grosse.
- **Seuil : ~30 points** distribués sur la table en une manche (cumul collectif).
  30 d'un coup, c'est *déjà* rare — le seuil fait la rareté. **S'ajuste à la
  récolte.**
- **Détectée à la validation de la manche** — au point de calcul.

## Deux registres, deux gestes — sur une seule ligne : la validation

- **avant / présent clément** → corriger la **dernière ligne** de la grille.
  Silencieux, **sans confirmation**. On répare sa faute de frappe, point.
- **après / mémoire impitoyable** → la branlée est **gravée** : grille +
  screenshot, pour toujours.

## La cérémonie

Quand le calcul révèle une branlée, GANG **s'arrête** : **alerte (info) +
demande de confirmation.** Ce n'est **pas un garde-fou — c'est une cérémonie.**
Là où toute UX sérieuse s'excuse d'un dialogue de confirmation et cherche à le
supprimer, GANG l'**arme** : la friction devient la frime. L'app stoppe, la
table se penche, on grave devant témoins. La demande de confirmation
**magnifie** la branlée — elle dit *« ce qui suit est irréversible, et ça en
vaut la peine ».*

Et d'un seul geste elle tient les deux registres : **dernière chance de
corriger** (sécurité) **+ le sceau cérémoniel** (permanence). Sécurité anti-typo
et frime sont **le même bouton** — on ne grave qu'après avoir *choisi* de graver,
donc pas de fausse branlée gravée par accident.

*(Le mot du dialogue — « on grave ça ? » ou autre — reste au copy-deck. Ouvert.)*

## La langue visuelle — crayon vs gravé

Un carnet se remplit au **crayon** : léger, réversible — c'est le présent. La
branlée est l'inverse du crayon : **gravée** — plus lourde, plus sombre,
enfoncée dans la page, définitive. Les deux registres deviennent **deux matières
d'écriture.** Un inconnu le sentirait sans notice : la branlée *pèse* dans la
grille. *(Direction proposée, à signer.)*

## Le point de vue

La branlée a deux POV : celui qui **inflige**, ceux qui **prennent**.

- **Le palmarès compte le donneur** : +1 au vainqueur de la manche-branlée ; les
  autres l'ont prise **par déduction** (pas de marque par preneur).
- **Le POV du preneur n'est pas perdu** : sa honte reste **lisible dans la
  manche gravée** (ses gros scores, la ligne qui pèse) — le *« voir quand on
  s'est losé »* de Damien (FD-05). **La stat regarde le donneur ; la trace
  montre les preneurs.**

## Les marques — deux, distinctes

- un **emoji** = *qui* a collé (cellule du donneur + le +1 palmarès) ;
- le **gravé** = *cette manche reste* (traitement de toute la ligne).

L'emoji dit l'**auteur** ; la gravure dit la **permanence.**

**L'emoji — RÉSOLU (18/07), supersede cette section.** Voir plus bas : la marque
`‡` / `‡‡` porte à la fois le rôle de l'emoji (« qui a collé ») et celui de la
gravure (« cette manche reste »). Les critères ci-dessous (💣 écarté, 💥 déjà pris,
💪 insuffisant) restent comme trace du raisonnement, mais n'appellent plus de
décision.

## Ce qui reste ouvert

- l'**échelle** — **tranchée le 12/07 : petite / grosse branlée** (confirmé par la
  copy *« petite / grosse branlée de {prénom} ! »*). Le corps du doc, qui posait
  *binaire*, est **caduc** sur ce point. **Seuils validés par Eric : petite ≥ ~30 ·
  grosse ≥ ~45** — ajustables à la récolte.
- la **marque** de la branlée — ~~✅ SIGNÉE (12/07) : L'ENCOCHE~~ **SUPERSEDÉE
  (18/07)** : `‡` (petite) / `‡‡` (grosse) remplace l'encoche `/` `//` — décision
  d'Eric au canal direct Claude Design, cf. `journal/2026-07-18-placard-implemente.md`
  et `claude_design/2-alpha-signature/retour/specs-placard.md:60-61`. Posée sur la
  cellule du **donneur** (`0 ‡`). *L'ancien rejet de `‡` (croix de Lorraine, ligne
  ci-dessus) ne tient plus — reversé en connaissance de cause.*
- le **mot** de la cérémonie (copy-deck) — **routé (31/07)** : traité dans la
  prochaine passe de review générale avec Claude Design, pas ici.
- l'**entrée dans le tie** du palmarès — **fermé (31/07)** : la branlée n'entre
  dans **aucun** départage, ✌️ ni 🐌 — pur fun d'animation, aucun point. Prémisse
  du 10/07 corrigée dans `palmares.md` §Départage.
