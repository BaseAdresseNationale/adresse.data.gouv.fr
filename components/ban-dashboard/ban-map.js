import React, {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {renderToString} from 'react-dom/server'
import computeBbox from '@turf/bbox'

import colors from '../../styles/colors'

const lineLayerPaint = {
  'line-width': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    3,
    1
  ]
}

const fillLayerPaint = {
  'fill-color': [
    'interpolate',
    ['exponential', 0.5],
    ['get', 'banV0'],
    0,
    colors.green,
    50,
    colors.orange,
    100,
    colors.red
  ],
  'fill-opacity': ['case',
    ['boolean', ['feature-state', 'hover'], false],
    0.5,
    0.2]
}

const popupHTML = ({nom, code, banV0}) => renderToString(
  <div>
    <p>
      <b>{nom} - {code}</b>
    </p>
    <p>
      <div><b>{banV0}%</b> d’adresses dans la BAN v1</div>
      <div><b>{100 - banV0}%</b> d’adresses dans la BAN v2 (LO)</div>
    </p>
  </div>
)

let hoveredStateId = null

function BANMap({map, popUp, departements, communes, loading, selectDepartement}) {
  map.once('load', () => {
    map.addSource('departements', {
      type: 'geojson',
      generateId: true,
      data: departements
    })

    map.addLayer({
      id: 'departements-fill',
      source: 'departements',
      type: 'fill',
      paint: fillLayerPaint
    })

    map.addLayer({
      id: 'departements-line',
      source: 'departements',
      type: 'line',
      paint: lineLayerPaint
    })

    map.addSource('communes', {
      type: 'geojson',
      generateId: true,
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    map.addLayer({
      id: 'communes-fill',
      source: 'communes',
      type: 'fill',
      paint: fillLayerPaint
    })

    map.addLayer({
      id: 'communes-line',
      source: 'communes',
      type: 'line',
      paint: lineLayerPaint
    })

    fitbounds(departements)
  })

  const onClick = e => {
    const departement = e.features[0].properties
    map.setFilter('departements-fill', ['!=', ['get', 'code'], departement.code])
    selectDepartement(departement.code)
  }

  const onHover = (e, source) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState({source, id: hoveredStateId}, {hover: false})
      }

      hoveredStateId = e.features[0].id
      popUp.setLngLat(e.lngLat)
        .setHTML(popupHTML(e.features[0].properties))
        .addTo(map)

      map.getCanvas().style.cursor = 'pointer'
      map.setFeatureState({source, id: hoveredStateId}, {hover: true})
    }
  }

  const onLeave = () => {
    if (hoveredStateId) {
      map.setFeatureState({source: 'communes', id: hoveredStateId}, {hover: false})
      map.setFeatureState({source: 'departements', id: hoveredStateId}, {hover: false})
    }

    map.getCanvas().style.cursor = 'default'
    popUp.remove()
    hoveredStateId = null
  }

  const fitbounds = useCallback(data => {
    const bbox = computeBbox(data)

    map.fitBounds(bbox, {
      padding: 100,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  })

  map.on('mousemove', 'departements-fill', e => onHover(e, 'departements'))
  map.on('mouseleave', 'departements-fill', onLeave)
  map.on('click', 'departements-fill', onClick)

  map.on('mousemove', 'communes-fill', e => onHover(e, 'communes'))
  map.on('mouseleave', 'communes-fill', onLeave)

  useEffect(() => {
    if (communes) {
      const source = map.getSource('communes')
      if (source) {
        source.setData(communes)
      }

      fitbounds(communes)
    }
  }, [communes])

  return (
    <div>
      {loading && (
        <div className='loading'>Chargement…</div>
      )}

      <style jsx>{`
        .loading {
            position: absolute;
            z-index: 999;
            background: #ffffffbb;
            padding: 0.5em;
            margin: 1em;
            border-radius: 4px;
        }
        `}</style>
    </div>
  )
}

BANMap.propTypes = {
  map: PropTypes.object.isRequired,
  popUp: PropTypes.object.isRequired,
  departements: PropTypes.object,
  communes: PropTypes.object,
  loading: PropTypes.bool,
  selectDepartement: PropTypes.func.isRequired
}

BANMap.defaultProps = {
  departements: null,
  communes: null,
  loading: false
}

export default BANMap
