import React, {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import bboxPolygon from '@turf/bbox-polygon'
import booleanContains from '@turf/boolean-contains'

import theme from '@/styles/theme'

import CenterControl from '../center-control'
import SelectPaintLayer from '../select-paint-layer'
import MapLegends from '../map-legends'

import {
  adresseCircleLayer,
  adresseLabelLayer,
  adresseCompletLabelLayer,
  voieLayer,
  toponymeLayer,
  sources,
  sourcesLayerPaint,
  defaultLayerPaint
} from './layers'
import popupFeatures from './popups'
import {forEach} from 'lodash'

let hoveredVoieId = null
let hoveredToponymeNom = null

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
  certified: {name: 'Certifiée', color: theme.successBorder},
  notCertified: {name: 'Non certifiée', color: theme.warningBorder}
}

const paintLayers = {
  certification: {
    name: 'Certification',
    legend: {
      title: 'Certification',
      content: certificationLegend
    },
    paint: defaultLayerPaint
  },
  sources: {
    name: 'Sources',
    legend: {
      title: 'Adresses transmises par :',
      content: sources
    },
    paint: sourcesLayerPaint
  }
}

const isFeatureContained = (container, content) => {
  const polygonA = bboxPolygon(container)
  const polygonB = bboxPolygon(content)
  return booleanContains(polygonA, polygonB)
}

function BanMap({map, isSourceLoaded, popup, address, setSources, setLayers, onSelect, isMobile}) {
  const [isCenterControlDisabled, setIsCenterControlDisabled] = useState(false)
  const [selectedPaintLayer, setSelectedPaintLayer] = useState('certification')

  const onLeave = useCallback(() => {
    if (hoveredVoieId) {
      highLightAdressesByProperties(false, hoveredVoieId, 'id')
    }

    if (hoveredToponymeNom) {
      highLightAdressesByProperties(false, hoveredToponymeNom, 'lieuDitComplementNom')
    }

    popup.remove()
    map.getCanvas().style.cursor = 'grab'
    hoveredVoieId = null
    hoveredToponymeNom = null
  }, [map, popup, highLightAdressesByProperties])

  const highLightAdressesByProperties = useCallback((isHovered, filter, prop) => {
    forEach(SOURCES, sourceLayer => {
      forEach(map.querySourceFeatures('base-adresse-nationale', {
        sourceLayer,
        filter: ['in', filter, ['get', prop]]
      }), ({id}) => {
        map.setFeatureState({source: 'base-adresse-nationale', sourceLayer, id}, {hover: isHovered})
      })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onHover = useCallback(e => {
    if (e.features.length > 0) {
      hoveredToponymeNom = e.features[0].properties.nomVoie
      highLightAdressesByProperties(true, hoveredToponymeNom, 'lieuDitComplementNom')

      if (hoveredVoieId) {
        highLightAdressesByProperties(false, hoveredVoieId, 'id')
      }

      hoveredVoieId = e.features[0].id.split('_').slice(0, 2).join('_')
      highLightAdressesByProperties(true, hoveredVoieId, 'id')

      map.getCanvas().style.cursor = 'pointer'
      popup.setLngLat(e.lngLat)
        .setHTML(popupFeatures(e.features))
        .addTo(map)
    } else {
      map.getCanvas().style.cursor = 'grab'
      popup.remove()
    }
  }, [map, popup, highLightAdressesByProperties])

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
      const isAddressInMapBBox = address.displayBBox ? isFeatureContained(mapBBox, address.displayBBox) : false

      const isZoomSmallerThanMax = currentZoom <= ZOOM_RANGE[address.type].max
      const isZoomGreaterThanMin = currentZoom >= ZOOM_RANGE[address.type].min
      setIsCenterControlDisabled(isAddressInMapBBox && isZoomSmallerThanMax && isZoomGreaterThanMin)
    } else {
      setIsCenterControlDisabled(true)
    }
  }, [map, address])

  useEffect(() => {
    isAddressVisible()
  }, [address, isAddressVisible])

  useEffect(() => {
    if (map.isStyleLoaded()) {
      map.setPaintProperty(adresseCircleLayer.id, 'circle-color', paintLayers[selectedPaintLayer].paint)
      map.setPaintProperty(adresseLabelLayer.id, 'text-color', paintLayers[selectedPaintLayer].paint)
      map.setPaintProperty(adresseCompletLabelLayer.id, 'text-color', paintLayers[selectedPaintLayer].paint)
    }
  }, [map, selectedPaintLayer])

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
      <SelectPaintLayer
        options={paintLayers}
        selected={selectedPaintLayer}
        handleSelect={setSelectedPaintLayer}
        isMobile={isMobile}
      >
        <MapLegends
          title={paintLayers[selectedPaintLayer].legend.title}
          legend={paintLayers[selectedPaintLayer].legend.content}
        />
      </SelectPaintLayer>
    </>
  )
}

BanMap.defaultProps = {
  address: null,
  isSourceLoaded: false,
  onSelect: () => {},
  isMobile: false
}

BanMap.propTypes = {
  address: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    position: PropTypes.object,
    displayBBox: PropTypes.array
  }),
  map: PropTypes.object.isRequired,
  isSourceLoaded: PropTypes.bool,
  popup: PropTypes.object.isRequired,
  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  onSelect: PropTypes.func,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
}

export default BanMap
