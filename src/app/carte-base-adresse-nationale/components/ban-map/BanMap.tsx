import { useEffect, useState, useRef } from 'react'
import { useMap, Popup } from 'react-map-gl/maplibre'

import LayerBan, { LayerAddressPositions } from './LayerBan'
import LayerCadastre from './LayerCadastre'
import LayerRnb from './LayerRnb'
import Popups, { RnbPopup } from './Popups'
import { RNB_FILL_LAYER_ID, RNB_MINZOOM, RNB_SOURCE_ID, RNB_SOURCE_LAYER } from './layers'

import type { MapMouseEvent, MapGeoJSONFeature } from 'react-map-gl/maplibre'
import type { PopupFeature } from './Popups'
import type { Address, PopupInfo } from './types'
import { TypeMicroToponymExtended } from '../../types/LegacyBan.types'

interface RnbPopupInfo {
  rnbId: string
  lngLat: { lng: number, lat: number }
}

interface BanMapProps {
  address: Address
  onSelect: (properties: any) => void
  isCadastreLayersShown?: boolean
  isRnbLayerShown?: boolean
  hightLightAdressesByItem: (
    banItem: TypeMicroToponymExtended,
    isSelected: boolean
  ) => void
  banItemSelected: TypeMicroToponymExtended
}

interface HoveredFeature extends PopupFeature {
  nom?: string
  id: string
}

interface HighLightAdressesByProperties {
  (isHovered: boolean, hoveredFeature: HoveredFeature): void
}

const SOURCES = ['adresses', 'toponymes']
const ITEM_LAYERS = ['adresse', 'adresse-label', 'voie', 'toponyme']
const PRIORITY_LAYERS = [...ITEM_LAYERS, 'adresse-complet-label', 'positions', 'positions-label']

