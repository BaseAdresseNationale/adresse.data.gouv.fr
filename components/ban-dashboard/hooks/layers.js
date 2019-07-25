import {useMemo} from 'react'

export const COLORS = {
  green: '#7fff7a',
  yellow: '#ffff00',
  orange: '#ff9900',
  red: '#ff2a2e',
  purple: '#6D029F',
  black: '#000'
}

export const fillColor = [
  'step',
  ['get', 'ecart'],
  COLORS.green,
  0.05,
  COLORS.yellow,
  0.1,
  COLORS.orange,
  0.2,
  COLORS.red,
  0.4,
  COLORS.purple,
  1,
  '#000'
]

export const unSelectFillColor = [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  fillColor,
  '#000'
]

const lineLayerPaint = {
  'line-width': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    3,
    1
  ]
}

const fillLayerPaint = {
  'fill-color': fillColor,
  'fill-opacity': [
    'interpolate',
    ['exponential', 0.1],
    ['get', 'total'],
    0,
    0,
    1,
    0.1,
    200,
    0.2,
    400,
    0.3,
    800,
    0.4,
    1000,
    0.5,
    5000,
    0.6,
    10000,
    0.7,
    50000,
    0.8,
    100000,
    0.9,
    200000,
    1
  ]
}

export default function useLayers(departements, communes) {
  return useMemo(() => {
    const layers = []

    if (departements) {
      layers.push({
        id: 'departements-fill',
        source: 'departements',
        type: 'fill',
        paint: fillLayerPaint
      })
      layers.push({
        id: 'departements-line',
        source: 'departements',
        type: 'line',
        paint: lineLayerPaint
      })
    }

    if (communes) {
      layers.push({
        id: 'communes-fill',
        source: 'communes',
        type: 'fill',
        paint: fillLayerPaint
      })
      layers.push({
        id: 'communes-line',
        source: 'communes',
        type: 'line',
        paint: lineLayerPaint
      })
    }

    return layers
  }, [departements, communes])
}
