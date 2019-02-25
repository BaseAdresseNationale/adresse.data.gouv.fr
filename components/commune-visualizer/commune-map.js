import React from 'react'
import {renderToString} from 'react-dom/server'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'
import {isEqual} from 'lodash'

import {getNumeroPositions, getNumeroPosition} from '../../lib/bal/item'
import {numeroPositionsToGeoJson, toponymeToGeoJson, hasFeatures} from '../../lib/geojson'

import {secureAddLayer, secureAddSource, secureUpdateData} from '../mapbox/helpers'
import {NUMEROS_FILTERS, SELECTED_NUMEROS_FILTERS, DELETED_FILTER, VDELETED_FILTER} from '../mapbox/filters'
import {
  numerosLayer,
  positionsSymbolLayer,
  selectedNumerosLayer,
  numerosPointLayer,
  voiesLayer
} from '../mapbox/layers'

import ContextMenu from './context-menu'

const popupAddress = ({properties}) => renderToString(
  <div>
    <h4>{properties.numeroComplet} {properties.nomVoie}</h4>
    <p>
      <div>Type: {properties.type}</div>
      <div>Source: {properties.source}</div>
    </p>
    Mise à jour: {properties.dateMAJ}
  </div>
)

class CommuneMap extends React.Component {
  state = {
    context: null
  }

  static propTypes = {
    map: PropTypes.object.isRequired,
    popup: PropTypes.object.isRequired,
    voies: PropTypes.shape({
      features: PropTypes.array.isRequired
    }),
    numeros: PropTypes.shape({
      features: PropTypes.array.isRequired
    }),
    voie: PropTypes.object,
    numero: PropTypes.object,
    selectVoie: PropTypes.func.isRequired,
    selectNumero: PropTypes.func.isRequired,
    isLoading: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    voies: null,
    numeros: null,
    voie: null,
    numero: null
  }

  componentDidMount() {
    const {map} = this.props

    this.fitZoom = null

    // Map
    map.once('load', this.onLoad)
    map.on('click', this.mapClick)
    map.on('zoomend', this.zoomEnd)
    map.on('dataloading', this.onLoading)
    map.on('contextmenu', this.contextMenu)

    // Voies
    map.on('click', 'voies', this.onVoieClick)
    map.on('mouseenter', 'voies', this.mouseEnter)
    map.on('mouseleave', 'voies', this.mouseLeave)
    map.on('contextmenu', 'voies', this.editVoie)

    // Numéro
    map.on('click', 'selected-numeros', this.onNumeroClick)
    map.on('click', 'numeros', this.onNumeroClick)
    map.on('contextmenu', 'numeros', this.deletedNumero)
    map.on('contextmenu', 'selected-numeros', this.deletedNumero)
    map.on('mouseenter', 'selected-numeros', this.mouseEnterNumero)
    map.on('mouseenter', 'numeros', this.mouseEnterNumero)
    map.on('mouseleave', 'selected-numeros', this.mouseLeaveNumero)
    map.on('mouseleave', 'numeros', this.mouseLeaveNumero)
    map.on('touchstart', 'numeros', this.touchStart)
    map.on('touchstart', 'selected-numeros', this.touchStart)
    map.on('mousedown', 'numeros', this.mouseDown)
    map.on('mousedown', 'selected-numeros', this.mouseDown)

    // Positions
    map.on('mouseenter', 'positions-symbol', this.mouseEnter)
    map.on('mouseleave', 'positions-symbol', this.mouseLeave)
    map.on('contextmenu', 'positions-symbol', this.deletedPosition)
  }

