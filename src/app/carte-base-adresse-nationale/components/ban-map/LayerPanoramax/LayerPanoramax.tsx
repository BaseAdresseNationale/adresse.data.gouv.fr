import { Source, Layer } from 'react-map-gl/maplibre'

import type { Address } from '../types'
import { env } from 'next-runtime-env'

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
  const visibility = isVisible ? 'visible' : 'none'

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
    </>
  )
}

export default LayerPanoramax