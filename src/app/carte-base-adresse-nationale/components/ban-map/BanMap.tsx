import { useEffect, useState, useRef } from 'react'
import { useMap, Popup } from 'react-map-gl/maplibre'

import LayerBan from './LayerBan'
import LayerCadastre from './LayerCadastre'
import Popups from './Popups'

import type { MapMouseEvent, MapGeoJSONFeature } from 'react-map-gl/maplibre'
import type { PopupFeature } from './Popups'
import type { Address, PopupInfo } from './types'

interface BanMapProps {
  address: Address
  onSelect: (properties: any) => void
  isCadastreLayersShown?: boolean
}

interface HoveredFeature extends PopupFeature {
  nom?: string
  id: string
}

interface HighLightAdressesByProperties {
  (isHovered: boolean, hoveredFeature: HoveredFeature): void
}

const SOURCES = ['adresses', 'toponymes']

function BanMap({ address, onSelect, isCadastreLayersShown }: BanMapProps) {
  const hoveredFeature = useRef<PopupFeature | null>(null)
  const map = useMap()
  const [infoPopup, setInfoPopup] = useState<PopupInfo | null>(null)

  useEffect(() => {
    const currentMap = map.current
    const itemLayers = ['adresse', 'adresse-label', 'voie', 'toponyme']
    console.log('CurrentMap Effect', currentMap)

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

    const onHover = (evt: MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined } & Object) => {
      if (currentMap) {
        if (evt.features && evt.features.length > 0) {
          if (hoveredFeature.current) {
            highLightAdressesByProperties(false, hoveredFeature.current)
          }

          hoveredFeature.current = {
            id: `${evt.features[0].id}`?.split('_').slice(0, 2).join('_'),
            nom: evt.features[0].properties.nomVoie,
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

    const onLeave = () => {
      if (currentMap) {
        console.log('onLeave')
        if (hoveredFeature.current) {
          highLightAdressesByProperties(false, hoveredFeature.current)
        }

        setInfoPopup(null)
        currentMap.getCanvas().style.cursor = 'grab'
        hoveredFeature.current = null
      }
    }

    const handleClick = (
      evt: MapMouseEvent & { features?: MapGeoJSONFeature[] | undefined },
      callBack: (properties: MapGeoJSONFeature['properties']) => void
    ) => {
      if (evt.features && evt.features.length > 0) {
        const feature: MapGeoJSONFeature = evt.features[0]
        callBack(feature.properties)
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
      console.log('CurrentMap Stop Effect', currentMap)

      if (currentMap) {
        itemLayers.forEach((itemLayer) => {
          currentMap.off('mouseleave', itemLayer, onLeave)
          currentMap.off('mousemove', itemLayer, onHover)
          currentMap.off('click', itemLayer, e => handleClick(e, onSelect))
        })
      }
    }
  }, [map, onSelect])

  return (
    <>
      { infoPopup?.features && (
        <Popup closeOnClick={false} closeButton={false} latitude={infoPopup.lngLat.lat} longitude={infoPopup.lngLat.lng}>
          <Popups features={infoPopup?.features as unknown as PopupFeature[] || []} />
        </Popup>
      )}
      <LayerBan address={address} />
      <LayerCadastre address={address} isVisible={isCadastreLayersShown} />
    </>
  )
}

export default BanMap
