# Schéma des données “Adresses” au format CSV

Le séparateur point-virgule et l'encodage UTF-8 sont utilisés.

Ce format est **largement compatible** avec l'[ancien format CSV](ban-2015.md) qui a servi à la diffusion des données BAN de 2015 à fin 2018.

| Nom du champ | Description | Changements |
| --- | --- | --- |
| `id` | Clé d’interopérabilité telle que définie dans la [spécification du format d'échange BAL 1.1](https://cms.geobretagne.fr/sites/default/files/documents/aitf-sig-topo-adresse-fichier-echange-simplifie-v_1.1_0.pdf). Lorsqu'aucun code FANTOIR n'est connu, un code transitoire composé de 6 caractères alpha-numériques est généré. | Passage de l'identifiant BDUNI à la clé d'interopérabilité|
| `id_fantoir` | Identifiant FANTOIR de la voie, le cas échant | L'identifiant est préfixé par la commune de rattachement FANTOIR (commune actuelle ou commune ancienne) |
| `numero` | Numéro de l’adresse dans la voie | |
| `rep` | Indice de répétition associé au numéro (par exemple `bis`, `a`…) | |
| `nom_voie` | Nom de la voie en minuscules accentuées | Le libellé est systématiquement amélioré|
| `code_postal` | Code postal du bureau de distribution de la voie | |
| `code_insee` | Code INSEE de la commune actuelle sur la base du Code Officiel géographique en vigueur | |
| `nom_commune` | Nom officiel de la commune actuelle | |
| `code_insee_ancienne_commune` | Code INSEE de l'ancienne commune sur laquelle est située l'adresse | Nouveau champ |
| `nom_ancienne_commune` | Nom de l'ancienne commune sur laquelle est située l'adresse | Nouveau champ |
| `x` | Coordonnées cartographique en projection légale | |
| `y` | Coordonnées cartographique en projection légale | |
| `lon` | Longitude en WGS-84 | |
| `lat` | Latitude en WGS-84 | |
| `alias` | _Vide_ | Mis à vide |
| `nom_ld` | _Vide_ | Mis à vide |
| `nom_afnor` | Nom de la voie normalisé selon la norme postale | |
| `libelle_acheminement` | Nom de la commune d’acheminement | |
