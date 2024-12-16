import { theme } from './theme'

const NUMEROS_POINT_MIN = 12
const NUMEROS_MIN = 17
const VOIE_COLOR = '#4a4a4a'
const VOIE_MIN = 12
const VOIE_MAX = NUMEROS_MIN
const TOPONYME_MIN = 11
const TOPONYME_MAX = NUMEROS_MIN + 2
const TOPONYME_COLOR = '#7c5050'
export const PARCELLES_MINZOOM = 14

export const defaultLayerPaint = [
  'case',
  ['==', ['get', 'sourcePosition'], 'bal'],
  theme.bal,
  theme.noBal,
]
export const defaultLayerDraw = [
  'case',
  ['==', ['get', 'certifie'], true],
  theme.certified,
  theme.noCertified,
]

export const adresseCircleLayer = {
  'id': 'adresse',
  'source': 'base-adresse-nationale',
  'source-layer': 'adresses',
  'type': 'circle',
  'minzoom': NUMEROS_POINT_MIN,
  'paint': {
    'circle-opacity': [
      'interpolate',
      ['linear'], ['zoom'],
      10.5, 0,
      14, 1,
    ],
    'circle-color': defaultLayerPaint,
    'circle-radius': [
      'interpolate',
      ['linear'], ['zoom'],
      10, 0.1,
      15.5, 2.5,
      19, 7,
    ],
    'circle-stroke-color': defaultLayerDraw,
    'circle-stroke-width': [
      'interpolate',
      ['linear'], ['zoom'],
      15, 0.1,
      17, 3.5,
    ],
  },
}

export const adresseLabelLayer = {
  'id': 'adresse-label',
  'source': 'base-adresse-nationale',
  'source-layer': 'adresses',
  'type': 'symbol',
  'minzoom': NUMEROS_MIN,
  'paint': {
    'text-color': defaultLayerPaint,
    'text-halo-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff',
    ],
    'text-halo-width': 1,
  },
  'layout': {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [NUMEROS_MIN, 13],
        [19, 16],
      ],
    },
    'text-field': [
      'case',
      ['has', 'suffixe'],
      [
        'format',
        ['get', 'numero'],
        {},
        ' ',
        {},
        ['get', 'suffixe'],
        {},
      ],
      ['get', 'numero'],
    ],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom'],
    'text-radial-offset': 1,
  },
}

export const adresseCompletLabelLayer = {
  'id': 'adresse-complet-label',
  'source': 'base-adresse-nationale',
  'source-layer': 'adresses',
  'type': 'symbol',
  'minzoom': NUMEROS_MIN,
  'filter': ['==', ['get', 'id'], ''],
  'paint': {
    'text-color': defaultLayerPaint,
    'text-halo-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff',
    ],
    'text-halo-width': 1,
  },
  'layout': {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [NUMEROS_MIN, 13],
        [19, 16],
      ],
    },
    'text-field': [
      'case',
      ['has', 'suffixe'],
      [
        'format',
        ['get', 'numero'],
        {},
        ' ',
        {},
        ['get', 'suffixe'],
        {},
        ' ',
        {},
        ['get', 'nomVoie'],
      ],
      [
        'format',
        ['get', 'numero'],
        {},
        ' ',
        {},
        ['get', 'nomVoie'],
      ],
    ],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom'],
    'text-radial-offset': 1,
  },
}

export const voieLayer = {
  'id': 'voie',
  'source': 'base-adresse-nationale',
  'source-layer': 'toponymes',
  'type': 'symbol',
  'filter': ['==', ['get', 'type'], 'voie'],
  'minzoom': VOIE_MIN,
  'maxzoom': VOIE_MAX,
  'paint': {
    'text-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#fff',
      VOIE_COLOR,
    ],
    'text-halo-width': 2,
    'text-halo-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff',
    ],
  },
  'layout': {
    'text-font': ['Noto Sans Bold'],
    'text-size': [
      'step',
      ['get', 'nbNumeros'],
      8,
      20,
      10,
      50,
      14,
      100,
      16,
    ],
    'text-field': ['get', 'nomVoie'],
  },
}

export const toponymeLayer = {
  'id': 'toponyme',
  'source': 'base-adresse-nationale',
  'source-layer': 'toponymes',
  'type': 'symbol',
  'filter': ['==', ['get', 'type'], 'lieu-dit'],
  'minzoom': TOPONYME_MIN,
  'maxzoom': TOPONYME_MAX,
  'paint': {
    'text-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#fff',
      TOPONYME_COLOR,
    ],
    'text-halo-width': 1,
    'text-halo-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff',
    ],
  },
  'layout': {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [0, 3],
        [10, 15],
      ],
    },
    'text-field': ['get', 'nomVoie'],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom', 'top', 'right', 'left'],
    'text-radial-offset': 0.1,
  },
}

export const cadastreLayers = [{
  'id': 'batiments-fill',
  'type': 'fill',
  'source': 'cadastre',
  'source-layer': 'batiments',
  'minzoom': PARCELLES_MINZOOM,
  'paint': {
    'fill-opacity': 0.3,
  },
  'layout': {
    visibility: 'none',
  },
},
{
  'id': 'batiments-line',
  'type': 'line',
  'source': 'cadastre',
  'source-layer': 'batiments',
  'minzoom': PARCELLES_MINZOOM,
  'maxzoom': 22,
  'layout': {
    visibility: 'none',
  },
  'paint': {
    'line-opacity': 1,
    'line-color': 'rgba(0, 0, 0, 1)',
  },
},
{
  'id': 'parcelles',
  'type': 'line',
  'source': 'cadastre',
  'source-layer': 'parcelles',
  'minzoom': PARCELLES_MINZOOM,
  'maxzoom': 24,
  'layout': {
    visibility: 'none',
  },
  'paint': {
    'line-color': '#0053b3',
    'line-opacity': 0.9,
    'line-width': {
      stops: [
        [
          16,
          1,
        ],
        [
          17,
          2,
        ],
      ],
    },
  },
},
{
  'id': 'parcelle-highlighted',
  'type': 'fill',
  'source': 'cadastre',
  'source-layer': 'parcelles',
  'filter': ['==', ['get', 'id'], ''],
  'minzoom': PARCELLES_MINZOOM,
  'layout': {
    visibility: 'none',
  },
  'paint': {
    'fill-color': '#0053b3',
    'fill-opacity': 0.5,
  },
},
{
  'id': 'code-parcelles',
  'type': 'symbol',
  'source': 'cadastre',
  'source-layer': 'parcelles',
  'minzoom': PARCELLES_MINZOOM,
  'layout': {
    'visibility': 'none',
    'text-field': '{numero}',
    'text-font': [
      'Noto Sans Bold',
    ],
    'text-allow-overlap': false,
    'text-size': 16,
  },
  'paint': {
    'text-halo-color': '#fff6f1',
    'text-halo-width': 1.5,
    'text-translate-anchor': 'map',
  },
}]
