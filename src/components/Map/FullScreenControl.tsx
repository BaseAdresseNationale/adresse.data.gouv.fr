import { FullscreenControl as MaplibreFullscreenControl } from 'maplibre-gl'
import { ControlPosition, useControl } from 'react-map-gl/maplibre'

type FullScreenControlProps = {
  position?: ControlPosition
  container?: React.RefObject<HTMLElement> | HTMLElement | null
}

export function FullScreenControl(props: FullScreenControlProps) {
  const { position = 'top-right', container } = props

  useControl((context) => {
    const fallbackContainer = context.map.getContainer().parentElement ?? context.map.getContainer()
    return new MaplibreFullscreenControl({ container: (container as React.RefObject<HTMLElement>)?.current ?? container ?? fallbackContainer })
  }, {
    position,
  })

  return null
}
