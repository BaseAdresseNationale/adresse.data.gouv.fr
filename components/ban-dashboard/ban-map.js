import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import BanStats from './ban-stats'

const COLORS = {
  green: '#7fff7a',
  yellow: '#ffff00',
  orange: '#ff9900',
  red: '#ff2a2e',
  purple: '#6D029F',
  black: '#000'
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
  ['get', 'ecart'],
  COLORS.green,
  0.05,
  COLORS.yellow,
  0.1,
  COLORS.orange,
  0.2,
  COLORS.red,
  0.4,
  COLORS.purple,
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
  'fill-opacity': [
    'interpolate',
    ['exponential', 0.1],
    ['get', 'total'],
    0,
    0,
    1,
    0.1,
    200,
    0.2,
    400,
    0.3,
    800,
    0.4,
    1000,
    0.5,
    5000,
    0.6,
    10000,
    0.7,
    50000,
    0.8,
    100000,
    0.9,
    200000,
    1
  ]
}

let hoveredStateId = null

function BANMap({map, departements, communes, loading, selectDepartement, reset}) {
  const [stats, setStats] = useState(null)

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
    map.setPaintProperty('departements-fill', 'fill-opacity', 0.4)

    selectDepartement(departement.code)
  }

  const onHover = (e, source) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState({source: 'communes', id: hoveredStateId}, {hover: false})
        map.setFeatureState({source: 'departements', id: hoveredStateId}, {hover: false})
      }

      hoveredStateId = e.features[0].id

      setStats(e.features[0].properties)

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
    setStats(null)
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

      {stats && (
        <div className='tools stats'>
          <BanStats properties={stats} />
        </div>
      )}

      <div className='tools legend'>
        <div className='title'>État de la Base Adresse Nationale sous Licence Ouverte</div>
        <div className='graduation'>
          <div className='color-label' style={{marginRight: '5px'}}>BAN v0</div>
          <div className='color' style={{backgroundColor: COLORS.green}} />
          <div className='color' style={{backgroundColor: COLORS.yellow}} />
          <div className='color' style={{backgroundColor: COLORS.orange}} />
          <div className='color' style={{backgroundColor: COLORS.red}} />
          <div className='color' style={{backgroundColor: COLORS.purple}} />
          <div className='color' style={{backgroundColor: COLORS.black}} />
          <div className='color-label' style={{marginLeft: '5px'}}>BAN LO</div>
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

        .stats {
          right: 0;
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

        .legend .color-label {
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
