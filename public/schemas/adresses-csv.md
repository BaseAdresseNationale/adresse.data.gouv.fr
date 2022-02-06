# Schéma des données “Adresses” au format CSV

Le séparateur point-virgule et l'encodage UTF-8 sont utilisés.

| Nom du champ | Description | Changements |
| --- | --- | --- |
| `id` | Clé d’interopérabilité telle que définie dans la [spécification du format d'échange BAL 1.3](https://aitf-sig-topo.github.io/voies-adresses/files/AITF_SIG_Topo_Format_Base_Adresse_Locale_v1.3.pdf). Lorsqu'aucun code FANTOIR n'est connu, un code transitoire composé de 6 caractères alpha-numériques est généré. | |
| `id_fantoir` | Identifiant FANTOIR de la voie, le cas échant. L'identifiant est préfixé par la commune de rattachement FANTOIR (commune actuelle ou commune ancienne) | |
| `numero` | Numéro de l’adresse dans la voie | |
| `rep` | Indice de répétition associé au numéro (par exemple `bis`, `a`…) | |
| `nom_voie` | Nom de la voie en minuscules accentuées | Le libellé est systématiquement amélioré|
| `code_postal` | Code postal du bureau de distribution de la voie | |
| `code_insee` | Code INSEE de la commune actuelle sur la base du Code Officiel géographique en vigueur | |
| `nom_commune` | Nom officiel de la commune actuelle | |
| `code_insee_ancienne_commune` | Code INSEE de l'ancienne commune sur laquelle est située l'adresse | |
| `nom_ancienne_commune` | Nom de l'ancienne commune sur laquelle est située l'adresse | |
| `x` | Coordonnées cartographique en projection légale | |
| `y` | Coordonnées cartographique en projection légale | |
| `lon` | Longitude en WGS-84 | |
| `lat` | Latitude en WGS-84 | |
| `type_position` | Type de position telle que définie dans la [spécification du format d'échange BAL 1.3](https://aitf-sig-topo.github.io/voies-adresses/files/AITF_SIG_Topo_Format_Base_Adresse_Locale_v1.3.pdf). Peut-être vide si inconnu ou non renseigné. | Nouveau champ |
| `alias` | _Vide_ | |
| `nom_ld` | Nom du lieu-dit de rattachement (ou autre type de toponyme) | |
| `libelle_acheminement` | Nom de la commune d’acheminement | |
| `nom_afnor` | Nom de la voie normalisé selon la norme postale | |
| `source_position` | Source de la position géographique. Valeurs possibles : (`commune`, `cadastre`, `arcep`, `laposte`, `insee`, `sdis`, `inconnue`) | |
| `source_nom_voie` | Source du nom de la voie. Valeurs possibles : (`commune`, `cadastre`, `arcep`, `laposte`, `insee`, `sdis`, `inconnue`) | |
| `certification_commune` | Indique si l’adresse a été certifiée par la commune. Valeurs possibles : (`1` pour oui, `0` pour non) | Nouveau champ |
| `cad_parcelles` | Liste les identifiants des parcelles cadastrales auxquelles l’adresse est rattachée, si l'information est connue. Codage de l’identifiant sur 14 caractères. Séparateur `\|`. Donnée en cours de fiabilisation | Nouveau champ. **Expérimental** |
