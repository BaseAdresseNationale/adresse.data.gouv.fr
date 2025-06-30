---
title: Service de Géocodage Géoplateforme
---

## Descriptif du service

Il existe 2 types de geocodage (direct et inverse):

* Le service de géocodage **direct**  permet de fournir les coordonnées géographiques d’une adresse postale, d’un lieu ou de parcelles cadastrales à partir d’une requête HTTP.
* Le service de géocodage **inverse** a pour but de retourner, à partir d’un ou plusieurs points géographiques indiqués en latitude/longitude, la ou les entités géolocalisées les plus proches correspondantes, parmi les adresses, toponymes, parcelles cadastrales, et/ou unités administratives.

**Ces deux types de géocodage se déclinent sous la forme d'appels unitaires, ou regroupés par fichiers (géocodage en masse de fichiers csv)**

Vous pouvez avoir plus d'informations sur l'utilisation en consultant [la documentation du Service Géoplateforme de Géocodage](https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage)

## Limite d'usage

Pour garantir un usage équitable de ce service très sollicité, une limite d'usage est appliquée. Elle est de **50 appels/IP/seconde.**

Lorsqu'une IP sollicite l' API au-delà de la limite d'usage fixée :

*Une erreur HTML 429 (Too Many Requests) est envoyée en réponse à toute requête*

Ce blocage intervient pour une durée de 5 secondes;
La durée du blocage est indiquée dans un header "retry-after", avec une durée initialisée à 5 secondes et qui décroît à partir du moment où la sur-sollicitation cesse.*  


2 options s’offrent à vous :
*  Vous pouvez installer une instance de l’API sur vos propres serveurs. Nous vous indiquons la marche à suivre sur cette page : [Installer une instance docker avec les données de la BAN](https://geoplateforme.pages.gpf-tech.ign.fr/geocodage/geocodeur/user/installation/)
*  Vous êtes un acteur public ET vous ne pouvez pas installer d’instance sur votre Système d’Information : vous pouvez demander une levée de cette limite en remplissant un formulaire sur [la page contact géoservices de l'IGN](https://www.demarches-simplifiees.fr/commencer/demande-de-levee-de-limite-de-l-api-base-adresse)  
 
 
  
### Exemple de fonctionnement 

Prenons l'exemple du géocodage d’un fichier de 1000 lignes au moyen d’un script faisant appel à l’API de géocodage de la Géoplateforme.

Si le script sollicite l'API de géocodage sans précaution particulière, avec une fréquence qui dépasse la limite d'usage de 50 requêtes par seconde et par IP, alors :

* Les 50 premiers appels sont traités normalement ;
* Le 51ème appel et les suivants sont bloqués tant que le script continue à solliciter l'API de géocodage au-delà de la limite de 50 requêtes par seconde et que le délai de 5 secondes qui s'en suit n'est pas écoulé.

#### Solution: 
Paramétrer le script de telle sorte que la fréquence d'appel à l'API de géocodage ne dépasse pas 50 requêtes par seconde, en instaurant par exemple un plafond à 40 ou 45 requêtes pas seconde.

A titre d'illustration, pour une utilisation de l'ETL "FME" édité par Safe Software, le paramétrage de la fréquence d'appel peut être effectué comme suit :
Paramétrage de la fréquence d'appel à une API dans FME


![Exemple avec FME](/img/pages/outils/rate-limiting-fme.png)