---
title: Service de géocodage Géoplateforme
---


Le Service de géocodage Géoplateforme permet d'effectuer rapidement une recherche d’adresse, mais aussi associer selon plusieurs critères des coordonnées à une adresse, un point d'intérêt ou une parcelle cadastrale.

Il existe 2 types de geoocodage (direct et inverse):

* Le service de géocodage **direct**  permet de fournir les coordonnées géographiques d’une adresse postale, d’un lieu ou de parcelles cadastrales à partir d’une requête HTTP.
* Le service de géocodage **inverse** a pour but de retourner, à partir d’un ou plusieurs points géographiques indiqués en latitude/longitude, la ou les entités géolocalisées les plus proches correspondantes, parmi les adresses, toponymes, parcelles cadastrales, et/ou unités administratives.

Vous pouvez avoir plus d'informations sur les fonctionnalités en consultant [la documentation Service Géoplateforme de Géocodage](https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage)

Vous atteignez fréquemment la limite de requête de l’API, fixée à 50 appels / seconde/ IP ?

2 options s’offrent à vous :
*  Vous pouvez installer une instance de l’API sur vos propres serveurs. Nous vous indiquons la marche à suivre sur cette page : [Installer une instance docker avec les données de la BAN](https://github.com/BaseAdresseNationale/addok-docker#installer-une-instance-avec-les-donn%C3%A9es-de-la-base-adresse-nationale)
*  Vous êtes un acteur public ET vous ne pouvez pas installer d’instance sur votre Système d’Information : vous pouvez demander une levée de cette limite en remplissant un formulaire sur [la page contact géoservices de l'IGN](https://geoservices.ign.fr/contact)
*  


