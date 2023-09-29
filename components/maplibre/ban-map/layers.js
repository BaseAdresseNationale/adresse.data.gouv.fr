import theme from '@/styles/theme'
import {positionsColors} from '@/components/base-adresse-nationale/positions-types'

export const sources = {
  bal: {name: 'Base Adresse Locale', color: '#009E73'},
  cadastre: {name: 'Cadastre', color: '#56B4E9'},
  ftth: {name: 'Opérateur THD', color: '#E69F00'},
  'ign-api-gestion-ign': {name: 'IGN', color: '#0072B2'},
  'ign-api-gestion-laposte': {name: 'La Poste', color: '#F0E442'},
  'ign-api-gestion-sdis': {name: 'SDIS (Pompiers)', color: '#D55E00'},
  'ign-api-gestion-municipal_administration': {name: 'Guichet Adresse', color: '#CC79A7'}
}

export const defaultLayerPaint = [
  'case',
  ['==', ['get', 'certifie'], true],
  theme.successBorder,
  ['==', ['get', 'sourcePosition'], 'bal'],
  theme.border,
  theme.warningBorder
]

export const sourcesLayerPaint = {
  type: 'categorical',
  property: 'sourcePosition',
  stops: Object.keys(sources).map(key => {
    const {color} = sources[key]
    return [key, color]
  })
}

const NUMEROS_POINT_MIN = 12
const NUMEROS_MIN = 17
const VOIE_COLOR = '#4a4a4a'
const VOIE_MIN = 12
const VOIE_MAX = NUMEROS_MIN
const TOPONYME_MIN = 11
const TOPONYME_MAX = NUMEROS_MIN + 2
const TOPONYME_COLOR = '#7c5050'
const COMMUNNE_MIN = 9
export const PARCELLES_MINZOOM = 14

const getColors = () => {
  const array = []
  Object.keys(positionsColors).forEach(key => {
    array.push(key, positionsColors[key].color)
  })

  return [...array]
}

const colors = getColors()

export const positionsCircleLayer = {
  id: 'positions',
  source: 'positions',
  type: 'circle',
  paint: {
    'circle-color': 'transparent',
    'circle-stroke-color': [
      'match', ['get', 'type'], ...colors, '#000'
    ],
    'circle-stroke-width': 3,
    'circle-radius': {
      stops: [
        [12, 0.8],
        [17, 5]
      ]
    }
  }
}

export const positionsLabelLayer = {
  id: 'positions-label',
  source: 'positions',
  type: 'symbol',
  minzoom: NUMEROS_MIN,
  paint: {
    'text-color': ['match', ['get', 'type'], ...colors, '#000']
  },
  layout: {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [NUMEROS_MIN, 13],
        [19, 16]
      ]
    },
    'text-field': [
      'case',
      ['has', 'suffixe'],
      [
        'format',
        ['get', 'numero'],
        ' ',
        ['get', 'suffixe'],
        ' - ',
        ['get', 'type'],
      ],
      [
        'format',
        ['get', 'numero'],
        ' - ',
        ['get', 'type'],
      ]
    ],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom'],
    'text-radial-offset': 1
  }
}

export const adresseCircleLayer = {
  id: 'adresse',
  source: 'base-adresse-nationale',
  'source-layer': 'adresses',
  type: 'circle',
  minzoom: NUMEROS_POINT_MIN,
  paint: {
    'circle-color': defaultLayerPaint,
    'circle-stroke-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff'
    ],
    'circle-stroke-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      2,
      0
    ],
    'circle-radius': {
      stops: [
        [12, 0.8],
        [17, 6]
      ]
    }
  }
}

export const adresseLabelLayer = {
  id: 'adresse-label',
  source: 'base-adresse-nationale',
  'source-layer': 'adresses',
  type: 'symbol',
  minzoom: NUMEROS_MIN,
  paint: {
    'text-color': defaultLayerPaint,
    'text-halo-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff'
    ],
    'text-halo-width': 1
  },
  layout: {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [NUMEROS_MIN, 13],
        [19, 16]
      ]
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
        {}
      ],
      ['get', 'numero']
    ],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom'],
    'text-radial-offset': 1
  }
}

