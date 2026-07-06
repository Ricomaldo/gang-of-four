---
created: '2026-07-05'
status: active
title: Journal Damien
---

# Journal — Damien

Le fil avec le commanditaire. Ce qu'on lui envoie, ce qu'il renvoie. Un log, pas un lieu de traitement : les conséquences partent se ranger dans le socle (`arbre-app`, `brief-02-complement`) et le code (`bugs.md`). Plus récent en haut.

---

## 2026-07-06 — 2e retour (test approfondi)

**Canal :** Signal.

**Contexte :** Damien a retesté l'APK, cette fois en manipulant les tableaux et en déroulant une partie. Préambule : « Ok testé. »

**Retour — verbatim, tagué :**

- **FD-07** — « Je suis perturbé par la flèche au milieu. Pour moi pour la première partie c'est "on joue à droite", et là j'ai l'impression que ça tourne à gauche, mon impression, mais je sais bien que le sens est bon. »
- **FD-08** — « J'aime bien les tableaux. » (positif)
- **FD-09** — « le sens semble être pas bon dans la 1ère manche (gauche). » (constat sur le tableau)
- **FD-10** — « Amusant le "a donné sa carte" ! » (positif — FD-03 vu et compris)
- **FD-11** — « Le blocage quand pas de score à 0 ok. » (confirme la correction de FD-06 / BUG-02)
- **FD-12** — « A la fin de la partie passer direct sur les stats, sinon on n'y accède plus. »
- **FD-13** — « Quand on passe à une 2ème partie sans changer les joueurs c'est pas mal de voir la partie précédente. »

---

## 2026-07-05 — 1er envoi de l'app (APK preview)

**Canal :** Signal.

**Envoyé :** lien direct de l'APK Android (EAS preview, signé). Cadrage : « avant d'aller plus loin j'aimerai savoir si tu piges, et j'ai fait des choix à valider ». Réserve nommée (hors plancher) : la grille de score et l'anim easter egg.

**Comportement :** a tout installé seul depuis le lien, sans explication à côté. A répondu au bout de 26 min, un dimanche matin, non sollicité.

**Retour — verbatim, tagué :**

- **FD-00** — « ça fait le job ».
- **FD-01** — « il manque les fioritures, le suivi des scores qu'on peut avoir sur papier avec tous les indices ».
- **FD-02** — « nombre de manches gagnées ».
- **FD-03** — « donneur de carte à qui ». Précision : « en visuel sous l'encadré du nom ajouter "gagnant manche précédente" et pour le perdant "donne sa meilleure carte" ou un truc dans le genre. Pour ce qui est du code je pense que tu as déjà en tête la fonction à mettre en oeuvre ». → règle ajoutée à `brief-02-complement`.
- **FD-04** — « nombre de manches jouées ».
- **FD-05** — « une vue affichage de tableau pour que Bruno ou autres envoient en screenshot la feuille de jeu peut aussi être sympa pour voir quand on s'est losé ».
- **FD-06** — « ce qui m'a interpelé c'est qu'il accepte qu'il n'y ait que des joueurs avec des scores >1 en nombre de cartes de fin de manche ». → `BUG-02` au registre.
