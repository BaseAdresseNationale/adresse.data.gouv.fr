import { Source, Layer, Marker, useMap, MapMouseEvent } from 'react-map-gl/maplibre'
import type { Address } from '../types'
import { env } from 'next-runtime-env'
import PanoramaxViewer, { PanoramaxSelection } from './PanoramaxViewer'
import { useEffect, useState } from 'react'

interface LayerPanoramaxProps {
  address: Address
  isVisible?: boolean
}

const tilesEnv = env('NEXT_PUBLIC_PANORAMAX_TILES')

if (!tilesEnv) {
  throw new Error('NEXT_PUBLIC_PANORAMAX_TILES is not defined in the environment variables')
}

const PANORAMAX_TILES: string = tilesEnv

function LayerPanoramax({ isVisible = false }: LayerPanoramaxProps) {
  const { current: map } = useMap()
  const visibility = isVisible ? 'visible' : 'none'
  const [selection, setSelection] = useState<PanoramaxSelection | null>(null)
  const [markerPos, setMarkerPos] = useState<{ lng: number, lat: number } | null>(null)

  useEffect(() => {
    if (!isVisible) {
      setSelection(null)
      setMarkerPos(null)
    }
  }, [isVisible])

  useEffect(() => {
    if(!map || !isVisible) return

    const onClick = (element: MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(element.point, { layers: ['panoramax-pictures'] })[0]
      const id = feature?.properties?.id
      if (!id) return

      const sequenceId = JSON.parse(feature.properties?.sequences ?? '[]')?.[0]

      setSelection({ pictureId: String(id), sequenceId })
      setMarkerPos({ lng: element.lngLat.lng, lat: element.lngLat.lat })
    }
    const onEnter = () => { map.getCanvas().style.cursor = 'pointer' }
    const onLeave = () => { map.getCanvas().style.cursor = 'grab' }

    map.on('click', 'panoramax-pictures', onClick)
    map.on('mouseenter', 'panoramax-pictures', onEnter)
    map.on('mouseleave', 'panoramax-pictures', onLeave)

    return () => {
      map.off('click', 'panoramax-pictures', onClick)
      map.off('mouseenter', 'panoramax-pictures', onEnter)
      map.off('mouseleave', 'panoramax-pictures', onLeave)
    }
  }, [map, isVisible])

  return (
    <>
      <Source id="panoramax" type="vector" tiles={[PANORAMAX_TILES]} minzoom={0} maxzoom={15}>
        <Layer
          id="panoramax-sequences"
          type="line"
          source-layer="sequences"
          layout={{ visibility, 'line-cap': 'round', 'line-join': 'round' }}
          paint={{
            'line-color': '#FF6F00',
            'line-opacity': 0.8,
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 4],
          }}
        />
        <Layer
          id="panoramax-pictures"
          type="circle"
          source-layer="pictures"
          minzoom={15}
          layout={{ visibility }}
          paint={{
            'circle-color': '#FF6F00',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 4, 19, 8],
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 1,
          }}
        />
      </Source>

      {isVisible && markerPos && (
        <Marker longitude={markerPos.lng} latitude={markerPos.lat} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#0063CB',
              border: '3px solid #fff',
              boxShadow: '0 0 0 2px #0063CB',
            }}
          />
        </Marker>
      )}
 
      {isVisible && selection && (
        <PanoramaxViewer
          selection={selection}
          onClose={() => { setSelection(null); setMarkerPos(null) }}
          onPictureChange={pos => {
            setMarkerPos(pos)
            if (map?.getMap() && !map?.getMap().getBounds().contains([pos.lng, pos.lat])) {
              map?.getMap().easeTo({ center: [pos.lng, pos.lat] })
            }
          }}
        />
      )}
    </>
  )
}

export default LayerPanoramax