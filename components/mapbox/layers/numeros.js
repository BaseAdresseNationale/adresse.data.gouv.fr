const NUMEROS_POINT_MIN = 12
const NUMEROS_MIN = 17

export function getNumerosPointLayer(style) {
  const layer = {
    id: 'numeros-point',
    type: 'circle',
    source: 'numeros',
    interactive: true,
    minzoom: NUMEROS_POINT_MIN,
    maxzoom: NUMEROS_MIN,
    paint: {
      'circle-color': {
        type: 'identity',
        property: 'color'
      },
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.6
      ],
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

export function getNumerosLabelLayer() {
  const layer = {
    id: 'numeros-label',
    type: 'symbol',
    source: 'numeros',
    interactive: true,
    minzoom: NUMEROS_MIN,
    paint: {
      'text-color': {
        type: 'identity',
        property: 'color'
      },
      'text-halo-color': '#ffffff',
      'text-halo-width': 1
    },
    layout: {
      'text-font': ['Noto Sans Bold'],
      'text-size': 18,
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
      'text-variable-anchor': ['bottom', 'top', 'right', 'left'],
      'text-radial-offset': 0.4
    }
  }

  return layer
}
