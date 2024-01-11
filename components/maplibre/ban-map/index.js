import {useCallback, useContext, useEffect, useMemo, useState} from 'react'
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
import {flatten, forEach} from 'lodash'

import DeviceContext from '@/contexts/device'
import {Layer, Source, useMap, Popup} from 'react-map-gl/maplibre'

const API_BAN_URL = process.env.NEXT_PUBLIC_API_BAN_URL || 'https://plateforme.adresse.data.gouv.fr'

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
        type: p?.positionType || 'inconnu',
        nomVoie: address.voie.nomVoie
      }
    }))
  }

  return []
}

function BanMap({address, bbox, onSelect, isMobile}) {
  const map = useMap()
  const {isSafariBrowser} = useContext(DeviceContext)
  const [isCenterControlDisabled, setIsCenterControlDisabled] = useState(true)
  const [selectedPaintLayer, setSelectedPaintLayer] = useState('certification')
  const [isCadastreDisplayable, setIsCadastreDisplayble] = useState(true)
  const [isCadastreLayersShown, setIsCadastreLayersShown] = useState(false)
  const [bound, setBound] = useState()
  const [infoPopup, setInfoPopup] = useState(null)

  const onLeave = useCallback(() => {
    if (hoveredFeature) {
      highLightAdressesByProperties(false, hoveredFeature)
    }

    setInfoPopup(null)
    map.current.getCanvas().style.cursor = 'grab'
    hoveredFeature = null
  }, [map, highLightAdressesByProperties])

  const highLightAdressesByProperties = useCallback((isHovered, hoveredFeature) => {
    const {nom, id} = hoveredFeature
    forEach(SOURCES, sourceLayer => {
      forEach(map.current.querySourceFeatures('base-adresse-nationale', {
        sourceLayer,
        filter: [
          'any',
          ['in', nom, ['get', 'lieuDitComplementNom']],
          ['in', id, ['get', 'id']]
        ]
      }), ({id}) => {
        map.current.setFeatureState({source: 'base-adresse-nationale', sourceLayer, id}, {hover: isHovered})
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

      map.current.getCanvas().style.cursor = 'pointer'

      setInfoPopup({...e})
    } else {
      map.current.getCanvas().style.cursor = 'grab'
      setInfoPopup(null)
    }
  }, [map, highLightAdressesByProperties])

  const handleClick = (e, cb) => {
    const feature = e.features[0]
    cb(feature.properties)
  }

  const centerAddress = useCallback(() => {
    if (bound && !isCenterControlDisabled) {
      map.current.fitBounds(bound, {
        padding: 30
      })
      setIsCenterControlDisabled(true)
    }
  }, [bound, isCenterControlDisabled, map])

  const isAddressVisible = useCallback(() => {
    if (address) {
      const {_sw, _ne} = map.current.getBounds()
      const mapBBox = [
        _sw.lng,
        _sw.lat,
        _ne.lng,
        _ne.lat
      ]

      const currentZoom = map.current.getZoom()
      const isAddressInMapBBox = bound ? isFeatureContained(mapBBox, bound) : false

      const isZoomSmallerThanMax = currentZoom <= ZOOM_RANGE[address.type].max
      const isZoomGreaterThanMin = currentZoom >= ZOOM_RANGE[address.type].min
      setIsCenterControlDisabled(isAddressInMapBBox && isZoomSmallerThanMax && isZoomGreaterThanMin)
    } else {
      setIsCenterControlDisabled(true)
    }
  }, [map, address, bound])

  const handleZoom = useCallback(() => {
    isAddressVisible()
    const zoom = map.current.getZoom()
    setIsCadastreDisplayble(zoom < PARCELLES_MINZOOM)
  }, [map, isAddressVisible])

  useEffect(() => {
    handleZoom()
  }, [address, isAddressVisible, handleZoom])

  useEffect(() => {
    map.current.off('dragend', handleZoom)
    map.current.off('zoomend', handleZoom)

    map.current.on('dragend', handleZoom)
    map.current.on('zoomend', handleZoom)

    map.current.on('mousemove', 'adresse', onHover)
    map.current.on('mousemove', 'adresse-label', onHover)
    map.current.on('mousemove', 'voie', onHover)
    map.current.on('mousemove', 'toponyme', onHover)

    map.current.on('mouseleave', 'adresse', onLeave)
    map.current.on('mouseleave', 'adresse-label', onLeave)
    map.current.on('mouseleave', 'voie', onLeave)
    map.current.on('mouseleave', 'toponyme', onLeave)

    map.current.on('click', 'adresse', e => handleClick(e, onSelect))
    map.current.on('click', 'adresse-label', e => handleClick(e, onSelect))
    map.current.on('click', 'voie', e => handleClick(e, onSelect))
    map.current.on('click', 'toponyme', e => handleClick(e, onSelect))
    return () => {
      map.current.off('dragend', handleZoom)
      map.current.off('zoomend', handleZoom)

      map.current.off('mousemove', 'adresse', onHover)
      map.current.off('mousemove', 'adresse-label', onHover)
      map.current.off('mousemove', 'voie', onHover)
      map.current.off('mousemove', 'toponyme', onHover)

      map.current.off('mouseleave', 'adresse', onLeave)
      map.current.off('mouseleave', 'adresse-label', onLeave)
      map.current.off('mouseleave', 'voie', onLeave)
      map.current.off('mouseleave', 'toponyme', onLeave)

      map.current.off('click', 'adresse', e => handleClick(e, onSelect))
      map.current.off('click', 'adresse-label', e => handleClick(e, onSelect))
      map.current.off('click', 'voie', e => handleClick(e, onSelect))
      map.current.off('click', 'toponyme', e => handleClick(e, onSelect))
    }

    // No dependency in order to mock a didMount and avoid duplicating events.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (bbox) {
      setBound(flatten(bbox))
    } else {
      setBound(address?.displayBBox)
    }
  }, [map, bbox, address])

  const cadastreFiltre = useMemo(() => address?.parcelles ? ['any', ...address.parcelles.map(id => ['==', ['get', 'id'], id])] : ['==', ['get', 'id'], ''], [address?.parcelles])

  const dataPositionJson = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: getPositionsFeatures(address)
    }
  }
  , [address])

  const [filtreIsAdresse, filtreIsnotAdresse] = useMemo(() =>
    [['==', ['get', 'id'], address?.id], ['!=', ['get', 'id'], address?.id]]
  , [address])

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

      { infoPopup?.features && (
        <Popup closeOnClick={false} closeButton={false} latitude={infoPopup.lngLat.lat} longitude={infoPopup.lngLat.lng}>
          {popupFeatures(infoPopup?.features || [])}
        </Popup>

      )}
      <Source id='cadastre'
        type='vector'
        url='https://openmaptiles.geo.data.gouv.fr/data/cadastre.json'
      >
        {cadastreLayers.map(cadastreLayerElt => {
          if (cadastreLayerElt.id === 'parcelle-highlighted') {
            cadastreLayerElt.filter = cadastreFiltre
          }

          return <Layer key={cadastreLayerElt.id} {...cadastreLayerElt} layout={{...cadastreLayerElt.layout, visibility: isCadastreLayersShown ? 'visible' : 'none'}} />
        }
        )}
      </Source>
      <Source id='base-adresse-nationale'
        type='vector'
        format='pbf'
        tiles={[
          `${API_BAN_URL}/tiles/ban/{z}/{x}/{y}.pbf`
        ]}
        minzoom={10}
        maxzoom={14}
        promoteId='id'
      >
        <Layer {...adresseCircleLayer} paint={{...adresseCircleLayer.paint, 'circle-color': paintLayers[selectedPaintLayer].paint}} />
        <Layer {...adresseLabelLayer} filter={address?.type === 'numero' ? filtreIsnotAdresse : true} paint={{...adresseLabelLayer.paint, 'text-color': paintLayers[selectedPaintLayer].paint}} />
        <Layer {...adresseCompletLabelLayer} filter={address?.type === 'numero' ? filtreIsAdresse : false} paint={{...adresseCompletLabelLayer.paint, 'text-color': paintLayers[selectedPaintLayer].paint}} />
        <Layer {...voieLayer} />
        <Layer {...toponymeLayer} />
      </Source>

      <Source
        id='positions'
        type='geojson'
        data={dataPositionJson}
      >
        <Layer {...positionsLabelLayer} />
        <Layer {...positionsCircleLayer} />
      </Source>
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
  onSelect: () => {},
  isMobile: false
}

BanMap.propTypes = {
  address: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    position: PropTypes.object,
    positions: PropTypes.array,
    parcelles: PropTypes.array,
    displayBBox: PropTypes.array,
    lat: PropTypes.number,
    lon: PropTypes.number,
    voie: PropTypes.object
  }),

  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  onSelect: PropTypes.func,

  isMobile: PropTypes.bool,
  bbox: PropTypes.arrayOf(PropTypes.number),
}

export default BanMap
