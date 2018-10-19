import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'
import computeBbox from '@turf/bbox'

import theme from '../../../../../styles/theme'

import SwitchInput from '../../../../explorer/table-list/filters/switch-input'

const STYLES = {
  vector: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
  ortho: {
    version: 8,
    glyphs: 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: ['https://wxs.ign.fr/eop8s6g4hrpvxnxer1g6qu44/geoportail/wmts?layer=ORTHOIMAGERY.ORTHOPHOTOS&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}'],
        tileSize: 256,
        attribution: '© IGN'
      }},
    layers: [{
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles'
    }]
  }
}

const getCircleColor = () => {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    theme.secondaryDarken,
    ['boolean', ['get', 'created'], false],
    theme.successBorder,
    ['boolean', ['get', 'edited'], false],
    theme.warningBorder,
    ['boolean', ['get', 'deleted'], false],
    theme.errorBorder,
    theme.colors.lightGrey
  ]
}

const getCircleColorFocus = () => {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    theme.secondaryDarken,
    ['boolean', ['get', 'created'], false],
    theme.successBorder,
    ['boolean', ['get', 'edited'], false],
    theme.warningBorder,
    ['boolean', ['get', 'deleted'], false],
    theme.errorBorder,
    theme.primary
  ]
}

const circleRadius = () => {
  return {
    stops: [
      [10, 2],
      [12, 4],
      [15, 10],
      [18, 16],
      [22, 20]
    ]
  }
}

class AddressesCommuneMap extends React.Component {
  style = STYLES.vector

  static propTypes = {
    data: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    bounds: PropTypes.object,
    codeVoie: PropTypes.string,
    select: PropTypes.func.isRequired,
    selected: PropTypes.object
  }

