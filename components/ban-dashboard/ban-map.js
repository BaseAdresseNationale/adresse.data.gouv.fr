import React, {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {renderToString} from 'react-dom/server'
import computeBbox from '@turf/bbox'

function formatNumber(nb) {
  return nb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function roundNb(nb) {
  return nb ? Math.round(nb * 100) : null
}

const lineLayerPaint = {
  'line-width': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    3,
    1
  ]
}

const fillColor = [
  'step',
  ['get', 'ban-v0-only-ratio'],
  '#7fff7a',
  0.05,
  '#ffff00',
  0.1,
  '#ffd100',
  0.2,
  '#ff2a2e',
  0.4,
  '#330143',
  1,
  '#000'
]

const unSelectFillColor = [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  fillColor,
  '#000'
]

const fillLayerPaint = {
  'fill-color': fillColor,
  'fill-opacity': ['case',
    ['boolean', ['feature-state', 'hover'], false],
    1,
    0.5]
}

const popupHTML = ({properties}) => {
  const total = formatNumber(properties.total)
  const banV0Only = formatNumber(properties['ban-v0-only'])
  const banLOOnly = formatNumber(properties['ban-lo-only'])
  const both = formatNumber(properties.both)
  const pseudoAdresse = formatNumber(properties['pseudo-adresse'])
  const banV0OnlyRatio = roundNb(properties['ban-v0-only-ratio'])
  const banLOOnlyRatio = roundNb(properties['ban-lo-only-ratio'])
  return renderToString(
    <div>
      <h3>{properties.nom} - {properties.code}</h3>
      <p>
        <div><b>{total}</b> adresses</div>
      </p>
      {properties.total > 0 && (
        <ul style={{padding: '1em'}}>
          <li><b>{banV0Only}</b> uniques à la BAN v0 {banV0OnlyRatio && (<b>{banV0OnlyRatio}%</b>)}</li>
          <li><b>{banLOOnly}</b> uniques à la BAN LO {banLOOnlyRatio && (<b>{banLOOnlyRatio}%</b>)}</li>
          <li><b>{both}</b> communes à la BAN v0 et BAN LO</li>
          <li><b>{pseudoAdresse}</b> pseudo adresses</li>
        </ul>
      )}
    </div>
  )
}

let hoveredStateId = null

function BANMap({map, popUp, departements, communes, loading, selectDepartement, reset}) {
  map.once('load', () => {
    map.on('mousemove', 'departements-fill', e => onHover(e, 'departements'))
    map.on('mouseleave', 'departements-fill', onLeave)
    map.on('click', 'departements-fill', onClick)

    map.on('mousemove', 'communes-fill', e => onHover(e, 'communes'))
    map.on('mouseleave', 'communes-fill', onLeave)

    map.addSource('departements', {
      type: 'geojson',
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
  })

  const onClick = e => {
    const departement = e.features[0].properties
    map.setFilter('departements-fill', ['!=', ['get', 'code'], departement.code])
    map.setPaintProperty('departements-fill', 'fill-color', unSelectFillColor)

    selectDepartement(departement.code)
  }

  const onHover = (e, source) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState({source: 'communes', id: hoveredStateId}, {hover: false})
        map.setFeatureState({source: 'departements', id: hoveredStateId}, {hover: false})
      }

      hoveredStateId = e.features[0].id
      popUp.setLngLat(e.lngLat)
        .setHTML(popupHTML(e.features[0]))
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

  const unSelectDepartement = useCallback(() => {
    map.getSource('communes').setData({
      type: 'FeatureCollection',
      features: []
    })
    map.setFilter('departements-fill', ['!=', ['get', 'code'], 0])
    map.setCenter([1.7, 46.9])
    map.setZoom(5)
    reset()
  })

  useEffect(() => {
    if (communes) {
      const source = map.getSource('communes')
      if (source) {
        source.setData(communes)
      }

      fitbounds(communes)
    } else if (map.getSource('departements')) {
      map.setPaintProperty('departements-fill', 'fill-color', fillColor)
    }
  }, [communes])

  return (
    <div>
      {loading && (
        <div className='tools'>Chargement…</div>
      )}

      {!loading && communes && (
        <div className='tools reset' onClick={unSelectDepartement}>Départements</div>
      )}

      <div className='tools legend'>
        <div className='title'>État de la Base Adresse Nationale sous Licence Ouverte</div>
        <div className='graduation'>
          <div className='label' style={{marginRight: '5px'}}>BAN v0</div>
          <div className='color' style={{backgroundColor: '#330143'}} />
          <div className='color' style={{backgroundColor: '#ff2a2e'}} />
          <div className='color' style={{backgroundColor: '#ffd100'}} />
          <div className='color' style={{backgroundColor: '#ffff00'}} />
          <div className='color' style={{backgroundColor: '#7fff7a'}} />
          <div className='label' style={{marginLeft: '5px'}}>BAN LO</div>
        </div>
      </div>

      <style jsx>{`
        .tools {
          position: absolute;
          z-index: 999;
          background: #ffffffbb;
          padding: 0.5em;
          margin: 1em;
          border-radius: 4px;
        }

        .legend {
          display: flex;
          flex-direction: column;
          bottom: 10px;
          right: 0;
        }

        .legend .title {
          font-size: small;
          margin-bottom: 5px;
        }

        .legend .label {
          font-size: x-small;
        }

        .legend .graduation {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .legend .color {
          flex: 1;
          height: 10px;
          width: 30px;
        }

        .reset:hover {
          cursor: pointer;
          background: #fff;
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
  selectDepartement: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
}

BANMap.defaultProps = {
  departements: null,
  communes: null,
  loading: false
}

export default BANMap
