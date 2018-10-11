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
        base: 1.75,
        stops: [[12, 2], [22, 150]]
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
      'text-offset': [0, 1.2]
    }
  }
]
