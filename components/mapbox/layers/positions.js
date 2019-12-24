const POSITIONS_COLORS = [
  'case',
  ['==', ['get', 'source'], 'ban'],
  '#cf6783',
  ['==', ['get', 'source'], 'bano'],
  '#418864',
  ['==', ['get', 'source'], 'cadastre'],
  '#8C5FF5',
  ['==', ['get', 'source'], 'bal'],
  '#f47733',
  ['==', ['get', 'source'], 'ftth'],
  '#0c4cb2',
  ['==', ['get', 'destination'], 'habitation'],
  '#21BA45',
  ['==', ['get', 'destination'], 'commerce'],
  '#53DD9E',
  ['==', ['get', 'destination'], 'site-touristique'],
  '#A1003C',
  ['==', ['get', 'destination'], 'site-industriel'],
  '#a5673f',
  ['==', ['get', 'destination'], 'dependance-batie-isolee'],
  '#FBBD08',
  ['==', ['get', 'destination'], 'installations-techniques'],
  '#F2711C',
  ['==', ['get', 'destination'], 'local-commun'],
  '#00B5AD',
  ['==', ['get', 'destination'], 'divers'],
  '#DDDDDD',
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
