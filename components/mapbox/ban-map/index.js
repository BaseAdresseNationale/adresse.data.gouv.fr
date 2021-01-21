import React, {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import bboxPolygon from '@turf/bbox-polygon'
import booleanContains from '@turf/boolean-contains'

import theme from '@/styles/theme'

import CenterControl from '../center-control'
import SwitchPaintLayer from '../switch-paint-layer'
import MapLegends from '../map-legends'

import {adresseCircleLayer, adresseLabelLayer, adresseCompletLabelLayer, voieLayer, toponymeLayer, sources} from './layers'
import popupFeatures from './popups'
import {forEach} from 'lodash'

let hoveredVoieId = null

const SOURCES = ['adresses', 'toponymes']
const MAX_ZOOM = 19 // Zoom maximum de la carte

const ZOOM_RANGE = {
  commune: {
    min: adresseCircleLayer.minzoom,
    max: MAX_ZOOM
  },
  voie: {
    min: voieLayer.minzoom,
    max: voieLayer.maxzoom
  },
  numero: {
    min: adresseLabelLayer.minzoom,
    max: MAX_ZOOM
  },
  'lieu-dit': {
    min: toponymeLayer.minzoom,
    max: toponymeLayer.maxzoom
  }
}

const certificationLegend = {
  certified: {name: 'Certifié', color: theme.successBorder},
  notCertified: {name: 'Non certifié', color: theme.warningBorder}
}

const sourcesLayerPaint = {
  type: 'categorical',
  property: 'sourcePosition',
  stops: Object.keys(sources).map(key => {
    const {color} = sources[key]
    return [key, color]
  })
}

const defaultLayerPaint = [
  'case',
  ['==', ['get', 'sourcePosition'], 'bal'],
  theme.successBorder,
  theme.warningBorder
]

const isFeatureContained = (container, content) => {
  const polygonA = bboxPolygon(container)
  const polygonB = bboxPolygon(content)
  return booleanContains(polygonA, polygonB)
}

function BanMap({map, isSourceLoaded, popup, address, setSources, setLayers, onSelect}) {
  const [isCenterControlDisabled, setIsCenterControlDisabled] = useState(false)
  const [isSourcesLegendActive, setIsSourcesLegendActive] = useState(false)

  const onLeave = useCallback(() => {
    if (hoveredVoieId) {
      highLightVoie(false)
    }

    popup.remove()
    map.getCanvas().style.cursor = 'grab'
    hoveredVoieId = null
  }, [map, popup, highLightVoie])

  const highLightVoie = useCallback(isHovered => {
    forEach(SOURCES, sourceLayer => {
      forEach(map.querySourceFeatures('base-adresse-nationale', {
        sourceLayer,
        filter: ['in', hoveredVoieId, ['get', 'id']]
      }), ({id}) => {
        map.setFeatureState({source: 'base-adresse-nationale', sourceLayer, id}, {hover: isHovered})
      })
    })
  }, [])

  const onHover = useCallback(e => {
    if (e.features.length > 0) {
      if (hoveredVoieId) {
        highLightVoie(false)
      }

      hoveredVoieId = e.features[0].id.split('_').slice(0, 2).join('_')
      highLightVoie(true)

      map.getCanvas().style.cursor = 'pointer'
      popup.setLngLat(e.lngLat)
        .setHTML(popupFeatures(e.features))
        .addTo(map)
    } else {
      map.getCanvas().style.cursor = 'grab'
      popup.remove()
    }
  }, [map, popup, highLightVoie])

  const handleClick = (e, cb) => {
    const feature = e.features[0]
    cb(feature.properties)
  }

  const centerAddress = useCallback(() => {
    if (address && !isCenterControlDisabled) {
      map.fitBounds(address.displayBBox, {
        padding: 30
      })
      setIsCenterControlDisabled(true)
    }
  }, [address, isCenterControlDisabled, map])

  const isAddressVisible = useCallback(() => {
    if (address) {
      const {_sw, _ne} = map.getBounds()
      const mapBBox = [
        _sw.lng,
        _sw.lat,
        _ne.lng,
        _ne.lat
      ]

      const currentZoom = map.getZoom()
      const isAddressInMapBBox = isFeatureContained(mapBBox, address.displayBBox)

      const isZoomSmallerThanMax = currentZoom <= ZOOM_RANGE[address.type].max
      const isZoomGreaterThanMin = currentZoom >= ZOOM_RANGE[address.type].min
      setIsCenterControlDisabled(isAddressInMapBBox && isZoomSmallerThanMax && isZoomGreaterThanMin)
    } else {
      setIsCenterControlDisabled(true)
    }
  }, [map, address])

  const editPaintProperties = useCallback(() => {
    if (isSourcesLegendActive) {
      map.setPaintProperty(adresseCircleLayer.id, 'circle-color', sourcesLayerPaint)
      map.setPaintProperty(adresseLabelLayer.id, 'text-color', sourcesLayerPaint)
      map.setPaintProperty(adresseCompletLabelLayer.id, 'text-color', sourcesLayerPaint)
    } else {
      map.setPaintProperty(adresseCircleLayer.id, 'circle-color', defaultLayerPaint)
      map.setPaintProperty(adresseLabelLayer.id, 'text-color', defaultLayerPaint)
      map.setPaintProperty(adresseCompletLabelLayer.id, 'text-color', defaultLayerPaint)
    }
  }, [map, isSourcesLegendActive])

  useEffect(() => {
    isAddressVisible()
  }, [address, isAddressVisible])

  useEffect(() => {
    if (isSourceLoaded) {
      editPaintProperties()
    }
  }, [isSourceLoaded, editPaintProperties])

  useEffect(() => {
    map.off('dragend', isAddressVisible)
    map.off('zoomend', isAddressVisible)

    map.on('dragend', isAddressVisible)
    map.on('zoomend', isAddressVisible)

    return () => {
      map.off('dragend', isAddressVisible)
      map.off('zoomend', isAddressVisible)
    }
  }, [map, address, isAddressVisible])

  useEffect(() => {
    map.on('mousemove', 'adresse', onHover)
    map.on('mousemove', 'adresse-label', onHover)
    map.on('mousemove', 'voie', onHover)
    map.on('mousemove', 'toponyme', onHover)

    map.on('mouseleave', 'adresse', onLeave)
    map.on('mouseleave', 'adresse-label', onLeave)
    map.on('mouseleave', 'voie', onLeave)
    map.on('mouseleave', 'toponyme', onLeave)

    map.on('click', 'adresse', e => handleClick(e, onSelect))
    map.on('click', 'adresse-label', e => handleClick(e, onSelect))
    map.on('click', 'voie', e => handleClick(e, onSelect))
    map.on('click', 'toponyme', e => handleClick(e, onSelect))

    return () => {
      map.off('mousemove', 'adresse', onHover)
      map.off('mousemove', 'adresse-label', onHover)
      map.off('mousemove', 'voie', onHover)
      map.off('mousemove', 'toponyme', onHover)

      map.off('mouseleave', 'adresse', onLeave)
      map.off('mouseleave', 'adresse-label', onLeave)
      map.off('mouseleave', 'adresse', onLeave)
      map.off('mouseleave', 'adresse-label', onLeave)

      map.off('click', 'adresse', e => handleClick(e, onSelect))
      map.off('click', 'adresse-label', e => handleClick(e, onSelect))
      map.off('click', 'voie', e => handleClick(e, onSelect))
      map.off('click', 'toponyme', e => handleClick(e, onSelect))
    }

    // No dependency in order to mock a didMount and avoid duplicating events.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSources([{
      name: 'base-adresse-nationale',
      type: 'vector',
      format: 'pbf',
      tiles: [
        'https://plateforme.adresse.data.gouv.fr/tiles/ban/{z}/{x}/{y}.pbf'
      ],
      minzoom: 10,
      maxzoom: 14,
      promoteId: 'id'
    }])
    setLayers([
      adresseCircleLayer,
      adresseLabelLayer,
      adresseCompletLabelLayer,
      voieLayer,
      toponymeLayer
    ])
  }, [setSources, setLayers])

  useEffect(() => {
    if (isSourceLoaded && map.getLayer('adresse-complet-label') && map.getLayer('adresse-label')) {
      if (address && address.type === 'numero') {
        const {id} = address
        map.setFilter('adresse-complet-label', [
          '==', ['get', 'id'], id
        ])
        map.setFilter('adresse-label', [
          '!=', ['get', 'id'], id
        ])
      } else {
        map.setFilter('adresse-complet-label', [
          '==', ['get', 'id'], ''
        ])
        map.setFilter('adresse-label', [
          '!=', ['get', 'id'], ''
        ])
      }
    }
  }, [map, isSourceLoaded, address, setLayers])

  return (
    <>
      <CenterControl isDisabled={isCenterControlDisabled} handleClick={centerAddress} />
      <SwitchPaintLayer isActive={isSourcesLegendActive} handleClick={() => setIsSourcesLegendActive(!isSourcesLegendActive)} />
      {isSourcesLegendActive ? (
        <MapLegends title='Ces adresses sont transmises par les organismes suivants :' legend={sources} />
      ) : (
        <MapLegends title='Conformité' legend={certificationLegend} />
      )}
    </>
  )
}

BanMap.defaultProps = {
  address: null,
  isSourceLoaded: false,
  onSelect: () => {}
}

BanMap.propTypes = {
  address: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    position: PropTypes.object,
    displayBBox: PropTypes.array.isRequired
  }),
  map: PropTypes.object.isRequired,
  isSourceLoaded: PropTypes.bool,
  popup: PropTypes.object.isRequired,
  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  onSelect: PropTypes.func,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired
}

export default BanMap
