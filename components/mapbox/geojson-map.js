import PropTypes from 'prop-types'

const GeojsonMap = ({data, setSources, setLayers}) => {
  const sources = [
    {
      type: 'geojson',
      name: 'data',
      generateId: true,
      data
    }
  ]
  const layers = [
    {
      id: 'point',
      type: 'circle',
      source: 'data',
      paint: {
        'circle-radius': 5,
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#2c3e50',
          '#3099df'
        ],
        'circle-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.8,
          0.6
        ]
      },
      filter: ['==', '$type', 'Point']
    },
    {
      id: 'polygon-fill',
      type: 'fill',
      source: 'data',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#2c3e50',
          '#3099df'
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.5,
          0.3
        ]
      },
      filter: ['==', '$type', 'Polygon']
    },
    {
      id: 'polygon-outline',
      type: 'line',
      source: 'data',
      paint: {
        'line-color': '#4790E5',
        'line-width': 2
      },
      filter: ['==', '$type', 'Polygon']
    },
    {
      id: 'line',
      type: 'line',
      source: 'data',
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#2c3e50',
          '#3099df'
        ],
        'line-width': 5,
        'line-opacity': 0.8
      },
      filter: ['==', '$type', 'LineString']
    }
  ]

  setSources(sources)
  setLayers(layers)

  return null
}

GeojsonMap.propTypes = {
  data: PropTypes.shape({
    features: PropTypes.array.isRequired
  }).isRequired,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired
}

export default GeojsonMap
