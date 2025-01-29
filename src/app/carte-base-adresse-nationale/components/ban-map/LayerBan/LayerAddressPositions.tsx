import { useEffect, useMemo, useState } from 'react'
import { Layer, Source, Marker, useMap } from 'react-map-gl/maplibre'

import {
  positionsLabelLayer,
  positionsCircleLayer,
} from '../layers'

import type { FillLayer } from 'react-map-gl/maplibre'

import { positionsConfigs } from '../layers'
import {
  MarkerPosition,
  positionTypes,
} from './MarkerPosition'

import type { Address } from '../types'

// sort Position for Main Position first
interface FeatureProperties {
  isMain?: boolean
}
const sortFct = (
  a: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>,
  b: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>,
): number => {
  if (a.properties?.isMain) return -1
  if (b.properties?.isMain) return 1
  return 0
}

function sortPositions(positions: GeoJSON.Feature[]) {
  return positions.sort((a, b) => {
    if (a.properties?.isMain) return 1
    if (b.properties?.isMain) return -1
    return 0
  })
}

const getPositionsFeatures = (address: Address): GeoJSON.Feature[] => {
  return address
  ?.positions
  ?.sort((a, b) => {
    if (a.position.coordinates.join() === address.position?.coordinates.join()) return -1
    if (b.position.coordinates.join() === address.position?.coordinates.join()) return 1
    return 0
  })
  ?.map((entry, index) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: entry.position.coordinates,
    },
    properties: {
      ...address,
      type: entry?.positionType || 'inconnu',
      label: positionsConfigs?.[entry?.positionType as string]?.name || 'Inconnu',
      nomVoie: address.voie.nomVoie,
      isMain: entry.position.coordinates.join() === address.position?.coordinates.join(),
      positionIndex: `${index}`,
      positionSize: address?.positions?.length || 0,
    },
  })) || []
}

function LayerAddressPositions({ address }: { address: Address }) {
  const { current: map } = useMap()
  const [zoom, setZoom] = useState(map?.getZoom() || 0)
  const dataPositionJson = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: getPositionsFeatures(address),
    }
  }
  , [address])

  const zoomPositionLevel = 16

  useEffect(() => {
    if (!map) return

    const handleZoom = () => setZoom(map.getZoom())
    map.on('zoom', handleZoom)

    return () => void map.off('zoom', handleZoom)
  }, [map])

  const calculateOpacity = (zoom: number) => {
    return zoom <= zoomPositionLevel
      ? 0
      : zoom >= (zoomPositionLevel + 1)
        ? 1
        : (zoom - zoomPositionLevel).toFixed(3)
  }

  const calculateSizeFactor = (zoom: number) => {
    return zoom <= zoomPositionLevel
      ? 0
      : zoom >= (zoomPositionLevel + 1)
        ? 1
        : ((zoom - zoomPositionLevel)).toFixed(3)
  }

  return (
    <>
      <Source
        id="positions"
        type="geojson"
        data={dataPositionJson}
      >
        <Layer {...(positionsLabelLayer as unknown as FillLayer)} />
        <Layer {...(positionsCircleLayer as unknown as FillLayer)} />
        {dataPositionJson.features.map((feature, index) => (
          <Marker
            key={index}
            longitude={(feature.geometry as GeoJSON.Point).coordinates[0]}
            latitude={(feature.geometry as GeoJSON.Point).coordinates[1]}
            anchor={positionTypes?.[feature.properties?.type]?.iconPosition || 'center'}
          >
            <MarkerPosition
              $positionType={feature.properties?.type}
              $isMain={feature.properties?.isMain}
              $isBal={feature.properties?.sourcePosition === 'bal'}
              $isCertified={feature.properties?.certifie}
              style={{
                opacity: calculateOpacity(zoom),
                transform: `scale(${calculateSizeFactor(zoom)})`,
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              } as React.CSSProperties}
            />
          </Marker>
        ))}
      </Source>
    </>
  )
}

export default LayerAddressPositions