  static defaultProps = {
    selected: null,
    bounds: null,
    codeVoie: null
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: STYLES.vector
    })

    this.map.once('load', this.onLoad)
    this.fitBounds()

    this.map.on('styledata', this.styleData)

    this.map.on('mousemove', 'focus', this.onMouseMove.bind(this, 'focus'))
    this.map.on('mouseleave', 'focus', this.onMouseLeave.bind(this, 'focus'))
    this.map.on('click', 'focus', this.onClick.bind(this, 'focus'))

    this.map.on('mousemove', 'unfocus', this.onMouseMove.bind(this, 'unfocus'))
    this.map.on('mouseleave', 'unfocus', this.onMouseLeave.bind(this, 'unfocus'))
    this.map.on('click', 'unfocus', this.onClick.bind(this, 'unfocus'))
  }

  componentDidUpdate(prevProps) {
    const {map} = this
    const {data, selected} = this.props

    if (data !== prevProps.data) {
      const source = this.map.getSource('data')

      source.setData(data)
    }

    if (!selected) {
      map.setFilter('selected', ['any'])
      this.fitBounds()
    }

    if (selected && selected !== prevProps.selected) {
      map.setFilter('selected', ['==', ['get', 'id'], selected.id])
      map.setCenter(selected.positions[0].coords)
      map.setZoom(16)
    }
  }

  componentWillUnmount() {
    const {map} = this

    map.off('styledata', this.styleData)

    map.off('mousemove', 'focus', this.onMouseMove.bind(this, 'focus'))
    map.off('mouseleave', 'focus', this.onMouseLeave.bind(this, 'focus'))
    map.off('click', 'focus', this.onClick.bind(this, 'focus'))

    map.off('mousemove', 'unfocus', this.onMouseMove.bind(this, 'unfocus'))
    map.off('mouseleave', 'unfocus', this.onMouseLeave.bind(this, 'unfocus'))
    map.off('click', 'unfocus', this.onClick.bind(this, 'unfocus'))
  }

  fitBounds = () => {
    const {data, bounds} = this.props
    const bbox = computeBbox(bounds || data)

    this.map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  }

  styleData = () => {
    const {map} = this

    if (map.isStyleLoaded()) {
      if (!map.getSource('data')) {
        this.onLoad()
      }
    } else {
      setTimeout(this.styleData, 1000)
    }
  }

  onLoad = () => {
    const {map} = this
    const {data, codeVoie} = this.props

    map.addSource('data', {
      type: 'geojson',
      generateId: true,
      data
    })

    if (codeVoie) {
      map.addLayer({
        id: 'focus',
        type: 'circle',
        source: 'data',
        filter: [
          'all',
          ['has', 'codeVoie'],
          ['==', ['get', 'codeVoie'], codeVoie]
        ],
        paint: {
          'circle-color': getCircleColorFocus(),
          'circle-stroke-width': 1,
          'circle-stroke-color': theme.colors.darkBlue,
          'circle-opacity': 1,
          'circle-radius': circleRadius()
        }
      })

      map.addLayer({
        id: 'unfocus',
        type: 'circle',
        source: 'data',
        filter: ['!=', ['get', 'codeVoie'], codeVoie],
        paint: {
          'circle-color': getCircleColor(),
          'circle-stroke-width': 1,
          'circle-stroke-color': theme.colors.grey,
          'circle-opacity': 0.5,
          'circle-radius': circleRadius()
        }
      })
    } else {
      map.addLayer({
        id: 'focus',
        type: 'circle',
        source: 'data',
        paint: {
          'circle-color': getCircleColorFocus(),
          'circle-stroke-width': 1,
          'circle-stroke-color': theme.colors.darkBlue,
          'circle-radius': circleRadius()
        }
      })
    }

    map.addLayer({
      id: 'selected',
      type: 'circle',
      source: 'data',
      filter: ['any'],
      paint: {
        'circle-color': getCircleColorFocus(),
        'circle-radius': circleRadius()
      }
    })

    map.addLayer({
      id: 'numero-symbol',
      type: 'symbol',
      source: 'data',
      layout: {
        'text-field': '{numeroComplet}',
        'text-font': ['Roboto Regular'],
        'text-size': {
          stops: [
            [8, 1],
            [10, 2],
            [12, 4],
            [15, 10],
            [18, 16],
            [22, 20]
          ]
        },
        'text-anchor': 'center'
      },
      paint: {
        'text-color': codeVoie ? [
          'case',
          ['==', ['get', 'codeVoie'], codeVoie],
          '#fff',
          '#000'
        ] : '#fff'
      }
    })
  }

  switchLayer = () => {
    const {map, style} = this
    this.style = style === STYLES.vector ? STYLES.ortho : STYLES.vector

    map.setStyle(this.style, {diff: false})
  }

  onMouseMove = (layer, event) => {
    const {map} = this
    const canvas = map.getCanvas()
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }

    this.highlighted = feature.id
    map.setFeatureState({source: 'data', id: this.highlighted}, {hover: true})
  }

  onMouseLeave = () => {
    const {map} = this
    const canvas = map.getCanvas()
    canvas.style.cursor = ''

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }
  }

  onClick = (layer, event) => {
    const {map} = this
    const {select} = this.props
    const [feature] = event.features
    const {codeCommune, codeVoie, numeroComplet} = feature.properties

    map.setCenter(event.lngLat)
    map.setZoom(16)

    select(codeCommune, codeVoie, numeroComplet)
  }

  render() {
    const {style} = this

    return (
      <div className='container'>
        <div ref={el => {
          this.mapContainer = el
        }} className='container' />

        <SwitchInput
          handleChange={this.switchLayer}
          label='Vue aérienne'
          isChecked={style === STYLES.ortho}
        />

        <style
          dangerouslySetInnerHTML={{__html: mapStyle}} // eslint-disable-line react/no-danger
        />
        <style jsx>{`
          .container {
            position: relative;
            height: 600px;
            margin: 1em 0;
            width: 100%;
          }

          .info {
            position: absolute;
            pointer-events: none;
            top: 10px;
            left: 10px;
            max-width: 40%;
            overflow: hidden;
          }
        `}</style>
      </div>
    )
  }
}

export default AddressesCommuneMap