  componentDidUpdate(prevProps) {
    const {map, voies, numeros, voie, numero, isLoading} = this.props
    const sourceToUpdate = []
    const updapteNumPos = () => {
      const positions = numero && !numero.deleted ? numeroPositionsToGeoJson(numero) : null
      sourceToUpdate.push({id: 'positions', data: positions})
    }

    if (!isEqual(numero, prevProps.numero)) {
      updapteNumPos()
    }

    if (!isEqual(voies, prevProps.voies) || !isEqual(voie, prevProps.voie)) {
      sourceToUpdate.push({id: 'voies', data: voies})
    }

    if (!isEqual(numeros, prevProps.numeros)) {
      sourceToUpdate.push({id: 'numeros', data: numeros})

      if (numero) {
        updapteNumPos()
      }
    }

    this.setMode()

    const waiting = () => {
      if (map.isStyleLoaded() && map.areTilesLoaded()) {
        isLoading(false)
        if (sourceToUpdate.length > 0) {
          sourceToUpdate.forEach(source => {
            const {id, data} = source
            secureUpdateData(map, id, data)
          })
          this.onLoad()
        }
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
    map.off('click', this.mapClick)
    map.off('zoomend', this.zoomEnd)
    map.off('dataloading', this.onLoading)
    map.off('contextmenu', this.contextMenu)

    // Voies
    map.off('click', 'voies', this.onVoieClick)
    map.off('mouseenter', 'voies', this.mouseEnter)
    map.off('mouseleave', 'voies', this.mouseLeave)
    map.off('contextmenu', 'voies', this.editVoie)

    // Numéro
    map.off('click', 'numeros', this.onNumeroClick)
    map.off('click', 'numero-type', this.unselectNumero)
    map.off('contextmenu', 'numeros', this.deletedNumero)
    map.off('contextmenu', 'selected-numeros', this.deletedNumero)
    map.off('mouseenter', 'selected-numeros', this.mouseEnterNumero)
    map.off('mouseenter', 'numeros', this.mouseEnterNumero)
    map.off('mouseleave', 'selected-numeros', this.mouseLeaveNumero)
    map.off('mouseleave', 'numeros', this.mouseLeaveNumero)
    map.off('touchstart', 'numeros', this.touchStart)
    map.off('touchstart', 'selected-numeros', this.touchStart)
    map.off('mousedown', 'numeros', this.mouseDown)
    map.off('mousedown', 'selected-numeros', this.mouseDown)

    // Position
    map.off('mouseenter', 'positions-symbols', this.mouseEnter)
    map.off('mouseleave', 'positions-symbol', this.mouseLeave)
    map.off('contextmenu', 'positions-symbol', this.deletedPosition)
  }

  setMode() {
    const {voie, numero} = this.props

    if (numero) {
      this.mode = 'numero'
    } else if (voie) {
      this.mode = 'voie'
    } else {
      this.mode = 'commune'
    }
  }

  onLoading = () => {
    const {isLoading} = this.props
    isLoading(true)
  }

  onLoad = () => {
    const {map, voies, numeros} = this.props

    // Sources
    secureAddSource(map, 'voies', voies)
    secureAddSource(map, 'numeros', numeros)
    secureAddSource(map, 'positions', null)

    // Layers
    secureAddLayer(map, numerosPointLayer)
    secureAddLayer(map, numerosLayer)
    secureAddLayer(map, selectedNumerosLayer)
    secureAddLayer(map, voiesLayer)
    secureAddLayer(map, positionsSymbolLayer)

    this.resetLayers()

    if (this.mode === 'numero') {
      this.numeroMode()
    } else if (this.mode === 'voie') {
      this.voieMode()
    }
  }

  setSelectedFilters = () => {
    const {map, voie} = this.props
    const numerosFilters = [...NUMEROS_FILTERS]
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
    map.setLayoutProperty(positionsSymbolLayer.id, 'visibility', 'none')
    map.setLayoutProperty(voiesLayer.id, 'visibility', 'visible')
  }

  voieMode = () => {
    const {map, voie} = this.props

    if (voie) {
      this.setSelectedFilters()

      map.setPaintProperty(numerosLayer.id, 'text-opacity', 0.4)
      map.setLayoutProperty(selectedNumerosLayer.id, 'visibility', 'visible')
      map.setLayoutProperty(voiesLayer.id, 'visibility', 'none')

      this.fitZoom = map.getZoom()
    }
  }

  numeroMode = () => {
    const {map, voie, numero} = this.props

    map.setLayoutProperty(voiesLayer.id, 'visibility', 'none')
    map.setLayoutProperty(positionsSymbolLayer.id, 'visibility', 'visible')

    map.setFilter('numeros', ['!=', ['get', 'id'], numero.id])
    map.setFilter('numeros-point', ['!=', ['get', 'id'], numero.id])
    map.setFilter('selected-numeros', [
      'all',
      ['!=', ['get', 'id'], numero.id],
      ['==', ['get', 'codeVoie'], voie.codeVoie],
      DELETED_FILTER,
      VDELETED_FILTER
    ])

    this.fitZoom = map.getZoom()
  }

  zoomEnd = () => {
    const {map, voie, selectVoie} = this.props
    const currentZoom = map.getZoom()

    if (currentZoom < this.fitZoom - 0.5) {
      selectVoie(this.mode === 'numero' ? voie : null)
      this.fitZoom = null
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
    const {id} = e.features[0].properties
    const numero = numeros.features.find(n => n.properties.id === id)
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

  contextMenu = event => {
    const {layerX, layerY} = event.originalEvent
    const {lng, lat} = event.lngLat

    this.setState({
      context: {
        item: null,
        coordinates: [lng, lat],
        layer: {layerX, layerY}
      }
    })
  }

  mapClick = () => {
    this.closeContextMenu()
  }

  editVoie = event => {
    const {voies} = this.props
    const {codeVoie} = event.features[0].properties
    const voie = voies.features.find(v => v.properties.codeVoie === codeVoie)
    const {layerX, layerY} = event.originalEvent

    this.setState({
      context: {
        item: voie.properties,
        coordinates: null,
        layer: {layerX, layerY}
      }
    })
  }

  deletedNumero = event => {
    const {numeros} = this.props
    const {id} = event.features[0].properties
    const numero = numeros.features.find(n => n.properties.id === id)
    const {layerX, layerY} = event.originalEvent

    this.setState({
      context: {
        item: numero.properties,
        coordinates: null,
        layer: {layerX, layerY}
      }
    })
  }

  deletedPosition = event => {
    const {numero} = this.props
    const {_id} = event.features[0].properties
    const position = getNumeroPositions(numero).find(p => p._id === _id)
    const {layerX, layerY} = event.originalEvent

    this.setState({
      context: {
        item: position,
        coordinates: null,
        layer: {layerX, layerY}
      }
    })
  }

  closeContextMenu = () => {
    this.setState({context: null})
  }

  onMove = event => {
    const {map, numeros} = this.props
    const coords = event.lngLat

    map.getCanvas().style.cursor = 'grabbing'

    this.draggedNumero.geometry.coordinates = [coords.lng, coords.lat]
    map.getSource('numeros').setData(numeros)
  }

  onUp = async () => {
    const {map, actions} = this.props
    map.getCanvas().style.cursor = ''

    const numeroPosition = getNumeroPosition(this.draggedNumero.properties)
    const {coordinates} = this.draggedNumero.geometry

    if (numeroPosition.coords !== coordinates) {
      numeroPosition.coords = coordinates
      try {
        await actions.updateNumero(this.draggedNumero.properties, {
          positions: this.draggedNumero.properties.positions
        })
      } catch (error) {
        // TODO Display error
      }
    }

    this.draggedNumero = null

    map.off('mousemove', this.onMove)
    map.off('mousemove', 'selected-numeros', this.onMove)
    map.off('touchmove', 'numeros', this.onMove)
    map.off('touchmove', 'selected-numeros', this.onMove)
  }

  mouseDown = event => {
    const {map, popup, numeros} = this.props
    const {id} = event.features[0].properties
    this.draggedNumero = numeros.features.find(n => n.properties.id === id)

    event.preventDefault()

    popup.remove()

    map.getCanvas().style.cursor = 'grab'

    map.on('mousemove', this.onMove)
    map.once('mouseup', this.onUp)
  }

  touchStart = event => {
    const {map} = this.props
    if (event.points.length !== 1) {
      return
    }

    event.preventDefault()

    map.on('touchmove', 'numeros', this.onMove)
    map.once('touchend', this.onUp)

    map.on('touchmove', 'selected-numeros', this.onMove)
    map.once('touchend', this.onUp)
  }

  render() {
    const {context} = this.state
    const {voies, voie, numero, actions} = this.props

    return (context && (
      <ContextMenu
        item={context.item}
        voie={voie}
        numero={numero}
        voies={voies.features.map(voie => voie.properties)}
        coordinates={context.coordinates}
        layer={context.layer}
        actions={actions}
        close={this.closeContextMenu}
      />
    ))
  }
}

export default CommuneMap
