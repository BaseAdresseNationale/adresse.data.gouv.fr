import {getType} from '@/lib/types'

const POSITIONS_COLORS = [
  'case',
  ['==', ['get', 'source'], 'commune'],
  getType('commune').background,
  ['==', ['get', 'source'], 'insee'],
  getType('insee').background,
  ['==', ['get', 'source'], 'sdis'],
  getType('sdis').background,
  ['==', ['get', 'source'], 'laposte'],
  getType('laposte').background,
  ['==', ['get', 'source'], 'ign'],
  getType('ign').background,
  ['==', ['get', 'source'], 'cadastre'],
  getType('cadastre').background,
  ['==', ['get', 'source'], 'arcep'],
  getType('arcep').background,
  '#53657D'
]

export function getPositionsPointLayer(style) {
  const layer = {
    id: 'positions-point',
    type: 'circle',
    source: 'positions',
    interactive: true,
    paint: {
      'circle-color': POSITIONS_COLORS,
      'circle-radius': {
        stops: [
          [12, 0.8],
          [17, 6]
        ]
      },
      'circle-stroke-color': '#f8f4f0',
      'circle-stroke-width': {
        stops: [
          [12, 0.3],
          [17, 0.8]
        ]
      }
    }
  }

  if (style === 'ortho') {
    layer.paint['circle-stroke-color'] = '#ffffff'
  }

  return layer
}

export function getPositionsLabelLayer(style) {
  const layer = {
    id: 'positions-label',
    type: 'symbol',
    source: 'positions',
    interactive: true,
    paint: {
      'text-color': POSITIONS_COLORS,
      'text-halo-color': '#ffffff',
      'text-halo-width': {
        stops: [
          [12, 1.5],
          [18, 2]
        ]
      }
    },
    layout: {
      'text-font': ['Noto Sans Bold'],
      'text-field': '{source}',
      'text-variable-anchor': ['bottom', 'top', 'right', 'left'],
      'text-radial-offset': 1
    }
  }

  if (style === 'ortho') {
    layer.paint['circle-stroke-color'] = '#ffffff'
  }

  return layer
}
