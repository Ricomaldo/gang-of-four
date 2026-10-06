---
title: 'GANG — réouverture après pause (01/10)'
created: '2026-10-01'
updated: '2026-10-06'
version: 0.2.0
status: active
type: journal
---

# Réouverture — 01/10

Dernier travail app le 11/08 (sortie `0.2.0`, tag `v0.2`), dernier commit le 03/09. Le dossier revient de `staging` en `active`.

## État constaté

- **Android** : `GANG-0.2.0.apk` seul en ligne sur `dev.irimwebforge.com/gof/` (l'ancien `GoF-Companion.apk` 0.1 retiré ce jour).
- **iOS** : `0.2.0 (3)` sur **TestFlight**, id `12ecf3`, 39 jours restants au 01/10 → expire ~09/11/2026. Config build local posée le 03/09 (`buildNumber 3`, `ITSAppUsesNonExemptEncryption: false`, `appVersionSource: local`).
- **Gate forge → codebase** : 3/4, reste « Écrire l'histoire » (palier 2 / DB).

## Passe de nettoyage

- `CLAUDE.md` « Où on en est » remis à l'état (il datait du 18/07).
- `docs/README.md` : ligne d'ère 0.2.x à jour ; `changelog.md` : pointeur `docs/devlogs/` → `docs/journal/`.
- ipa local du 11/08 supprimé (ignoré par git).

## Manque connu

La soirée du 11/08 (partie à 4 tenue jusqu'à 100) n'a pas de trace dans `journal-damien` ni ici — Eric la consignera.

## Suite — passe 01→06/10 : le retour de Pierre trié

**Changé.** `_commission/journal-pierre.md` né (FP-01..11, verbatim + préambule : test d'une semaine de vacances avec ses amis). Contrat **`2026-10-01-passe-0.3.md`** né, critère d'entrée confirmé (« rend la prochaine soirée réelle meilleure ou lève une friction vécue à la table »). Chantier `2026-10-02-chantier-refonte-stele-0.3.md` né. Primitive `signature/easter-eggs.md` née. `specs-stats` 0.2.3 (branlées hors départage). Note laissée dans `_engagement/arbre-app.md`.

**Décidé.** A1 pavé numérique (hauteur, police bornée) · A2 branlées hors départage (bug `stats.ts:65-66`) · A4 cartouche « X a gagné et Y mène au score », « Qui a le 1 multicolore ? », 3ᵉ état « Z joue en 2e position » · A5 ← de la saisie revient au jeu · A6 une partie en cours par gang (garer / reprendre / annuler) · A3 refonte stèle = chantier (langue de la table, hiérarchie, pas d'emoji) · C1 conclave « branlée de / pour » · HORS 0.3 : version enfant / 18+ (0.4+), le son (critère assets, Bruno enregistre / Santi mixe). Doctrine : *la partie se vérifie contre les règles, le palmarès se décide*. Méthode : journal du joueur → étude → contrat.

**Ouvert.** Coder A1/A2/A4/A5 (Sonnet) puis A6 ; concevoir A3 (canal Claude Design pressenti) ; piste P1 ex aequo ; moment de PICON TIME et périmètre 0.3 des easter eggs ; égalité au score dans le cartouche (à froid) ; soirée du 11/08 non consignée ; TestFlight expire ~09/11 ; 29 alertes Dependabot ; GANG sans dossier cockpit (décision Eric).

*Capture de la stèle produite sur simulateur (iPhone 17, 7 parties de démo injectées en AsyncStorage) ; au passage, `ios/Pods/.../Pods-GANG.*.xcconfig` pointaient encore vers `gang-of-four` (corrigé hors repo, `ios/` est généré).*
