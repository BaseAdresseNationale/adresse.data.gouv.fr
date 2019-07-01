const NUMEROS_POINT_MIN = 12
const NUMEROS_MIN = 17

export function getNumerosPointLayer(style) {
  const layer = {
    id: 'numeros-point',
    type: 'circle',
    source: 'positions',
    interactive: true,
    minzoom: NUMEROS_POINT_MIN,
    maxzoom: NUMEROS_MIN,
    paint: {
      'circle-color': {
        type: 'identity',
        property: 'color'
      },
      'circle-opacity': {
        type: 'identity',
        property: 'opacity'
      },
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
    source: 'positions',
    interactive: true,
    minzoom: NUMEROS_MIN,
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': {
        type: 'identity',
        property: 'color'
      },
      'text-halo-width': {
        stops: [
          [12, 1.5],
          [18, 2]
        ]
      },
      'text-opacity': {
        type: 'identity',
        property: 'opacity'
      }
    },
    layout: {
      'text-font': ['Noto Sans Regular'],
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
      'text-ignore-placement': true
    }
  }

  return layer
}
