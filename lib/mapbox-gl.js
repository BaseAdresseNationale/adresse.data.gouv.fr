import theme from '../styles/theme'

export function pointOnPos(position) {
  const {lat, lng} = position

  return {
    type: 'Point',
    coordinates: [lng, lat]
  }
}

export function pointOnCoords(coords) {
  return {
    type: 'Point',
    coordinates: coords || [0, 0]
  }
}

export const numeroPointStyles = [
  {
    id: 'default-point',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'false']
    ],
    paint: {
      'circle-color': theme.secondaryDarken,
      'circle-radius': {
        stops: [
          [10, 2],
          [12, 4],
          [15, 10],
          [18, 16],
          [22, 20]
        ]
      }
    }
  },
  {
    id: 'highlight-active-point',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'true']
    ],
    paint: {
      'circle-radius': 10,
      'circle-color': theme.primaryLight
    }
  }
]

export const numeroIconStyles = [
  {
    id: 'point',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'false']
    ],
    paint: {
      'circle-radius': 10,
      'circle-stroke-width': 2,
      'circle-stroke-color': theme.primaryLight,
      'circle-color': theme.primary
    }
  },
  {
    id: 'highlight-active-point',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'true']
    ],
    paint: {
      'circle-radius': 10,
      'circle-stroke-width': 2,
      'circle-stroke-color': theme.primaryLight,
      'circle-color': '#fff'
    }
  },
  {
    id: 'type-point',
    type: 'symbol',
    layout: {
      'text-field': '{user_type}',
      'text-font': ['Roboto Regular'],
      'text-offset': [0, 1.2]
    }
  }
]
