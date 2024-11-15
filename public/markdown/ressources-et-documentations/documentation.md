---
title: Ressources et documentations
---

# Page Documentation

Cette page rassemble les accès aux ressources générales et techniques autour de l’adressage, de la production à la réutilisation de la donnée.

# Documentation générale 

Cette documentation en ligne vous fournit les informations relatives à la Base Adresse Nationale, au format Base Adresse Locale, ainsi que des FAQ et conseils pratiques 

[Accéder à la documentation](https://doc.adresse.data.gouv.fr/)


# Documentation technique de la BAN

## Architecture
L'écosystème BAN est complexe. Les nombreux composants nécessaires à la production de l'adresse,la gestion de la base de donnée puis son exploitation sont étroitement imbriqués. Des dépendances avec des composants sous responsabilités d'autres organismes sont également nécessaires pour assurer la cohérence d'ensemble.   
Le schéma d'architecture globale est accessible ici : [Schéma d'architecture BAN - BAL](https://github.com/BaseAdresseNationale/ban-plateforme/wiki/Sch%C3%A9ma-g%C3%A9n%C3%A9ral-d%E2%80%99architecture-BAN-BAL-(5-janvier-2022))


## Structure de données au sein de la BAN

La Base Adresse Nationale (BAN) est une **base de données géolocalisées**, constituée des entités des 3 types de 'lieu' composant la donnée Adresse :

* *District* : Les entités administratives responsables de la gestion des adresses (les communes, ou les arrondissements pour les villes de Paris, Lyon et Marseille)
*  *CommonToponym* : Les odonymes (= noms de voies) utilisés pour la partie littérale des adresses (rue, place, lieu-dit, etc) sous la dénomination *mainCommonToponym*. Ils peuvent également être ajoutés en tant que composant secondaire de l'adresse (certains usages de lieux-dits), sous la dénomination *secondaryCommonToponyms*. 
Les *CommonToponym* sont 'liés à' et 'administrés par’ un *District*.
* *Address* : Les adresses, représentées par un objet géométrique ponctuel. Les adresses sont chacune 'liées à' et ‘administrée par’ un District, et composées d'un ou plusieurs *CommonToponym*.

Chacune de ces entités est capable de porter des données additionnelles pour apporter des informations complémentaires composantes de l'adresse BAN. Ces données sont de sources externes au périmètre de l'Adresse, mais ouvertes et d'utilité publique (par exemple, les codes INSEE, les Identifiants de parcelles cadastrale, les codes postaux, etc.).

[En savoir plus](https://github.com/BaseAdresseNationale/ban-plateforme/wiki/DRAFT%23-Schema-de-la-base-de-donn%C3%A9es-BAN) 



## Intégration des nouveaux identifiants BAN "BanID"
Chaque entité de la BAN intègre un BanID unique permettant de l'identifier de façon explicite et non ambiguë. Les BanID sont la clé d'identification primaire des objets permettant d'assurer leur suivi dans le temps. Ils seront également utilisés pour indiquer un lien de dépendance entre différents lieux.
Exemples :

    Un objet Address (une adresse) : 2bis route des Prodiges, Cocorico
        - disposera d'un BanID d'Address UUIDv4-0004
        - contiendra une liaison vers un Toponym : route des Prodiges, via un BanID de Toponym UUIDv4-0002
        - contiendra une liaison vers un District : Cocorico, via un BanID de District UUIDv4-0001



Afin d'assurer la cohérence et la maintenance des données, il est important de s'assurer dans le temps de la maintenance de l'ensemble des Identifiants BanID constituant d'un lieu.
Les BanID sont directement fournis par le Fournisseur de données, qui s'assure de leur maintenance.
Les identifiants BanID seront fournis par le biais de fichiers BAL 1.4 par l'usage des attributs suivant :

    - BanID d'Address via ID_BAN_ADRESSE
    - BanID de Toponym via ID_BAN_TOPONYME
    - BanID de District via ID_BAN_COMMUNE

[En savoir plus](https://github.com/BaseAdresseNationale/ban-plateforme/wiki/DRAFT-%23-Int%C3%A9gration-des-BanID)

# Production de l'adresse 
- La spécification du format d'échange Base Adresse Locale (BAL)
Ce modèle de données simple permet aux collectivités locales de publier leurs données voies-adresses en open data dans la BAN pour les mettre à disposition de tous. Les voies n'ont pas de géométrie, les adresses disposent d’attributs décrivant des coordonnées géographiques.

[Télécharger le document « Format Base Adresse Locale - version 1.4 septembre 2023 »](https://aitf-sig-topo.github.io/voies-adresses/files/application-pdf.png)

- Le guide des bonnes pratiques
*à l’usage des communes et de leurs partenaires*

Les communes sont responsables de leurs adresses.
Ce guide passe en revue les bonnes pratiques pour nommer, numéroter les voies et diffuser l’information en parfaite conformité avec les obligations légales et rien que les obligations légales.
Le Guide des Bonnes pratiques est disponible dans un [format texte en ligne](https://https://guide-bonnes-pratiques.adresse.data.gouv.fr/) ou en PDF.

[Télécharger le guide des bonnes pratiques](https://adresse.data.gouv.fr/data/docs/guide-bonnes-pratiques.pdf)

- La fibre arrive dans la commune
Communes et opérateurs, vous pouvez gagner du temps
Avant de vous lancer dans une opération d’adressage et d’engager les finances de la commune, prenez connaissance des actions nécessaires et suffisantes : 

[Télécharger les obligations relatives à l'adresse](https://adresse.data.gouv.fr/data/docs/communes-operateurs-obligations-adresse-v2.0.pdf)

*(mettre dans un encart)*
Les guides sont régulièrement actualisés. Si vous téléchargez la version PDF, pensez à vérifier que vous disposez de la dernière version en vigueur. Le type de version et les dates de mises à jour figurent à la fin des PDF.



La Foire Aux Questions de la BAL (FAQ)
Vous vous posez des questions sur la création de votre Base Adresse Locale et sur la gestion de vos adresses ? Certaines disposent déjà d’une réponse !
Cette FAQ est alimentée par les échanges avec les élus et agents des communes compilés dans les tchats des webinaires des communes.
[Accéder à la FAQ](https://adresse-data-gouv-fr.gitbook.io/faq)
