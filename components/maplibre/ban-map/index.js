import {useCallback, useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import bboxPolygon from '@turf/bbox-polygon'
import booleanContains from '@turf/boolean-contains'

import theme from '@/styles/theme'

import CadastreLayerControl from '../cadastre-layer-control'
import CenterControl from '../center-control'
import SelectPaintLayer from '../select-paint-layer'
import MapLegends from '../map-legends'
import OpenGPS from '../open-gps'

import {
  positionsCircleLayer,
  positionsLabelLayer,
  adresseCircleLayer,
  adresseLabelLayer,
  adresseCompletLabelLayer,
  voieLayer,
  toponymeLayer,
  sources,
  sourcesLayerPaint,
  defaultLayerPaint,
  cadastreLayers,
  PARCELLES_MINZOOM
} from './layers'
import popupFeatures from './popups'
import {forEach} from 'lodash'

import DeviceContext from '@/contexts/device'

let hoveredFeature = null

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
  certificationInProgress: {name: 'Certification cours', color: theme.border},
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

const getPositionsFeatures = address => {
  if (address?.positions?.length > 1) {
    return address.positions.map(p => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: p.position.coordinates
      },
      properties: {
        ...address,
        type: p.positionType,
        nomVoie: address.voie.nomVoie
      }
    }))
  }
}

