---
title: Ressources et documentations
---


# Documentation technique de la BAN

## Architecture
L'écosystème Base Adresse Nationale est complexe. Les nombreux composants nécessaires à la production de l'adresse,la gestion de la base de donnée puis son exploitation sont étroitement imbriqués. Des dépendances avec des composants sous responsabilités d'autres organismes sont également nécessaires pour assurer la cohérence d'ensemble.   Le schéma d'architecture globale est accessible ici : [Schéma d'architecture BAN - BAL](https://github.com/BaseAdresseNationale/ban-plateforme/wiki/Schéma-général-d’architecture-BAN-BAL-(fev-2025))


## Structure de données interne BAN

La Base Adresse Nationale (BAN) est une **base de données géolocalisées**, constituée des entités des 3 types de 'localisants' composant la donnée Adresse :

* *District* : Les entités administratives responsables de la gestion des adresses (les communes, ou les arrondissements pour les villes de Paris, Lyon et Marseille)
*  *CommonToponym* : Les odonymes (= noms de voies) utilisés pour la partie littérale des adresses (rue, place, lieu-dit, etc) sous la dénomination *mainCommonToponym*. Ils peuvent également être ajoutés en tant que composant secondaire de l'adresse (certains usages de lieux-dits), sous la dénomination *secondaryCommonToponyms*. 
Les *CommonToponym* sont 'liés à' et 'administrés par’ un *District*.
* *Address* : Les adresses, représentées par un objet géométrique ponctuel. Les adresses sont chacune 'liées à' et ‘administrée par’ un District, et composées d'un ou plusieurs *CommonToponym*.

Chacune de ces entités est capable de porter des données additionnelles pour apporter des informations complémentaires composantes de l'adresse BAN. Ces données sont de sources externes au périmètre de l'Adresse, mais ouvertes et d'utilité publique (par exemple, les codes INSEE, les Identifiants de parcelles cadastrale, les codes postaux, etc.).

[En savoir plus](https://github.com/BaseAdresseNationale/ban-plateforme/wiki/DRAFT%23-Schema-de-la-base-de-donn%C3%A9es-BAN) 



## Intégration des nouveaux identifiants BAN "BanID"

Chaque entité de la BAN intègre un identifiant technique unique BanID permettant de l'identifier de façon explicite et non ambiguë. Les BanID sont la clé d'identification primaire des objets, permettant d'assurer leur suivi dans le temps. Ils sont également utilisés pour indiquer les liens de dépendance entre différents lieux.

Exemple:

    Un objet "Adresse" : 2bis Route des Prodiges, Cocorico
    - disposera d'un BanID_Adresse UUIDv4-0004
    - contiendra une liaison vers une voie ou un lieudit : "Route des Prodiges", via un BanID_Toponyme UUIDv4-0002
    - contiendra une liaison vers la commune (ou l'arrondissement) d'appartenance : Cocorico, via son BanID_Commune UUIDv4-0001


Afin d'assurer la cohérence et la maintenance des données, il est important de s'assurer dans le temps de la **conservation** de l'ensemble des Identifiants BanID constituant d'un lieu.
Les BanID sont directement fournis par le Fournisseur de données, qui s'assure de leur conservation dans le temps.

Les identifiants BanID sont fournis par le biais de fichiers BAL 1.4 par l'usage des  3 attributs suivant :

            ID_BAN_ADRESSE
            ID_BAN_TOPONYME
            ID_BAN_COMMUNE

[En savoir plus](https://github.com/BaseAdresseNationale/ban-plateforme/wiki/DRAFT-%23-Int%C3%A9gration-des-BanID)