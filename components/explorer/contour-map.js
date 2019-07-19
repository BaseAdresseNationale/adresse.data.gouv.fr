import {useEffect} from 'react'
import PropTypes from 'prop-types'

import useSources from '../mapbox/hooks/sources'
import useLayers from '../mapbox/hooks/layers'

import Back from '../ban-dashboard/back'

let hoveredStateId = null

const ContourMap = ({map, contour, onSelectContour, reset, setSources, setLayers, setInfos}) => {
  const sources = useSources(contour)
  const layers = useLayers(contour)

  const onHover = (e, source) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState({source, id: hoveredStateId}, {hover: false})
      }

      hoveredStateId = e.features[0].id

      map.getCanvas().style.cursor = 'pointer'
      map.setFeatureState({source, id: hoveredStateId}, {hover: true})
    }
  }

  const onLeave = () => {
    if (hoveredStateId) {
      sources.forEach(({name}) => {
        map.setFeatureState({source: name, id: hoveredStateId}, {hover: false})
      })
    }

    map.getCanvas().style.cursor = 'default'
    hoveredStateId = null
  }

  const handleClick = (e, cb) => {
    const feature = e.features[0]
    cb(feature)
  }

  useEffect(() => {
    if (map) {
      map.on('mousemove', 'contour-fill', e => onHover(e, 'contour'))
      map.on('mouseleave', 'contour-fill', onLeave)
      map.on('click', 'contour-fill', e => handleClick(e, onSelectContour))
    }
  }, [])

  useEffect(() => {
    setSources(sources)
    setLayers(layers)
  }, [sources, layers])

  useEffect(() => {
    setInfos(reset ? <Back handleClick={reset} /> : null)
  }, [reset])

  return null
}

ContourMap.defaultProps = {
  reset: null
}

ContourMap.propTypes = {
  map: PropTypes.object.isRequired,
  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  reset: PropTypes.func,
  onSelectContour: PropTypes.func.isRequired,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired,
  setInfos: PropTypes.func.isRequired
}

export default ContourMap
