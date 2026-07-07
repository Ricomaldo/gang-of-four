---
created: '2026-07-07'
status: draft
title: Brief Ligue — draft non ratifié
---

# Brief Ligue — Gang of Four

> **Statut : draft non ratifié.** Capture d'intention, pas une commande active. Source : Eric (supervision perso), pas Damien. Ne devient exécutable qu'après ratification explicite. Fixé ici pour ne pas perdre le fil pendant qu'on avance sur le plancher.

Ce brief porte le **palier 3** — la suite nommée, pas encore ouverte. Il vit à côté de [[brief-01-amorce]] et [[brief-02-complement]] (la commande de Damien, palier 1) sans les remplacer.

## Le mouvement — trois paliers

- **P1 — local, livré.** L'app plancher, prouvée, mise en main. Aucune dépendance réseau.
- **P2 — DB stats, ligue unique.** API minimaliste + DB sur **Hyperion** (serveur perso d'Eric). Persistance des parties, feuille en ligne, stats. Une seule ligue informelle, les potes. Données triviales, **aucun risque a priori**.
- **P3 — ce brief.** Mise en ligne Play Store + modèle multi-ligues.

## Le réel qui vient (pas du fantasme)

- Ligue informelle actuelle : ~**10 joueurs**, montée plausible à **~30 en un an** selon l'enclin des potes à l'utiliser en partie et à y inscrire leurs joueurs.
- Demain : DL proposé via **EAS / APK** à 3 potes qui veulent l'utiliser de leur côté.
- Très peu de données, pas de risque identifié à cette échelle.

## Le modèle envisagé (P3)

- **Option en début de setup** : *partie locale* ou *partie ligue communautaire*.
- Pour l'instant une seule ligue existe ; le modèle prévoit d'en **créer d'autres**, informelles, sur base simple :
  - **App gratuite** — local only.
  - **App à 1,99 €** — save online + création de **ligue privée**.
- Économie : coût marginal quasi nul — **serveur déjà payé** (Hyperion), **stores déjà payés** (perspective 20 ans+). Peut rapporter un peu, ne coûte presque rien.

## Le germe à ne pas manquer (contrainte sur P2)

La frontière **P2 → P3** n'est un mur que si on la crée. Pour la garder franchissable à coût quasi nul :

- Le **modèle de données naît *league-aware* dès P2** — une `league_id` présente dès le premier schéma, même avec un seul enregistrement en dur.
- P2 ne coche pas P3, mais **grave le schéma** qui l'ouvre ou le ferme. L'ignorer transforme P3 en réécriture.

## Questions ouvertes (à trancher à la ratification)

- Frontière **mutualisation de l'app** : un seul binaire multi-ligues vs. app dédiée.
- Specs P2 qui conditionnent P3 : forme de l'API, schéma DB, modèle d'auth (comptes ? codes de ligue ?).
- Modèle de paiement store (achat unique 1,99 € vs. autre).

---

*Rien ici n'est engagé. La commande active reste P1/P2. `brief-ligue` attend son heure.*
