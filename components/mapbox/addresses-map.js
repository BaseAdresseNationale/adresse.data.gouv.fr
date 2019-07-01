import {useCallback} from 'react'
import PropTypes from 'prop-types'

import useSources from './hooks/sources'
import useLayers from './hooks/layers'

let hoveredStateId = null

const AddressesMap = ({map, contour, voies, numeros, onSelectContour, setSources, setLayers}) => {
  const sources = useSources(contour, voies, numeros)
  const layers = useLayers(contour, voies, numeros)

  setSources(sources)
  setLayers(layers)

  const onLoad = useCallback(() => {
    map.on('mousemove', 'contour-fill', e => onHover(e, 'contour'))
    map.on('mouseleave', 'contour-fill', onLeave)
    map.on('click', 'contour-fill', handleContourClick)
  })

  map.once('load', onLoad)

  const onHover = (e, source) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState({source: 'contour', id: hoveredStateId}, {hover: false})
      }

      hoveredStateId = e.features[0].id

      map.getCanvas().style.cursor = 'pointer'
      map.setFeatureState({source, id: hoveredStateId}, {hover: true})
    }
  }

  const onLeave = () => {
    if (hoveredStateId) {
      map.setFeatureState({source: 'contour', id: hoveredStateId}, {hover: false})
    }

    map.getCanvas().style.cursor = 'default'
    hoveredStateId = null
  }

  const handleContourClick = e => {
    const contourId = e.features[0].id
    onSelectContour(contourId)
  }

  return null
}

AddressesMap.defaultProps = {
  onSelectContour: () => {}
}

AddressesMap.propTypes = {
  map: PropTypes.object.isRequired,
  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  onSelectContour: PropTypes.func,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired
}

export default AddressesMap
