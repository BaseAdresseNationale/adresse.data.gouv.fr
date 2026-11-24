import { Source, Layer, Marker, Popup, useMap, MapMouseEvent } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { Address } from '../types'
import { env } from '@/utils/env'
import PanoramaxViewer, { PanoramaxSelection } from './PanoramaxViewer'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PanoramaxControls } from './PanoramaxControls'
import Image from 'next/image'

interface LayerPanoramaxProps {
  address: Address
  isVisible?: boolean
}

type PanoramaxLayout = 'viewer-main' | 'map-main'

const tilesEnv = env('NEXT_PUBLIC_PANORAMAX_TILES')
const endpoint = env('NEXT_PUBLIC_PANORAMAX_ENDPOINT')

if (!tilesEnv) {
  throw new Error('NEXT_PUBLIC_PANORAMAX_TILES is not defined in the environment variables')
}

const PANORAMAX_TILES: string = tilesEnv

export default function LayerPanoramax({ isVisible = false }: LayerPanoramaxProps) {
  const { current: map } = useMap()
  const visibility = isVisible ? 'visible' : 'none'
  const [selection, setSelection] = useState<PanoramaxSelection | null>(null)
  const [markerPos, setMarkerPos] = useState<{ lng: number, lat: number } | null>(null)
  const [layout, setLayout] = useState<PanoramaxLayout>('viewer-main')
  const hasSelection = selection !== null
  const mapContainer = map?.getMap().getContainer()
  const viewerHost = mapContainer?.parentElement
  const isMapMinimized = hasSelection && layout === 'viewer-main'
  const [hovered, setHovered] = useState<{ id: string, lng: number, lat: number } | null>(null)
  const [isReduced, setIsReduced] = useState(false)
  
  const toggleReduce = () => setIsReduced(reduce => !reduce)
  const toggleLayout = () => setLayout(layout => (layout === 'viewer-main' ? 'map-main' : 'viewer-main'))
  const closeViewer = () => { setSelection(null); setMarkerPos(null); setIsReduced(false) }

  useEffect(() => {
    if (!mapContainer || !isMapMinimized) return
    mapContainer.classList.add('map-minimized')
    return () => {
      mapContainer.classList.remove('map-minimized')
    }
  }, [mapContainer, isMapMinimized])

  useEffect(() => {
    if (!mapContainer || !isMapMinimized || !isReduced) return
    mapContainer.classList.add('map-minimized--reduced')
    return () => {
      mapContainer.classList.remove('map-minimized--reduced')
      map?.resize()
    }
  }, [mapContainer, isMapMinimized, isReduced, map])

  useEffect(() => {
    if (!selection) {
      setLayout('viewer-main')
      setIsReduced(false)
    }
  }, [selection])

  useEffect(() => {
    if (!isVisible) {
      closeViewer()
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
    const onMove = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0]
      const id = feature?.properties?.id
      if (!feature || !id || feature.geometry.type !== 'Point') return

      map.getCanvas().style.cursor = 'pointer'
      const [lng, lat] = feature.geometry.coordinates
      setHovered(prev => (prev?.id === String(id) ? prev : { id: String(id), lng, lat }))
    }
    const onLeave = () => {
      map.getCanvas().style.cursor = 'grab'
      setHovered(null)
    }

    map.on('click', 'panoramax-pictures', onClick)
    map.on('mouseenter', 'panoramax-pictures', onMove)
    map.on('mouseleave', 'panoramax-pictures', onLeave)

    return () => {
      map.off('click', 'panoramax-pictures', onClick)
      map.off('mouseenter', 'panoramax-pictures', onMove)
      map.off('mouseleave', 'panoramax-pictures', onLeave)
    }
  }, [map, isVisible])

  useEffect(() => {
    if (!isVisible) {
      setSelection(null)
      setMarkerPos(null)
      setHovered(null)
    }
  }, [isVisible])

  return (
    <>
      <Source id="panoramax" type="vector" tiles={[PANORAMAX_TILES]} minzoom={0} maxzoom={15}>
        <Layer
          id="panoramax-sequences"
          type="line"
          source-layer="sequences"
          minzoom={11}
          layout={{ visibility, 'line-cap': 'round', 'line-join': 'round' }}
          paint={{
            'line-color': '#FF6F00',
            'line-opacity': 0.8,
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 2],
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
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 2, 19, 5],
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 1,
          }}
        />
        <Layer
          id="panoramax-pictures-hover"
          type="circle"
          source-layer="pictures"
          minzoom={15}
          filter={['==', ['get', 'id'], hovered?.id ?? '']}
          layout={{ visibility }}
          paint={{
            'circle-color': '#0063CB',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 3, 19, 7],
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2,
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

      {isVisible && hovered && !isMapMinimized &&(
        <Popup
          longitude={hovered.lng}
          latitude={hovered.lat}
          anchor="bottom"
          offset={12}
          closeButton={false}
          closeOnClick={false}
          maxWidth="240px"
          style={{ pointerEvents: 'none' }}
        >
          <Image
            key={hovered.id}
            src={`${endpoint}/pictures/${hovered.id}/thumb.jpg`}
            alt="Aperçu de la photo Panoramax"
            width={240}
            height={160}
            unoptimized
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 4 }}
            onError={e => { e.currentTarget.style.display = 'none' }}
        />
        </Popup>
      )}

      {isVisible && selection && layout === 'viewer-main' && mapContainer && createPortal(
        <PanoramaxControls
          mode={layout}
          isReduced={isReduced}
          onToggleMode={toggleLayout}
          onClose={closeViewer}
          onToggleReduce={toggleReduce}
        />,
        mapContainer,
      )}
 
      {isVisible && selection && viewerHost && createPortal(
        <PanoramaxViewer
          selection={selection}
          mode={layout}
          isReduced={isReduced}
          onToggleMode={toggleLayout}
          onClose={closeViewer}
          onToggleReduce={toggleReduce}
          onPictureChange={pos => {
            setMarkerPos(pos)
            if (map?.getMap() && !map?.getMap().getBounds().contains([pos.lng, pos.lat])) {
              map?.getMap().easeTo({ center: [pos.lng, pos.lat] })
            }
          }}
        />,
        viewerHost,
      )}
    </>
  )
}