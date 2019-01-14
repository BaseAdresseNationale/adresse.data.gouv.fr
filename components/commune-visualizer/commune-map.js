import React from 'react'
import {renderToString} from 'react-dom/server'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import {positionsToGeoJson} from '../../lib/geojson'

import theme from '../../styles/theme'

const CLOSER_LOOK = 17

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

const secureRemoveLayer = (map, layerId) => {
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId)
  }
}

const secureAddLayer = (map, layer) => {
  if (!map.getLayer(layer.id)) {
    map.addLayer(layer)
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
    'circle-radius': 2
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
    'text-halo-color': theme.primaryDark,
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
    'text-color': '#000',
    'text-halo-color': {
      type: 'identity',
      property: 'color'
    },
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
    this.lastSelectedNumero = null

    // Map
    map.once('load', this.onLoad)
    map.once('styledata', this.onLoadStyle)
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

  componentDidUpdate() {
    const {map} = this.props
    const waiting = () => {
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
    const {map, voie, numeros, numero, isLoading} = this.props

    if (!map.getSource('numeros')) {
      map.addSource('numeros', {
        type: 'geojson',
        data: numeros
      })

      secureAddLayer(map, numerosPointLayer)
    }

    if (numero) {
      this.numeroMode()
    } else {
      this.resetNumeroMode()
      this.lastSelectedNumero = null
    }

    if (voie) {
      this.voieMode()
    } else {
      this.communeMode()
    }

    isLoading(false)
  }

  communeMode = () => {
    const {map, voies} = this.props

    if (!map.getSource('voies')) {
      map.addSource('voies', {
        type: 'geojson',
        data: voies
      })
    }

    secureAddLayer(map, voiesLayer)

    if (!this.closerLook) {
      secureRemoveLayer(map, numerosLayer.id)
    }

    secureRemoveLayer(map, selectedNumerosLayer.id)
    secureRemoveLayer(map, numeroLayer.id)
    secureRemoveLayer(map, numeroSourceLayer.id)
    secureRemoveLayer(map, numeroTypeLayer.id)

    this.voieFitZoom = 0
  }

  voieMode = () => {
    const {map, voie} = this.props

    secureRemoveLayer(map, voiesLayer.id)

    secureAddLayer(map, numerosLayer)

    if (!map.getLayer('selected-numeros')) {
      map.addLayer(selectedNumerosLayer)

      if (!this.closerLook) {
        this.fitBounds()
      }
    }

    if (voie) {
      map.setFilter('numeros', ['!=', ['get', 'codeVoie'], voie.codeVoie])
      map.setFilter('selected-numeros', ['==', ['get', 'codeVoie'], voie.codeVoie])
    }

    this.voieFitZoom = map.getZoom()
  }

  numeroMode = () => {
    const {map, numero} = this.props
    const numeroSource = map.getSource('numero')
    const data = {
      type: 'geojson',
      data: positionsToGeoJson(numero.properties.positions)
    }

    map.setFilter('numeros', ['!=', ['get', 'id'], numero.properties.id])
    map.setFilter('numeros-point', ['!=', ['get', 'id'], numero.properties.id])
    map.setFilter('selected-numeros', ['!=', ['get', 'id'], numero.properties.id])

    secureRemoveLayer(map, voiesLayer.id)

    if (numeroSource) {
      if (this.lastSelectedNumero !== numero.properties.id) {
        numeroSource.setData(numero)
      }
    } else {
      map.addSource('numero', data)
    }

    secureAddLayer(map, numeroTypeLayer)
    secureAddLayer(map, numeroSourceLayer)

    this.lastSelectedNumero = numero.properties.id
  }

  resetNumeroMode = () => {
    const {map} = this.props

    secureRemoveLayer(map, numeroLayer.id)
    secureRemoveLayer(map, numeroTypeLayer.id)
    secureRemoveLayer(map, numeroSourceLayer.id)

    this.lastSelectedNumero = null
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

    if (currentZoom > CLOSER_LOOK) {
      secureAddLayer(map, numerosLayer)
      this.closerLook = true
    } else {
      this.closerLook = false
    }
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
