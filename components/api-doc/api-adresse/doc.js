// Fields
const q = {name: 'q', description: 'Chaîne de caractère recherchée', type: 'string'}
const limit = {name: 'limit', description: 'Contrôle le nombre d’éléments retournés', type: 'number'}
const autocomplete = {name: 'autocomplete', description: 'Active/désactive les traitements d’auto-complétion', type: 'number'}
const _type = {name: 'type', description: 'Type de résultat attendu', type: 'string', data: ['housenumber', 'street', 'locality', 'municipality']}
const lat = {name: 'lat', description: 'Latitude (en degrés)', type: 'string'}
const lon = {name: 'lon', description: 'Longitude (en degrés)', type: 'string'}

const params = [
  q,
  limit,
  autocomplete,
  _type,
  lat,
  lon
]

const subtype = [
  {name: ' housenumber', description: 'Numéro « à la plaque »', type: 'string'},
  {name: ' street', description: 'Position « à la voie », placé approximativement au centre de celle - ci', type: 'string'},
  {name: ' locality', description: 'Lieu-dit', type: 'string'},
  {name: ' municipality', description: 'Numéro « à la commune »', type: 'string'}
]

// Arguments
const id = {name: ' id', description: 'Identifiant de l’adresse(clef d’interopérabilité)', type: 'string'}
const type = {name: ' type', description: 'Type de résultat trouvé', type: 'string', subs: subtype}
const score = {name: ' score', description: 'Valeur de 0 à 1 indiquant la pertinence du résultat', type: 'number'}
const housenumber = {name: ' housenumber', description: 'Numéro avec indice de répétition éventuel(bis, ter, A, B)', type: 'string'}
const name = {name: ' name', description: 'Numéro éventuel et nom de voie ou lieu dit', type: 'string'}
const postcode = {name: ' postcode', description: 'Code Postal', type: 'string'}
const citycode = {name: ' citycode', description: 'Code INSEE de la commune', type: 'string'}
const city = {name: ' city', description: 'Nom de la commune', type: 'string'}
const district = {name: ' district', description: 'Nom de l’arrondissement(Paris / Lyon / Marseille)', type: 'string'}
const oldcitycode = {name: ' oldcitycode', description: 'Code INSEE de la commune ancienne(le cas échéant)', type: 'string'}
const oldcity = {name: ' oldcity', description: 'Nom de la commune ancienne(le cas échéant)', type: 'string'}
const context = {name: ' context', description: 'N° de département, nom de département et de région', type: 'string'}
const label = {name: ' label', description: 'Libellé complet de l’adresse', type: 'string'}
const x = {name: ' x', description: 'Coordonnées géographique en projection légale', type: 'number'}
const y = {name: ' y', description: 'Coordonnées géographique en projection légale', type: 'number'}
const importance = {name: ' importance', description: 'Indicateur d’importance(champ technique)', type: 'number'}

const paths = [
  {
    name: '/search',
    description: 'Point d’entrée pour le géocodage',
    params
  },
  {
    name: '/search/csv',
    description: 'Point d’entrée pour le géocodage de masse à partir d’un fichier CSV',
    params: [
      {name: 'columns', description: 'Paramètre multiple définissant les colonnes à utiliser ', type: 'string'},
      {name: 'result_columns', description: 'Paramètre multiple permettant de filtrer les colonnes que doit retourner l’API. Cela permet d’alléger la réponse dans le cadre d’un processus industrialisé.'},
      {name: 'citycode', description: 'Précise le nom d’une colonne contenant le code INSEE', type: 'string'},
      {name: 'postcode', description: 'Précise le nom d’une colonne contenant le code Postal', type: 'string'}
    ],
    method: 'post',
    body: {
      name: 'data',
      description: 'Fichier CSV de moins de 50 Mo',
      type: 'file'
    }
  },
  {
    name: '/reverse',
    description: 'Point d’entrée pour le géocodage inverse',
    params: [
      lat,
      lon
    ]
  },
  {
    name: '/reverse/csv',
    description: 'Point d’entrée pour le géocodage inverse de masse à partir d’un fichier CSV',
    params: [],
    method: 'post',
    body: {
      name: 'data',
      description: 'Fichier CSV, encodé en UTF-8 et limité actuellement à 6 Mo devant contenir les colonnes latitude (ou lat) et longitude (ou lon ou lng)',
      type: 'file'
    }
  }
]

const defaultModel = {
  type: 'FeatureCollection',
  version: 'draft',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          2.290084,
          49.897443
        ]
      },
      properties: {
        label: '8 Boulevard du Port 80000 Amiens',
        score: 0.49159121588068583,
        housenumber: '8',
        id: '80021_6590_00008',
        type: 'housenumber',
        name: '8 Boulevard du Port',
        postcode: '80000',
        citycode: '80021',
        x: 648952.58,
        y: 6977867.25,
        city: 'Amiens',
        context: '80, Somme, Hauts-de-France',
        importance: 0.6706612694243868,
        street: 'Boulevard du Port'
      }
    }
  ],
  attribution: 'BAN',
  licence: 'ODbL 1.0',
  query: '8 bd du port',
  limit: 1
}

const defaultAttributs = [
  id,
  type,
  score,
  housenumber,
  name,
  postcode,
  citycode,
  city,
  context,
  label,
  x,
  y,
  importance
]

const optionAttributs = [
  district,
  oldcity,
  oldcitycode
]

export default {paths, defaultModel, defaultAttributs, optionAttributs}
