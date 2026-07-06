---
created: '2026-07-02'
status: active
title: GoF — Manifeste
type: manifeste
updated: '2026-07-06'
version: 0.5.0
---

# GoF — Manifeste

Ce projet existe pour deux raisons : que mes potes jouent avec plaisir, et que je prenne plaisir à le développer. Trois fins — jeu bien modélisé, app sans friction, moi qui progresse — se retrouvent aux sessions mensuelles, seuls vrais jalons.

J'apporte l'architecture système, ma spécialité. Le reste se prouve en livrant.

Ce qui me guette : besoin de valorisation, perfectionnisme, feature creep, dispersion, attirance pour la richesse conceptuelle plutôt que la simplicité qui sert mieux. Ça se présente toujours en bonnes idées — d'où l'écrire ici, pour le reconnaître au moment où ça séduit.

Règles non négociables : MVP d'abord, l'option la plus simple entre deux, GoF reste 5% de mon temps, une respiration pas un projet principal.

La beauté est à la fois mon besoin le plus vrai et ma pente la plus dangereuse. Deux clients : mes potes (viable = ça marche), moi (viable = envie de rouvrir l'éditeur). Le dragon logo, présent dès le début, ne coûte rien et paie ma présence — il reste. Le graphisme avancé qui cherche à impressionner ne sert personne — il attend.

Réussite : le jour où mes potes utilisent l'app sans moi.

## Patterns nommés au fil de l'eau

Chaque pattern reconnu en direct — souvent au scellement du [[pacte-claude-eric]] — s'inscrit ici, neuf, avant d'être éventuellement fondu dans le corps du manifeste. Nommer, c'est déjà se voir ; inscrire, c'est ne pas le reperdre. **À cinq nouveaux, j'en tire un article ou deux** pour le corps ci-dessus.

- **Construire de la clarté artificielle pour compenser la fatigue** — 2026-07-05, au premier scellement. Bâtir du cadre (mécanisme, structure, artefact d'engagement) non pour servir l'app mais pour donner à la fatigue une contenance rassurante. Se présente en « bonne idée d'organisation ».
- **Le modèle inline par défaut — la factorisation se pose, elle ne se génère pas** — 2026-07-06, en supervision de la passe. L'instance de code écrit les écrans ligne par ligne, sans extraire de composants (génération linéaire, aucune friction vécue, aucun coût de maintenance ressenti). Le correctif n'est pas d'espérer mieux : c'est de **poser la règle en amont** — « un écran = un fichier fin qui compose des composants nommés ; toute vue réutilisée ou > ~80 lignes = extraite ». Posée, elle est suivie au quart de tour.
- **Factoriser n'est pas polir** — 2026-07-06, même passe. L'ossature (composants nommés, propres) est dans le *plancher* ; le rendu fin (arrondis, couleurs, ombres) est *reportable* au bon palier. Confondre les deux, c'est soit bâcler la structure au nom du minimal, soit gonfler le palier au nom du beau. Le discernement : la structure se gate, le polish se situe.