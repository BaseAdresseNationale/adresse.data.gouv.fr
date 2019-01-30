import React from 'react'
import {renderToString} from 'react-dom/server'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'
import {isEqual} from 'lodash'

import {positionsToGeoJson} from '../../lib/geojson'

import theme from '../../styles/theme'

const NUMEROS_POINT_MIN = 12
const NUMEROS_MIN = 17

const DELETED_FILTER = ['!=', ['get', 'status'], 'deleted']
const VDELETED_FILTER = ['!=', ['get', 'voieStatus'], 'deleted']

const NUMEROS_FILTERS = [
  'all',
  DELETED_FILTER,
  VDELETED_FILTER
]

const SELECTED_NUMEROS_FILTERS = [
  'all',
  ['==', ['get', 'codeVoie'], null],
  DELETED_FILTER,
  VDELETED_FILTER
]

const popupAddress = ({properties}) => renderToString(
  <div>
    <h4>{properties.numeroComplet} {properties.nomVoie}</h4>
    <p>
      <div>Type: {properties.type}</div>
      <div>Source: {properties.source}</div>
    </p>
    Mise à jour: {properties.lastUpdate}
  </div>
)

const secureAddLayer = (map, layer) => {
  if (!map.getLayer(layer.id)) {
    map.addLayer(layer)
  }
}

const secureAddSource = (map, id, data) => {
  if (!map.getSource(id)) {
    map.addSource(id, {
      type: 'geojson',
      data
    })
  }
}

// LAYERS
const numerosPointLayer = {
  id: 'numeros-point',
  type: 'circle',
  source: 'numeros',
  minzoom: NUMEROS_POINT_MIN,
  maxzoom: NUMEROS_MIN,
  filter: NUMEROS_FILTERS,
  paint: {
    'circle-color': {
      type: 'identity',
      property: 'color'
    },
    'circle-radius': {
      stops: [
        [NUMEROS_POINT_MIN, 0.5],
        [NUMEROS_MIN, 4]
      ]
    }
  }
}

const numerosLayer = {
  id: 'numeros',
  type: 'symbol',
  source: 'numeros',
  minzoom: NUMEROS_MIN,
  filter: NUMEROS_FILTERS,
  paint: {
    'text-color': '#fff',
    'text-halo-color': {
      type: 'identity',
      property: 'color'
    },
    'text-halo-width': 1
  },
  layout: {
    'text-font': ['Roboto Regular'],
    'text-field': '{numeroComplet}',
    'text-ignore-placement': true
  }
}

const selectedNumerosLayer = {
  id: 'selected-numeros',
  type: 'symbol',
  source: 'numeros',
  filter: SELECTED_NUMEROS_FILTERS,
  paint: {
    'text-color': '#fff',
    'text-halo-color': {
      type: 'identity',
      property: 'color'
    },
    'text-halo-width': 2
  },
  layout: {
    'text-font': ['Roboto Regular'],
    'text-field': '{numeroComplet}',
    'text-ignore-placement': true
  }
}

const numeroLayer = {
  id: 'numero',
  type: 'circle',
  minzoom: NUMEROS_MIN,
  source: 'numero',
  filter: NUMEROS_FILTERS,
  paint: {
    'circle-color': {
      type: 'identity',
      property: 'color'
    },
    'circle-radius': 4
  }
}

const numeroSourceLayer = {
  id: 'numero-source',
  type: 'symbol',
  source: 'numero',
  minzoom: NUMEROS_MIN,
  filter: NUMEROS_FILTERS,
  paint: {
    'text-color': theme.primary,
    'text-halo-color': {
      type: 'identity',
      property: 'color'
    },
    'text-halo-width': 1
  },
  layout: {
    'text-font': ['Roboto Regular'],
    'text-field': '{source}',
    'text-size': 10,
    'text-offset': [0, 2]
  }
}

const numeroTypeLayer = {
  id: 'numero-type',
  type: 'symbol',
  source: 'numero',
  minzoom: NUMEROS_MIN,
  filter: NUMEROS_FILTERS,
  paint: {
    'text-color': theme.primary,
    'text-halo-color': '#fff',
    'text-halo-width': 1
  },
  layout: {
    'text-font': ['Roboto Regular'],
    'text-field': '{type}'
  }
}

