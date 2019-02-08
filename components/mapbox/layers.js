import theme from '../../styles/theme'

import {NUMEROS_FILTERS, SELECTED_NUMEROS_FILTERS, DELETED_FILTER} from './filters'

const NUMEROS_POINT_MIN = 12
const NUMEROS_MIN = 17

export const numerosPointLayer = {
  id: 'numeros-point',
  type: 'circle',
  source: 'numeros',
  minzoom: NUMEROS_POINT_MIN,
  maxzoom: NUMEROS_MIN,
  filter: NUMEROS_FILTERS,
  paint: {
    'circle-color': {
      type: 'identity',
      property: 'color'
    },
    'circle-radius': {
      stops: [
        [NUMEROS_POINT_MIN, 0.5],
        [NUMEROS_MIN, 4]
      ]
    }
  }
}

export const numerosLayer = {
  id: 'numeros',
  type: 'symbol',
  source: 'numeros',
  minzoom: NUMEROS_MIN,
  filter: NUMEROS_FILTERS,
  paint: {
    'text-color': '#fff',
    'text-halo-color': {
      type: 'identity',
      property: 'color'
    },
    'text-halo-width': 1
  },
  layout: {
    'text-font': ['Roboto Regular'],
    'text-field': '{numeroComplet}',
    'text-ignore-placement': true
  }
}

export const selectedNumerosLayer = {
  id: 'selected-numeros',
  type: 'symbol',
  source: 'numeros',
  filter: SELECTED_NUMEROS_FILTERS,
  paint: {
    'text-color': '#fff',
    'text-halo-color': {
      type: 'identity',
      property: 'color'
    },
    'text-halo-width': 2
  },
  layout: {
    'text-font': ['Roboto Regular'],
    'text-field': '{numeroComplet}',
    'text-ignore-placement': true
  }
}

export const numeroLayer = {
  id: 'numero',
  type: 'circle',
  minzoom: NUMEROS_MIN,
  source: 'numero',
  filter: NUMEROS_FILTERS,
  paint: {
    'circle-color': {
      type: 'identity',
      property: 'color'
    },
    'circle-radius': 4
  }
}

export const numeroSourceLayer = {
  id: 'numero-source',
  type: 'symbol',
  source: 'numero',
  minzoom: NUMEROS_MIN,
  filter: NUMEROS_FILTERS,
  paint: {
    'text-color': theme.primary,
    'text-halo-color': {
      type: 'identity',
      property: 'color'
    },
    'text-halo-width': 1
  },
  layout: {
    'text-font': ['Roboto Regular'],
    'text-field': '{source}',
    'text-size': 10,
    'text-offset': [0, 2]
  }
}

export const numeroTypeLayer = {
  id: 'numero-type',
  type: 'symbol',
  source: 'numero',
  minzoom: NUMEROS_MIN,
  filter: NUMEROS_FILTERS,
  paint: {
    'text-color': theme.primary,
    'text-halo-color': '#fff',
    'text-halo-width': 1
  },
  layout: {
    'text-font': ['Roboto Regular'],
    'text-field': '{type}'
  }
}

export const voiesLayer = {
  id: 'voies',
  type: 'symbol',
  source: 'voies',
  maxzoom: NUMEROS_MIN,
  filter: DELETED_FILTER,
  paint: {
    'text-halo-color': '#DDD',
    'text-halo-width': 2
  },
  layout: {
    'text-field': [
      'format',
      ['upcase', ['get', 'nomVoie']],
      {'font-scale': 0.8},
      '\n',
      {},
      ['downcase', ['get', 'numerosCount']],
      {'font-scale': 0.6},
      ' numéros',
      {'font-scale': 0.6}
    ],
    'text-anchor': 'top',
    'text-font': ['Roboto Regular']
  }
}
