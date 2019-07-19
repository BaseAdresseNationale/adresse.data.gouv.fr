import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import BanStats from './ban-stats'
import Legend from './legend'
import Back from './back'

import useSources from './hooks/sources'
import useLayers, {COLORS, fillColor, unSelectFillColor} from './hooks/layers'

let hoveredStateId = null

function BANMap({map, departements, communes, selectDepartement, reset, setSources, setLayers, setInfos, setTools}) {
  const sources = useSources(departements, communes)
  const layers = useLayers(departements, communes)

  const onClick = e => {
    const departement = e.features[0].properties
    map.setFilter('departements-fill', ['!=', ['get', 'code'], departement.code])
    map.setPaintProperty('departements-fill', 'fill-color', unSelectFillColor)
    map.setPaintProperty('departements-fill', 'fill-opacity', 0.4)

    selectDepartement(departement.code)
  }

  const onHover = e => {
    if (e.features.length > 0) {
      const {id, source, properties} = e.features[0]
      if (hoveredStateId) {
        map.setFeatureState({source: 'departements', id: hoveredStateId}, {hover: false})
        if (map.getSource('communes')) {
          map.setFeatureState({source: 'communes', id: hoveredStateId}, {hover: false})
        }
      }

      hoveredStateId = id

      setTools(<BanStats properties={properties} />)

      if (source === 'departements') {
        map.getCanvas().style.cursor = 'pointer'
      }

      map.setFeatureState({source, id: hoveredStateId}, {hover: true})
    }
  }

  const onLeave = () => {
    if (hoveredStateId) {
      map.setFeatureState({source: 'departements', id: hoveredStateId}, {hover: false})
      if (map.getSource('communes')) {
        map.setFeatureState({source: 'communes', id: hoveredStateId}, {hover: false})
      }

      map.getCanvas().style.cursor = 'default'
      hoveredStateId = null
    }
  }

  const unSelectDepartement = () => {
    map.setFilter('departements-fill', ['!=', ['get', 'code'], 0])
    map.setCenter([1.7, 46.9])
    map.setZoom(5)

    reset()
  }

  useEffect(() => {
    if (map.getSource('departements') && !communes) {
      map.setPaintProperty('departements-fill', 'fill-color', fillColor)
    }
  }, [map, communes])

  useEffect(() => {
    map.on('mousemove', 'departements-fill', onHover)
    map.on('mouseleave', 'departements-fill', onLeave)
    map.on('click', 'departements-fill', onClick)

    map.on('mousemove', 'communes-fill', onHover)
    map.on('mouseleave', 'communes-fill', onLeave)
  }, [])

  useEffect(() => {
    setSources(sources)
    setLayers(layers)
  }, [sources, layers])

  useEffect(() => {
    setInfos(communes ? (
      <Back handleClick={unSelectDepartement} />
    ) : null)
  }, [communes])

  return <Legend colors={COLORS} />
}

BANMap.propTypes = {
  map: PropTypes.object.isRequired,
  departements: PropTypes.object,
  communes: PropTypes.object,
  selectDepartement: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired,
  setInfos: PropTypes.func.isRequired,
  setTools: PropTypes.func.isRequired
}

BANMap.defaultProps = {
  departements: null,
  communes: null
}

export default BANMap