const voiesLayer = {
  id: 'voies',
  type: 'symbol',
  source: 'voies',
  maxzoom: NUMEROS_MIN,
  filter: DELETED_FILTER,
  paint: {
    'text-halo-color': '#DDD',
    'text-halo-width': 2
  },
  layout: {
    'text-field': [
      'format',
      ['upcase', ['get', 'nomVoie']],
      {'font-scale': 0.8},
      '\n',
      {},
      ['downcase', ['get', 'numerosCount']],
      {'font-scale': 0.6},
      ' numéros',
      {'font-scale': 0.6}
    ],
    'text-anchor': 'top',
    'text-font': ['Roboto Regular']
  }
}

class CommuneMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    popup: PropTypes.object.isRequired,
    voies: PropTypes.shape({
      features: PropTypes.array.isRequired
    }),
    numeros: PropTypes.shape({
      features: PropTypes.array.isRequired
    }).isRequired,
    voie: PropTypes.object,
    numero: PropTypes.object,
    selectVoie: PropTypes.func.isRequired,
    selectNumero: PropTypes.func.isRequired,
    isLoading: PropTypes.func.isRequired
  }

  static defaultProps = {
    voies: null,
    voie: null,
    numero: null
  }

  componentDidMount() {
    const {map} = this.props

    this.voieFitZoom = null

    // Map
    map.once('load', this.onLoad)
    map.on('zoomend', this.zoomEnd)
    map.on('dataloading', this.onLoading)

    this.fitBounds()

    // Numéro
    map.on('click', 'numeros', this.onNumeroClick)
    map.on('click', 'selected-numeros', this.onNumeroClick)
    map.on('mouseenter', 'selected-numeros', this.mouseEnterNumero)
    map.on('mouseleave', 'selected-numeros', this.mouseLeaveNumero)
    map.on('mouseenter', 'numeros', this.mouseEnterNumero)
    map.on('mouseleave', 'numeros', this.mouseLeaveNumero)
    map.on('click', 'numero-type', this.unselectNumero)
    map.on('mouseenter', 'numero-type', this.mouseEnter)
    map.on('mouseleave', 'numero-type', this.mouseLeave)

    // Voies
    map.on('click', 'voies', this.onVoieClick)
    map.on('mouseenter', 'voies', this.mouseEnter)
    map.on('mouseleave', 'voies', this.mouseLeave)
  }

  componentDidUpdate(prevProps) {
    const {map, voies, numero, isLoading} = this.props

    const waiting = () => {
      if (!isEqual(numero, prevProps.numero)) {
        const numeroSource = map.getSource('numero')
        numeroSource.setData({
          type: 'geojson',
          data: positionsToGeoJson(numero.properties.positions)
        })
      }

      if (voies && !isEqual(voies, prevProps.voies)) {
        const voiesSource = map.getSource('voies')
        this.fitBounds()
        voiesSource.setData({
          type: 'geojson',
          data: voies
        })
      }

      if (map.isStyleLoaded() && map.areTilesLoaded()) {
        isLoading(false)
        this.onLoad()
      } else {
        setTimeout(waiting, 200)
      }
    }

    waiting()
  }

  componentWillUnmount() {
    const {map} = this.props

    // Map
    map.off('load', this.onLoad)
    map.off('zoomend', this.zoomEnd)
    map.off('dataloading', this.onLoading)

    // Numéro
    map.off('click', 'numeros', this.onNumeroClick)
    map.off('mouseenter', 'selected-numeros', this.mouseEnterNumero)
    map.off('mouseleave', 'selected-numeros', this.mouseLeaveNumero)
    map.off('mouseenter', 'numeros', this.mouseEnterNumero)
    map.off('mouseleave', 'numeros', this.mouseLeaveNumero)
    map.off('click', 'numero-type', this.unselectNumero)
    map.off('mouseenter', 'numero-type', this.mouseEnter)
    map.off('mouseleave', 'numero-type', this.mouseLeave)

    // Voies
    map.off('click', 'voies', this.onVoieClick)
    map.off('mouseenter', 'voies', this.mouseEnter)
    map.off('mouseleave', 'voies', this.mouseLeave)
  }

  fitBounds = () => {
    const {map, voies, voie, numeros} = this.props
    const bbox = computeBbox(voie ?
      {type: 'FeatureCollection', features: numeros.features.filter(n => n.properties.codeVoie === voie.codeVoie)} :
      voies
    )

    map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 16,
      duration: 0
    })
  }

  onLoading = () => {
    const {isLoading} = this.props
    isLoading(true)
  }

  onLoad = () => {
    const {map, voies, voie, numeros, numero} = this.props

    // Sources
    secureAddSource(map, 'voies', voies)
    secureAddSource(map, 'numeros', numeros)
    secureAddSource(map, 'numero', numero)

    // Layers
    secureAddLayer(map, numerosLayer)
    secureAddLayer(map, selectedNumerosLayer)
    secureAddLayer(map, numeroLayer)
    secureAddLayer(map, numeroSourceLayer)
    secureAddLayer(map, numeroTypeLayer)
    secureAddLayer(map, numerosPointLayer)
    secureAddLayer(map, voiesLayer)

    if (numero && this.mode !== 'numero') {
      this.numeroMode()
    } else if (voie && this.mode !== 'voie') {
      this.voieMode()
    } else if (!voie && !numero) {
      this.resetLayers()
      this.mode = 'commune'
    }
  }

  setSelectedFilters = () => {
    const {map, voie} = this.props
    const numerosFilters = NUMEROS_FILTERS
    const selectedFilters = [
      'all',
      DELETED_FILTER,
      VDELETED_FILTER,
      ['==', ['get', 'codeVoie'], voie.codeVoie]
    ]

    numerosFilters.push(['!=', ['get', 'codeVoie'], voie.codeVoie])

    map.setFilter('numeros', numerosFilters)
    map.setFilter('numeros-point', numerosFilters)
    map.setFilter('selected-numeros', selectedFilters)
  }

  resetLayers = () => {
    const {map} = this.props

    map.setFilter('numeros', NUMEROS_FILTERS)
    map.setFilter('selected-numeros', SELECTED_NUMEROS_FILTERS)
    map.setFilter('numeros-point', NUMEROS_FILTERS)

    map.setLayoutProperty(selectedNumerosLayer.id, 'visibility', 'none')
    map.setLayoutProperty(voiesLayer.id, 'visibility', 'visible')
  }

  voieMode = () => {
    const {map, voie} = this.props

    if (voie) {
      this.setSelectedFilters()

      map.setPaintProperty(numerosLayer.id, 'text-opacity', 0.4)
      map.setLayoutProperty(selectedNumerosLayer.id, 'visibility', 'visible')
      map.setLayoutProperty(voiesLayer.id, 'visibility', 'none')

      this.fitBounds()
      this.voieFitZoom = map.getZoom()
    }

    this.mode = 'voie'
  }

  numeroMode = () => {
    const {map, numero} = this.props

    map.setFilter('numeros', ['!=', ['get', 'id'], numero.properties.id])
    map.setFilter('numeros-point', ['!=', ['get', 'id'], numero.properties.id])
    map.setFilter('selected-numeros', ['!=', ['get', 'id'], numero.properties.id])

    this.mode = 'numero'
  }

  zoomEnd = () => {
    const {map, voie, numero, selectVoie, selectNumero} = this.props
    const currentZoom = map.getZoom()

    if (voie && currentZoom < this.voieFitZoom - 0.5) {
      selectVoie(null)
    }

    if (numero && currentZoom < this.voieFitZoom - 0.5) {
      selectNumero(null)
    }
  }

  onVoieClick = event => {
    const {selectVoie} = this.props
    const voie = event.features[0]

    selectVoie(voie.properties)
  }

  onNumeroClick = event => {
    const {selectNumero} = this.props
    const numero = event.features[0]

    selectNumero(numero.properties.id)
  }

  mouseEnter = () => {
    const {map} = this.props
    map.getCanvas().style.cursor = 'pointer'
  }

  mouseLeave = () => {
    const {map} = this.props
    map.getCanvas().style.cursor = ''
  }

  mouseEnterNumero = e => {
    const {map, popup, numeros} = this.props
    const numeroId = e.features[0].properties.id
    const numero = numeros.features.find(n => n.properties.id === numeroId)
    const coordinates = numero.geometry.coordinates.slice()
    const description = popupAddress(numero)

    map.getCanvas().style.cursor = 'pointer'

    popup.setLngLat(coordinates)
      .setHTML(description)
      .addTo(map)
  }

  mouseLeaveNumero = () => {
    const {map, popup} = this.props

    map.getCanvas().style.cursor = ''
    popup.remove()
  }

  unselectNumero = () => {
    const {selectNumero} = this.props

    selectNumero(null)
  }

  render() {
    return null
  }
}

export default CommuneMap
