---
title: GoF — DAG
created: 2026-07-03
updated: 2026-07-03
version: 0.1.0
status: active
type: dag
---

# GoF — DAG

Les deux arbres, reliés par leur **tissu conjonctif** : les trois nœuds-ponts qui servent les deux à la fois. Le tissu n'est pas fabriqué, il est révélé — et là où un nœud sert deux parents, deux briques d'engagement peuvent n'en faire qu'une.

```mermaid
graph TD
    %% ---- arbre-app : des fins ----
    subgraph APP["arbre-app — les fins"]
        A0["Potes jouent avec plaisir<br/>et je prends plaisir à développer"]
        A1["Le décompte est fidèle aux règles"]
        A2["L'app s'utilise sans friction"]
        A1a["Saisir 4 nombres, score juste,<br/>cumul, arrêt à 100"]
        A2a["Le geste central :<br/>la saisie de fin de manche"]
        A2b["Un seul appareil autour de la table"]
        A0 --> A1
        A0 --> A2
        A1 --> A1a
        A2 --> A2a
        A2 --> A2b
    end

    %% ---- mon-arbre : des disciplines ----
    subgraph MOI["mon-arbre — les disciplines"]
        M0(["Je progresse dans<br/>ma façon de construire"])
        ML(["Lâcher"])
        ME(["Écouter"])
        MC(["Cadrer"])
        MLa(["Montrer l'imparfait à un pote"])
        MEa(["Écouter les comportements,<br/>pas les compliments"])
        MCa(["Le contrat bilatéral"])
        M0 --> ML
        M0 --> ME
        M0 --> MC
        ML --> MLa
        ME --> MEa
        MC --> MCa
    end

    %% ---- les trois nœuds-ponts : le tissu ----
    P1{{"Le plancher —<br/>ce qui ne doit pas manquer"}}
    P2{{"Le nœud éjectable"}}
    P3{{"Plaisir / progression"}}

    A2 --> P1
    ML --> P1
    MCa -. clause 4 .-> P1

    A2 --> P2
    ME --> P2

    A0 --> P3
    M0 --> P3

    classDef pont fill:#f9d423,stroke:#e65c00,stroke-width:2px,color:#000;
    class P1,P2,P3 pont;
```

**Lecture.** Rectangles = fins (arbre-app). Stades = disciplines (mon-arbre). Hexagones jaunes = les nœuds-ponts, le tissu. Le lien pointillé « clause 4 » rappelle que le contrat *tient* le plancher.
