---
created: '2026-07-05'
status: active
title: Changelog — Gang of Four
---

# Changelog — Gang of Four

Changements par version (produit). Le récit de dev, lui, vit dans `docs/devlogs/`.
Format : plus récent en haut.

## 0.1.0 — en cours

### Ajouté
- Scaffold app **RN / Expo managed** (SDK 57, TS, React Navigation, Zustand) — *scaffold init, 4 juillet*.
- Domaine du score (pur, testé) : barème, cumul, arrêt à 100, `roundWinner`, `directionOfPlay`, départage 2 niveaux.
- Store Zustand (brut seul : prénoms, manches, statut) ; scores/cumuls/vainqueur toujours dérivés.
- Écrans : démarrage-manche (grille 2×2), saisie de fin de manche, grille de score, splash.
- **Build Android EAS** (APK preview, `distribution: internal`) — première livraison à un tiers.
- **Splash** `game-box` (expo-splash-screen).
- **Garde de saisie** : une manche sans joueur à 0 est refusée (`isValidRoundInput`).

### Corrigé
- **BUG-01** : démarrage figé dès le 4e prénom → prénoms éditables jusqu'à la 1re manche ; disque central « point d'info d'état » (`START GAME ?` / `FIN DE MANCHE`).
- **BUG-02** : manche sans gagnant acceptée → garde de saisie (voir Ajouté).

### Tests
- 37 tests verts (barème, cumul, arrêt à 100, départage bout-en-bout, garde de saisie).
