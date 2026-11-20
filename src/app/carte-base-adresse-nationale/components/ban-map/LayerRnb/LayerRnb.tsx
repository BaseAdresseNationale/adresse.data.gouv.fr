import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'

import { getRnbLayers, RNB_MINZOOM } from '../layers'

import type { FillLayerSpecification } from 'react-map-gl/maplibre'

interface PropsLayerRnb {
  isVisible?: boolean
  selectedRnbId?: string | null
  hoveredRnbId?: string | null
}

function LayerRnb({ isVisible, selectedRnbId, hoveredRnbId }: PropsLayerRnb) {
  // Les couleurs de sélection et de survol sont dans le style : react-map-gl les
  // réapplique d'elle-même, y compris après un changement de fond de carte.
  const rnbLayers = useMemo(
    () => getRnbLayers({ selectedRnbId, hoveredRnbId }),
    [selectedRnbId, hoveredRnbId],
  )

  return (
    <Source
      id="rnb"
      type="vector"
      tiles={['https://rnb-api.beta.gouv.fr/api/alpha/tiles/shapes/{x}/{y}/{z}.pbf']}
      minzoom={RNB_MINZOOM}
      maxzoom={RNB_MINZOOM}
    >
      {rnbLayers.map((rnbLayerElt: any) => (
        <Layer
          key={rnbLayerElt.id}
          {...rnbLayerElt}
          layout={{
            ...rnbLayerElt.layout,
            visibility: isVisible ? 'visible' : 'none',
          } as FillLayerSpecification['layout']}
        />
      ))}
    </Source>
  )
}

export default LayerRnb
