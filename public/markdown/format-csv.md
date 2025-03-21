---
title: Format CSV

---

## Format .csv pour un usage classique

Emprise : nationale et départementale, lieux-dits dans des fichiers séparés en fin de liste


Le séparateur point-virgule et l'encodage UTF-8 sont utilisés. 

Le contenu de ce fichier est optimisé pour satisfaire la majorité des usages. 

Il ne met pas à disposition l'intégralité des informations présentes dans la BAN. 
En particulier : 
- une seule position par adresse est servie
- la dénomination est présentée en une seule langue
- Les évolutions sur les nouveaux Idban ne peuvent être intégrées dans ce fichier sans briser la rétrocompatibilité. 

Deux versions temporaires des fichiers sont donc également mis à disposition pour récupérer ces éléments : 
- Un fichier csv intégrant les nouveaux id BAN : [csv-with-ids](/data/ban/adresses/latest)
- Un fichier csv département au format BAL intégrant les noms en langues régionales : [csv-bal-with-lang](/data/ban/adresses/latest)