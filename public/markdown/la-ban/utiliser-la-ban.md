---
title: Utiliser la BAN
aside: [{attach: "la-base-adresse-nationale", filename: "decouvrir-la-BAN--la-base-adresse-nationale"}]
---


![Exemple d'adresse sur une carte](img/pages/utiliser_la_BAN/utiliser-la-ban-hero-illu.png)

## Structure de la donnée BAN

La Base Adresse Nationale (BAN) est une base de données géographiques, qui stocke l'ensemble des adresses du territoire. Les adresses sont représentées sous la forme d'un objet géométrique **ponctuel géolocalisé**, associé à des champs descriptifs représentant les différents objets de la base et leurs attributs.

La BAN est composée d'objets de différents types :
- les *toponymes* qui regroupent :
    - les noms des communes, ou les arrondissements pour les villes de Paris, Lyon, Marseille, qui correspondent aux entités administratives responsables de la production d'une base adresse locale (BAL),
    - les odonymes, qui regroupent les dénominations des voies, places, lieudits et des lieudits complémentaires,
- les *adresses* elles-même, composées d'attributs, de plusieurs toponymes et d'autres informations.



## Les fichiers BAL

L'autorité principale de production de l'adresse est la commune dans le périmètre de la Loi3DS. Les adresses de la BAN sont donc construites à partir des données source provenant des Bases adresses locales (BAL) sur les emprises communales.

Les fichiers BAL sont des fichiers au format CSV qui suivent la structure définie dans la [Spécification du format BAL 1.4](https://aitf-sig-topo.github.io/voies-adresses/files/AITF_SIG_Topo_Format_Base_Adresse_Locale_v1.4.pdf). Un fichier BAL contient l’ensemble des données d’adressage d’une commune. À chaque soumission de fichier BAL auprès de la BAN, le fichier est traité dans son intégralité.



## Certification des adresses
Une adresse **certifiée** est authentifiée par la commune, ce qui garantit une meilleure fiabilité de l'information.
La commune peut initialiser sa BAL puis procéder à la certification au fur et à mesure des vérifications. Le pourcentage de certification d'une BAL est un indicateur de qualité globale de l'adresse.

Les adresses certifiées sont présentées en vert dans l'outil d'exploration de la Base Adresse Nationale.
Elles ont été authentifiées par la commune et proviennent d'une Base Adresse Locale (ou historiquement du Guichet adresse de l'IGN).


## La gestion du cycle de vie des adresses
Au sein d’un fichier BAL, le fournisseur de données à la possibilité de fournir des identifiants (appelé identifiants BanID) spécifiques à chaque lieu constituant l’adresse.
La présence de ces identifiants **permet la gestion du cycle de vie des adresses et autres lieux présents dans la BAN**.
À l’inverse, en cas d’absence d’identifiant BanID, les adresses seront exposés aux usagers sans support du cycle de vie.


La gestion du cycle de vie permet :
- d’assurer le suivi d’un lieu et donc d’une adresse dans le temps, comme la création ou suppression d'une nouvelle adresse ou la modification d'un libellé,
- et ce de façon indépendantes des évolutions administratives, comme par ex son rattachement à une nouvelle commune.

Les événements du cycle de vie des toponymes et adresses seront (travail en cours) mis à disposition dans des fichiers différentiels.

## Le code postal

Le code postal caractérise l’organisation interne de La Poste pour la distribution du courrier. Sa présence au sein des composants de l’adresse est justifiée par son association historique à la thématique.
Chaque zone de distribution postale est identifiée par un code postal unique pour faciliter la gestion. Un code postal est couramment associé à plusieurs communes. Il y a également des communes en France qui peuvent avoir plusieurs codes postaux (au-delà des localités à arrondissement).

Cette information n'étant pas de la responsabilité des communes, ce champ ne figure pas dans le format BAL.
L'information du code postal est associée à l'adresse par le dispositif BAN lors de la publication de la BAL, à partir de données source La Poste.
