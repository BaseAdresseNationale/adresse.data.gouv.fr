import maplibregl from 'maplibre-gl'
import { ControlPosition, useControl } from 'react-map-gl/maplibre'

type FullScreenControlProps = {
  position?: ControlPosition
}

export function FullScreenControl(props: FullScreenControlProps) {
  const { position = 'top-right' } = props

  useControl(() => new maplibregl.FullscreenControl(), {
    position,
  })

  return null
}
