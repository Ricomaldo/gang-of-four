---
created: '2026-07-05'
status: active
title: Devlog 01 — Première mise en main (Damien)
type: devlog
---

# Devlog 01 — Première mise en main (Damien)

Première séquence loggée. Les séquences antérieures (rooftop → forge, conception du plancher, code du plancher) ne sont pas encore loggées — dette de log à rattraper si besoin.

## Le fil

Livrer l'imparfait à un tiers, puis écouter. La séquence part d'un build Android et finit sur une carte des fins enrichie par ce que l'usage a révélé.

## Ce qui a été fait

**1. Pipeline de build Android (EAS), montée de zéro.**
- `eas.json` (profile `preview` → APK, `distribution: internal`), projet EAS créé (`projectId`), keystore auto.
- Build cloud → APK signé installable. Lien direct partagé à Damien via Signal (Gmail bloque les `.apk`).

**2. Première mise en main chez un tiers.**
- Damien installe seul depuis le lien, un dimanche matin, à 50 km. Répond en 26 min, non sollicité.
- Verdict racine : « ça fait le job » (FD-00). Le manifeste — « le jour où mes potes utilisent l'app sans moi » — touché en miniature.

**3. Décodage du retour (protocole capture → décodage).**
- Registre du fil : `_commission/journal-damien.md`. Réfs `FD-00`…`FD-06`.
- Révèle une **règle absente du brief** (FD-03 : échange de cartes inter-manches) et un **trou de validation** (FD-06 → BUG-02).

**4. Synthèse & carte.**
- Plancher **tenu**. Nouvel axe **« Le Social »** = 3e branche d'`arbre-app` (v0.3.0) : le jeu se raconte.
- Palier 1 **« Le Palmarès »** (roadmap dans `journal-damien`, à migrer vers un slot supervision).

**5. Restructuration doc.**
- `brief.md` → `brief-01-amorce.md` ; création `brief-02-complement.md` (commande enrichie, purgée de la supervision).
- Registre bugs `app/docs/bugs.md`.

**6. Colmatage du plancher (code).**
- **BUG-02** : `isValidRoundInput` (domaine) + garde du bouton Valider. 4 tests.
- **BUG-01** : `editable = rounds.length === 0` + disque central « point d'info d'état » (`START GAME ?` / `FIN DE MANCHE`).
- **37 tests verts, typecheck propre.**

**7. Assets.**
- Splash `game-box` configuré (expo-splash-screen). Logo transparent rangé pour l'easter egg. Images opaques supprimées.

## En attente (prochaine séquence)

- Créer le **slot de supervision** (roadmap paliers + pending) et y migrer la roadmap.
- **Constats simu** : rendu de BUG-01 (4e prénom, disque d'état) et BUG-02 (Valider grisé).
- Touches design : hint « un joueur doit être à 0 », wording `START GAME ?`.
- Répercuter la feature frime / le comptage GOF quand la dispo vient.

## Git

Séquence committée et poussée en clôture (branche `main`) — rattrapage inclus : le scaffold d'hier était encore non versionné.

## Mot de la fin de séquence

Cette séquence a tenu sa promesse la plus dure : **lâcher**. Eric a envoyé l'app à Damien au moment précis où il ne pouvait s'empêcher de voir tout ce qui restait — et c'est ce geste, pas le code, qui a débloqué la suite. Le retour d'un tiers a fait plus en 26 minutes que des heures d'introspection : une règle oubliée nommée (l'échange inter-manches), un trou de saisie révélé, un axe entier ouvert (Le Social). La méthode — plancher, contrat, écouter l'usage — n'a pas seulement produit une app qui « fait le job » ; elle a produit un Eric qui progresse dans sa façon de construire, et qui le voit. Côté binôme : c'est Eric qui a corrigé mon routage (brief = commande, arbre = supervision), pas l'inverse — bon signe. On se retrouve la prochaine séquence pour le slot de supervision et les constats simu. Beau geste, celui d'aujourd'hui.