function BanMap({ address, onSelect, isCadastreLayersShown, isRnbLayerShown, hightLightAdressesByItem, banItemSelected }: BanMapProps) {
  const hoveredFeature = useRef<PopupFeature | null>(null)
  const map = useMap()
  const [infoPopup, setInfoPopup] = useState<PopupInfo | null>(null)
  const [rnbPopup, setRnbPopup] = useState<RnbPopupInfo | null>(null)

  useEffect(() => {
    const currentMap = map.current
    const itemLayers = ['adresse', 'adresse-label', 'voie', 'toponyme']

    const highLightAdressesByProperties: HighLightAdressesByProperties = (
      isHovered: boolean,
      hoveredFeature: HoveredFeature,
    ) => {
      const { nom, id } = hoveredFeature
      if (!currentMap) return

      SOURCES.forEach((sourceLayer) => {
        currentMap.querySourceFeatures(
          'base-adresse-nationale',
          {
            sourceLayer,
            filter: [
              'any',
              ['in', nom as string, ['get', 'lieuDitComplementNom']],
              ['in', id, ['get', 'id']],
            ],
          }
        ).forEach(({ id }) => {
          currentMap.setFeatureState({ source: 'base-adresse-nationale', sourceLayer, id }, { hover: isHovered })
        })
      })
    }

    const onHover = (evt: MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined } & object) => {
      if (currentMap) {
        if (evt.features && evt.features.length > 0) {
          if (hoveredFeature.current) {
            highLightAdressesByProperties(false, hoveredFeature.current)
          }

          hoveredFeature.current = {
            id: `${evt.features[0].id}`?.split('_').slice(0, 2).join('_'),
            nom: evt.features[0].properties.nomVoie,
          }
          if (banItemSelected) {
            hightLightAdressesByItem(banItemSelected as TypeMicroToponymExtended, false)
          }
          highLightAdressesByProperties(true, hoveredFeature.current)

          currentMap.getCanvas().style.cursor = 'pointer'

          const geometry = evt.features[0].geometry
          if (geometry.type === 'Point') {
            setInfoPopup({
              features: evt.features,
              lngLat: {
                lat: geometry.coordinates[1],
                lng: geometry.coordinates[0],
              },
            })
          }
        }
        else {
          currentMap.getCanvas().style.cursor = 'grab'
          setInfoPopup(null)
        }
      }
    }

    const onLeave = (evt: MapMouseEvent) => {
      if (currentMap) {
        if (hoveredFeature.current) {
          highLightAdressesByProperties(false, hoveredFeature.current)
        }

        setInfoPopup(null)
        const isOverRnb = currentMap.getLayer(RNB_FILL_LAYER_ID)
          && currentMap.queryRenderedFeatures(evt.point, { layers: [RNB_FILL_LAYER_ID] }).length > 0
        currentMap.getCanvas().style.cursor = isOverRnb ? 'pointer' : 'grab'
        hoveredFeature.current = null
      }
    }

    const handleClick = (
      evt: MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined },
      callBack: (properties: { id: string }) => void
    ) => {
      if (evt.features && evt.features.length > 0) {
        const feature: MapGeoJSONFeature = evt.features[0]
        const idFromProperties =
          feature.properties?.id
          ?? feature.properties?.idVoie
          ?? feature.properties?.idToponyme
          ?? feature.id

        if (!idFromProperties) {
          return
        }

        callBack({ id: String(idFromProperties) })
      }
    }

    if (currentMap) {
      itemLayers.forEach((itemLayer) => {
        currentMap.on('mouseleave', itemLayer, onLeave)
        currentMap.on('mousemove', itemLayer, evt => onHover(evt))
        currentMap.on('click', itemLayer, evt => handleClick(evt, onSelect))
      })
    }

    return () => {
      if (currentMap) {
        itemLayers.forEach((itemLayer) => {
          currentMap.off('mouseleave', itemLayer, onLeave)
          currentMap.off('mousemove', itemLayer, onHover)
          currentMap.off('click', itemLayer, e => handleClick(e, onSelect))
        })
      }
    }
  }, [map, banItemSelected, onSelect, hightLightAdressesByItem])

  useEffect(() => {
    const currentMap = map.current
    if (!currentMap) return

    const onMapClick = (evt: MapMouseEvent) => {
      if ((evt.originalEvent?.target as HTMLElement | null)?.closest('.maplibregl-marker')) return

      const layers = [RNB_FILL_LAYER_ID, ...PRIORITY_LAYERS]
        .filter(id => currentMap.getLayer(id))
      const [topFeature] = currentMap.queryRenderedFeatures(evt.point, { layers })

      if (topFeature?.layer.id === RNB_FILL_LAYER_ID && topFeature.properties?.rnb_id) {
        setRnbPopup({ rnbId: String(topFeature.properties.rnb_id), lngLat: evt.lngLat })
      }
      else {
        setRnbPopup(null)
      }
    }

    // Survol d'un bâtiment, comme sur la carte du RNB : état `hovered` du bâtiment sous le curseur
    let hoveredRnbId: string | number | undefined
    const setHoveredRnb = (rnbId?: string | number) => {
      if (hoveredRnbId === rnbId) return
      if (hoveredRnbId !== undefined && currentMap.getSource(RNB_SOURCE_ID)) {
        currentMap.setFeatureState({ source: RNB_SOURCE_ID, sourceLayer: RNB_SOURCE_LAYER, id: hoveredRnbId }, { hovered: false })
      }
      hoveredRnbId = rnbId
      if (rnbId !== undefined) {
        currentMap.setFeatureState({ source: RNB_SOURCE_ID, sourceLayer: RNB_SOURCE_LAYER, id: rnbId }, { hovered: true })
      }
    }

    const onRnbEnter = () => {
      currentMap.getCanvas().style.cursor = 'pointer'
    }

    const onRnbMove = (evt: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      setHoveredRnb(evt.features?.[0]?.id)
    }

    const onRnbLeave = (evt: MapMouseEvent) => {
      setHoveredRnb(undefined)
      const layers = ITEM_LAYERS.filter(id => currentMap.getLayer(id))
      const isOverItem = layers.length > 0
        && currentMap.queryRenderedFeatures(evt.point, { layers }).length > 0
      currentMap.getCanvas().style.cursor = isOverItem ? 'pointer' : 'grab'
    }

    const onZoomEnd = () => {
      if (currentMap.getZoom() < RNB_MINZOOM) {
        setRnbPopup(null)
      }
    }

    currentMap.on('click', onMapClick)
    currentMap.on('zoomend', onZoomEnd)
    currentMap.on('mouseenter', RNB_FILL_LAYER_ID, onRnbEnter)
    currentMap.on('mousemove', RNB_FILL_LAYER_ID, onRnbMove)
    currentMap.on('mouseleave', RNB_FILL_LAYER_ID, onRnbLeave)

    return () => {
      currentMap.off('click', onMapClick)
      currentMap.off('zoomend', onZoomEnd)
      currentMap.off('mouseenter', RNB_FILL_LAYER_ID, onRnbEnter)
      currentMap.off('mousemove', RNB_FILL_LAYER_ID, onRnbMove)
      currentMap.off('mouseleave', RNB_FILL_LAYER_ID, onRnbLeave)
    }
  }, [map])

  // Sélection, comme sur la carte du RNB : seul le bâtiment de la popup a l'état `highlighted`.
  // Un changement de fond de carte efface les états : on les réapplique à chaque `styledata`.
  const selectedRnbId = rnbPopup?.rnbId
  useEffect(() => {
    const currentMap = map.current
    if (!currentMap) return

    const applyHighlight = () => {
      if (!currentMap.getSource(RNB_SOURCE_ID)) return
      currentMap.removeFeatureState({ source: RNB_SOURCE_ID, sourceLayer: RNB_SOURCE_LAYER })
      if (selectedRnbId) {
        currentMap.setFeatureState({ source: RNB_SOURCE_ID, sourceLayer: RNB_SOURCE_LAYER, id: selectedRnbId }, { highlighted: true })
      }
    }

    applyHighlight()
    currentMap.on('styledata', applyHighlight)
    return () => {
      currentMap.off('styledata', applyHighlight)
    }
  }, [map, selectedRnbId])

  useEffect(() => {
    if (!isRnbLayerShown) {
      setRnbPopup(null)
    }
  }, [isRnbLayerShown])

  return (
    <>
      { infoPopup?.features && (
        <Popup closeOnClick={false} closeButton={false} latitude={infoPopup.lngLat.lat} longitude={infoPopup.lngLat.lng}>
          <Popups features={infoPopup?.features as unknown as PopupFeature[] || []} />
        </Popup>
      )}
      { rnbPopup && (
        <Popup className="rnb-popup" closeButton closeOnClick={false} onClose={() => setRnbPopup(null)} latitude={rnbPopup.lngLat.lat} longitude={rnbPopup.lngLat.lng}>
          <RnbPopup rnbId={rnbPopup.rnbId} />
        </Popup>
      )}
      <LayerRnb isVisible={isRnbLayerShown} />
      <LayerBan address={address} />
      <LayerAddressPositions address={address} />
      <LayerCadastre address={address} isVisible={isCadastreLayersShown} />
    </>
  )
}

export default BanMap
