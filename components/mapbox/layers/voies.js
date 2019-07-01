export function getVoiesLabelLayer(style) {
  const layer = {
    id: 'voie-label',
    interactive: true,
    type: 'symbol',
    source: 'voies',
    maxzoom: 17,
    paint: {
      'text-color': [
        'case',
        ['==', ['get', 'opacity'], 1],
        ['get', 'color'],
        '#000'
      ],
      'text-halo-color': '#f8f4f0',
      'text-halo-blur': 0.5,
      'text-halo-width': {
        stops: [
          [12, 1.5],
          [18, 2]
        ]
      }
    },
    layout: {
      'text-field': '{nomVoie}',
      'text-anchor': 'top',
      'text-size': {
        base: 1,
        stops: [
          [13, 13],
          [15, 14]
        ]
      },
      'text-font': ['Noto Sans Regular']
    }
  }

  if (style === 'ortho') {
    layer.paint['text-halo-color'] = '#ffffff'
  }

  return layer
}

export function getToponymesLabelLayer(style) {
  const layer = {
    id: 'toponyme-label',
    interactive: true,
    type: 'symbol',
    source: 'positions',
    paint: {
      'text-halo-color': '#f8f4f0',
      'text-halo-blur': 0.5,
      'text-halo-width': {
        stops: [
          [12, 1.5],
          [18, 2]
        ]
      }
    },
    filter: [
      '==', ['get', 'type'], 'toponyme'
    ],
    layout: {
      'text-field': '{nom}',
      'text-anchor': 'top',
      'text-size': {
        base: 1,
        stops: [
          [13, 13],
          [15, 14]
        ]
      },
      'text-font': ['Noto Sans Regular']
    }
  }

  if (style === 'ortho') {
    layer.paint['text-halo-color'] = '#ffffff'
  }

  return layer
}