export const adresseCompletLabelLayer = {
  id: 'adresse-complet-label',
  source: 'base-adresse-nationale',
  'source-layer': 'adresses',
  type: 'symbol',
  minzoom: NUMEROS_MIN,
  filter: ['==', ['get', 'id'], ''],
  paint: {
    'text-color': defaultLayerPaint,
    'text-halo-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff'
    ],
    'text-halo-width': 1
  },
  layout: {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [NUMEROS_MIN, 13],
        [19, 16]
      ]
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
        ['get', 'nomVoie']
      ],
      [
        'format',
        ['get', 'numero'],
        {},
        ' ',
        {},
        ['get', 'nomVoie']
      ]
    ],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom'],
    'text-radial-offset': 1
  }
}

export const voieLayer = {
  id: 'voie',
  source: 'base-adresse-nationale',
  'source-layer': 'toponymes',
  type: 'symbol',
  filter: ['==', ['get', 'type'], 'voie'],
  minzoom: VOIE_MIN,
  maxzoom: VOIE_MAX,
  paint: {
    'text-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#fff',
      VOIE_COLOR
    ],
    'text-halo-width': 2,
    'text-halo-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff'
    ]
  },
  layout: {
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
      16
    ],
    'text-field': ['get', 'nomVoie']
  }
}

export const toponymeLayer = {
  id: 'toponyme',
  source: 'base-adresse-nationale',
  'source-layer': 'toponymes',
  type: 'symbol',
  filter: ['==', ['get', 'type'], 'lieu-dit'],
  minzoom: TOPONYME_MIN,
  maxzoom: TOPONYME_MAX,
  paint: {
    'text-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#fff',
      TOPONYME_COLOR
    ],
    'text-halo-width': 1,
    'text-halo-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      theme.primary,
      '#fff'
    ]
  },
  layout: {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [0, 3],
        [10, 15]
      ]
    },
    'text-field': ['get', 'nomVoie'],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom', 'top', 'right', 'left'],
    'text-radial-offset': 0.1
  }
}

export const cadastreLayers = [{
  id: 'batiments-fill',
  type: 'fill',
  source: 'cadastre',
  'source-layer': 'batiments',
  minzoom: PARCELLES_MINZOOM,
  paint: {
    'fill-opacity': 0.3
  },
  layout: {
    visibility: 'none'
  }
},
{
  id: 'batiments-line',
  type: 'line',
  source: 'cadastre',
  'source-layer': 'batiments',
  minzoom: PARCELLES_MINZOOM,
  maxzoom: 22,
  layout: {
    visibility: 'none'
  },
  paint: {
    'line-opacity': 1,
    'line-color': 'rgba(0, 0, 0, 1)'
  }
},
{
  id: 'parcelles',
  type: 'line',
  source: 'cadastre',
  'source-layer': 'parcelles',
  minzoom: PARCELLES_MINZOOM,
  maxzoom: 24,
  layout: {
    visibility: 'none'
  },
  paint: {
    'line-color': '#0053b3',
    'line-opacity': 0.9,
    'line-width': {
      stops: [
        [
          16,
          1
        ],
        [
          17,
          2
        ]
      ]
    }
  }
},
{
  id: 'parcelle-highlighted',
  type: 'fill',
  source: 'cadastre',
  'source-layer': 'parcelles',
  filter: ['==', ['get', 'id'], ''],
  minzoom: PARCELLES_MINZOOM,
  layout: {
    visibility: 'none'
  },
  paint: {
    'fill-color': '#0053b3',
    'fill-opacity': 0.5
  }
},
{
  id: 'code-parcelles',
  type: 'symbol',
  source: 'cadastre',
  'source-layer': 'parcelles',
  minzoom: PARCELLES_MINZOOM,
  layout: {
    visibility: 'none',
    'text-field': '{numero}',
    'text-font': [
      'Noto Sans Bold'
    ],
    'text-allow-overlap': false,
    'text-size': 16
  },
  paint: {
    'text-halo-color': '#fff6f1',
    'text-halo-width': 1.5,
    'text-translate-anchor': 'map'
  }
}]
