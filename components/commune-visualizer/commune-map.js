import React from 'react'
import {renderToString} from 'react-dom/server'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import {positionsToGeoJson} from '../../lib/geojson'

import theme from '../../styles/theme'

const CLOSER_LOOK = 16.5

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
  paint: {
    'circle-color': {
      type: 'identity',
      property: 'color'
    },
    'circle-radius': {
      base: 1,
      stops: [
        [10, 0],
        [17, 4]
      ]
    },
    'circle-opacity': {
      stops: [
        [16, 1],
        [19, 0]
      ]
    }
  }
}

const numerosLayer = {
  id: 'numeros',
  type: 'symbol',
  source: 'numeros',
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
    'text-field': '{numeroComplet}'
  }
}

const selectedNumerosLayer = {
  id: 'selected-numeros',
  type: 'symbol',
  source: 'numeros',
  filter: ['==', ['get', 'codeVoie'], null],
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
    'text-field': '{numeroComplet}'
  }
}

const numeroLayer = {
  id: 'numero',
  type: 'circle',
  source: 'numeros',
  paint: {
    'circle-color': {
      type: 'identity',
      property: 'color'
    },
    'circle-radius': 2
  }
}

const numeroSourceLayer = {
  id: 'numero-source',
  type: 'symbol',
  source: 'numero',
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
  paint: {
    'text-color': '#fff',
    'text-halo-color': '#000',
    'text-halo-width': 1
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
    this.closerLook = false // Avoid fitBound on voie when a numéro is clicked in "closer look" mode

    // Map
    map.once('load', this.onLoad)
    map.once('styledata', this.onLoad)
    map.on('zoomend', this.zoomEnd)
    map.on('dataloading', this.onLoading)
    map.on('styledataloading', this.onLoading)
    map.on('sourcedataloading', this.onLoading)

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
    const {map, numero} = this.props
    const waiting = () => {
      if (numero !== prevProps.numero) {
        const numeroSource = map.getSource('numero')
        numeroSource.setData({
          type: 'geojson',
          data: positionsToGeoJson(numero.properties.positions)
        })
      }

      if (map.isStyleLoaded()) {
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
    map.off('styledata', this.onLoad)
    map.off('zoomend', this.zoomEnd)
    map.off('dataloading', this.onLoading)
    map.off('styledataloading', this.onLoading)
    map.off('sourcedataloading', this.onLoading)

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
    const {map, voies, voie, numeros, numero, isLoading} = this.props

    // Sources
    secureAddSource(map, 'voies', voies)
    secureAddSource(map, 'numeros', numeros)
    secureAddSource(map, 'numero', numero)

    // Layers
    secureAddLayer(map, numerosPointLayer)
    secureAddLayer(map, numerosLayer)
    secureAddLayer(map, selectedNumerosLayer)
    secureAddLayer(map, numeroLayer)
    secureAddLayer(map, numeroSourceLayer)
    secureAddLayer(map, numeroTypeLayer)
    secureAddLayer(map, voiesLayer)

    if (numero) {
      this.numeroMode()
    } else if (voie) {
      this.voieMode()
    } else {
      this.resetFilters()
      this.communeMode()
    }

    isLoading(false)
  }

  resetFilters = () => {
    const {map} = this.props

    map.setFilter('numeros', null)
    map.setFilter('selected-numeros', null)
    map.setFilter('numeros-point', null)
  }

  communeMode = () => {
    const {map} = this.props

    if (this.closerLook) {
      map.setLayoutProperty(voiesLayer.id, 'visibility', 'none')
      map.setLayoutProperty(numerosLayer.id, 'visibility', 'visible')
      map.setLayoutProperty(numerosPointLayer.id, 'visibility', 'none')
    } else {
      map.setLayoutProperty(voiesLayer.id, 'visibility', 'visible')
      map.setLayoutProperty(numerosLayer.id, 'visibility', 'none')
      map.setLayoutProperty(numerosPointLayer.id, 'visibility', 'visible')
    }

    map.setLayoutProperty(selectedNumerosLayer.id, 'visibility', 'none')
    map.setLayoutProperty(numeroLayer.id, 'visibility', 'none')
    map.setLayoutProperty(numeroSourceLayer.id, 'visibility', 'none')
    map.setLayoutProperty(numeroTypeLayer.id, 'visibility', 'none')

    this.voieFitZoom = 0
  }

  voieMode = () => {
    const {map, voie} = this.props

    map.setFilter('numeros', ['!=', ['get', 'codeVoie'], voie.codeVoie])
    map.setFilter('selected-numeros', ['==', ['get', 'codeVoie'], voie.codeVoie])

    map.setLayoutProperty(voiesLayer.id, 'visibility', 'none')
    map.setLayoutProperty(numerosLayer.id, 'visibility', 'visible')
    map.setLayoutProperty(numerosPointLayer.id, 'visibility', 'visible')
    map.setLayoutProperty(selectedNumerosLayer.id, 'visibility', 'visible')
    map.setPaintProperty(numerosLayer.id, 'text-opacity', 0.4)

    if (!this.closerLook) {
      this.fitBounds()
    }

    this.voieFitZoom = map.getZoom()
  }

  numeroMode = () => {
    const {map, numero} = this.props

    map.setLayoutProperty(numerosPointLayer.id, 'visibility', 'none')
    map.setLayoutProperty(voiesLayer.id, 'visibility', 'none')

    map.setFilter('numeros', ['!=', ['get', 'id'], numero.properties.id])
    map.setFilter('numeros-point', ['!=', ['get', 'id'], numero.properties.id])
    map.setFilter('selected-numeros', ['!=', ['get', 'id'], numero.properties.id])

    map.setLayoutProperty(numeroTypeLayer.id, 'visibility', 'visible')
    map.setLayoutProperty(numeroSourceLayer.id, 'visibility', 'visible')
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

    this.closerLook = currentZoom > CLOSER_LOOK
  }

  onVoieClick = event => {
    const {selectVoie} = this.props
    const voie = event.features[0]

    selectVoie(voie.properties)
  }

  onNumeroClick = event => {
    const {voies, voie, selectVoie, selectNumero} = this.props
    const numero = event.features[0]

    if (voie && voie.codeVoie === numero.properties.codeVoie) {
      selectNumero(numero.properties.id)
    } else {
      const selectedVoie = voies.features.find(voie => voie.properties.codeVoie === numero.properties.codeVoie)
      selectVoie(selectedVoie.properties)
    }
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
