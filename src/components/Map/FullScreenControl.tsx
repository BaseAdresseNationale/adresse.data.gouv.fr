import maplibregl from 'maplibre-gl'
import { ControlPosition, useControl } from 'react-map-gl/maplibre'

type FullScreenControlProps = {
  position?: ControlPosition
  container?: HTMLElement | null
}

export function FullScreenControl(props: FullScreenControlProps) {
  const { position = 'top-right', container } = props

  useControl((context) => {
    const fallbackContainer = context.map.getContainer().parentElement ?? context.map.getContainer()
    return new maplibregl.FullscreenControl({ container: container ?? fallbackContainer })
  }, {
    position,
  })

  return null
}
