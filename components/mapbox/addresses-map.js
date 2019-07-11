import React, {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import Address from '../explorer/voie/address'

import useSources from './hooks/sources'
import useLayers from './hooks/layers'

let hoveredStateId = null

const AddressesMap = ({map, contour, voies, voie, numeros, numero, onSelectContour, onSelectNumero, setSources, setLayers, setInfos}) => {
  const sources = useSources(contour, voies, numeros, numero)
  const layers = useLayers(contour, voies, numeros, numero)

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

  const onLeave = useCallback(() => {
    if (hoveredStateId) {
      sources.forEach(({name}) => {
        map.setFeatureState({source: name, id: hoveredStateId}, {hover: false})
      })
    }

    map.getCanvas().style.cursor = 'default'
    hoveredStateId = null
  }, [map, sources])

  const handleClick = (e, cb) => {
    const feature = e.features[0]
    cb(feature)
  }

  useEffect(() => {
    if (map) {
      if (onSelectContour) {
        map.on('mousemove', 'contour-fill', e => onHover(e, 'contour'))
        map.on('mouseleave', 'contour-fill', onLeave)
        map.on('click', 'contour-fill', e => handleClick(e, onSelectContour))
      }

      if (onSelectNumero) {
        map.on('mousemove', 'numeros-point', e => onHover(e, 'numeros'))
        map.on('mouseleave', 'numeros-point', onLeave)
        map.on('click', 'numeros-point', e => handleClick(e, onSelectNumero))

        map.on('mousemove', 'numeros-label', e => onHover(e, 'numeros'))
        map.on('mouseleave', 'numeros-label', onLeave)
        map.on('click', 'numeros-label', e => handleClick(e, onSelectNumero))
      }
    }
  }, [])

  useEffect(() => {
    if (numero) {
      setInfos(<Address
        voie={voie}
        address={numero}
        onClose={() => {
          setInfos(null)
          onSelectNumero(null)
        }}
      />)
    } else {
      setInfos(null)
    }
  }, [numero, sources])

  useEffect(() => {
    setSources(sources)
    setLayers(layers)
  }, [sources, layers])

  return null
}

AddressesMap.defaultProps = {
  onSelectContour: null,
  onSelectNumero: null
}

AddressesMap.propTypes = {
  map: PropTypes.object.isRequired,
  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  onSelectContour: PropTypes.func,
  onSelectNumero: PropTypes.func,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired
}

export default AddressesMap