function BanMap({map, isSourceLoaded, popup, address, setSources, setLayers, onSelect, isMobile}) {
  const {isSafariBrowser} = useContext(DeviceContext)
  const [isCenterControlDisabled, setIsCenterControlDisabled] = useState(true)
  const [selectedPaintLayer, setSelectedPaintLayer] = useState('certification')
  const [isCadastreDisplayable, setIsCadastreDisplayble] = useState(true)
  const [isCadastreLayersShown, setIsCadastreLayersShown] = useState(false)
  const [positionsSource, setPositionsSource] = useState()

  const onLeave = useCallback(() => {
    if (hoveredFeature) {
      highLightAdressesByProperties(false, hoveredFeature)
    }

    popup.remove()
    map.getCanvas().style.cursor = 'grab'
    hoveredFeature = null
  }, [map, popup, highLightAdressesByProperties])

  const highLightAdressesByProperties = useCallback((isHovered, hoveredFeature) => {
    const {nom, id} = hoveredFeature
    forEach(SOURCES, sourceLayer => {
      forEach(map.querySourceFeatures('base-adresse-nationale', {
        sourceLayer,
        filter: [
          'any',
          ['in', nom, ['get', 'lieuDitComplementNom']],
          ['in', id, ['get', 'id']]
        ]
      }), ({id}) => {
        map.setFeatureState({source: 'base-adresse-nationale', sourceLayer, id}, {hover: isHovered})
      })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onHover = useCallback(e => {
    if (e.features.length > 0) {
      if (hoveredFeature) {
        highLightAdressesByProperties(false, hoveredFeature)
      }

      hoveredFeature = {
        id: e.features[0].id.split('_').slice(0, 2).join('_'),
        nom: e.features[0].properties.nomVoie
      }
      highLightAdressesByProperties(true, hoveredFeature)

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

  const handleZoom = useCallback(() => {
    isAddressVisible()
    const zoom = map.getZoom()
    setIsCadastreDisplayble(zoom < PARCELLES_MINZOOM)
  }, [map, isAddressVisible])

  useEffect(() => {
    handleZoom()
  }, [address, isAddressVisible, handleZoom])

  useEffect(() => {
    if (map.isStyleLoaded()) {
      map.setPaintProperty(adresseCircleLayer.id, 'circle-color', paintLayers[selectedPaintLayer].paint)
      map.setPaintProperty(adresseLabelLayer.id, 'text-color', paintLayers[selectedPaintLayer].paint)
      map.setPaintProperty(adresseCompletLabelLayer.id, 'text-color', paintLayers[selectedPaintLayer].paint)

      cadastreLayers.map(({id}) => (
        map.setLayoutProperty(
          id,
          'visibility',
          isCadastreLayersShown ? 'visible' : 'none'
        )
      ))

      if (address?.parcelles) {
        map.setFilter('parcelle-highlighted', ['any', ...address.parcelles.map(id => ['==', ['get', 'id'], id])])
      } else {
        map.setFilter('parcelle-highlighted', ['==', ['get', 'id'], ''])
      }

      if (address?.positions?.length > 1) {
        map.setFilter('positions', ['==', ['get', 'id'], address.id])
        map.setFilter('positions-label', ['==', ['get', 'id'], address.id])
        map.setFilter('adresse', ['!=', ['get', 'id'], address.id])
        map.setFilter('adresse-label', ['!=', ['get', 'id'], address.id])
      } else {
        map.setFilter('positions', ['==', ['get', 'id'], ''])
        map.setFilter('positions-label', ['==', ['get', 'id'], ''])
      }
    }
  }, [map, selectedPaintLayer, isCadastreLayersShown, address, isSourceLoaded])

  useEffect(() => {
    map.off('dragend', handleZoom)
    map.off('zoomend', handleZoom)

    map.on('dragend', handleZoom)
    map.on('zoomend', handleZoom)

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
      map.off('dragend', handleZoom)
      map.off('zoomend', handleZoom)

      map.off('mousemove', 'adresse', onHover)
      map.off('mousemove', 'adresse-label', onHover)
      map.off('mousemove', 'voie', onHover)
      map.off('mousemove', 'toponyme', onHover)

      map.off('mouseleave', 'adresse', onLeave)
      map.off('mouseleave', 'adresse-label', onLeave)
      map.off('mouseleave', 'voie', onLeave)
      map.off('mouseleave', 'toponyme', onLeave)

      map.off('click', 'adresse', e => handleClick(e, onSelect))
      map.off('click', 'adresse-label', e => handleClick(e, onSelect))
      map.off('click', 'voie', e => handleClick(e, onSelect))
      map.off('click', 'toponyme', e => handleClick(e, onSelect))
    }

    // No dependency in order to mock a didMount and avoid duplicating events.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSources([
      {
        name: 'base-adresse-nationale',
        type: 'vector',
        format: 'pbf',
        tiles: [
          'https://plateforme.adresse.data.gouv.fr/tiles/ban/{z}/{x}/{y}.pbf'
        ],
        minzoom: 10,
        maxzoom: 14,
        promoteId: 'id'
      },
      {
        name: 'cadastre',
        type: 'vector',
        url: 'https://openmaptiles.geo.data.gouv.fr/data/cadastre.json'
      },
      {
        name: 'positions',
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      }
    ])
    setLayers([
      ...cadastreLayers,
      adresseCircleLayer,
      adresseLabelLayer,
      adresseCompletLabelLayer,
      voieLayer,
      toponymeLayer,
      positionsLabelLayer,
      positionsCircleLayer
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

  useEffect(() => {
    if (map && address?.type === 'numero' && positionsSource) {
      positionsSource.setData({
        type: 'FeatureCollection',
        features: getPositionsFeatures(address)
      })
    }
  }, [map, address, positionsSource])

  useEffect(() => {
    if (isSourceLoaded) {
      setPositionsSource(map.getSource('positions'))
    }
  }, [map, isSourceLoaded])

  return (
    <>
      <div className='maplibregl-ctrl-group maplibregl-ctrl'>
        <CenterControl
          isDisabled={isCenterControlDisabled}
          handleClick={centerAddress}
          isMultiPositions={address?.positions?.length > 1}
        />
        <CadastreLayerControl isDisabled={isCadastreDisplayable} isActived={isCadastreLayersShown} handleClick={() => setIsCadastreLayersShown(!isCadastreLayersShown)} />
        {isMobile && address && (
          <OpenGPS coordinates={{lat: address.lat, lon: address.lon}} isSafariBrowser={isSafariBrowser} />
        )}
      </div>

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

      <style jsx>{`
        .maplibregl-ctrl-group {
          position: absolute;
          box-shadow: none;
          border: 2px solid #dcd8d5;
          z-index: 2;
          right: 8px;
          top: 80px;
        }
        `}</style>
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
    positions: PropTypes.object,
    parcelles: PropTypes.array,
    displayBBox: PropTypes.array,
    lat: PropTypes.number,
    lon: PropTypes.number,
    voie: PropTypes.object
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
