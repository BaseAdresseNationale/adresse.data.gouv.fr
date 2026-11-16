import { Layer, Source } from 'react-map-gl/maplibre'

import { rnbLayers } from '../layers'

import type { FillLayerSpecification } from 'react-map-gl/maplibre'

interface PropsLayerRnb {
  isVisible?: boolean
}

function LayerRnb({ isVisible }: PropsLayerRnb) {
  return (
    <Source
      id="rnb"
      type="vector"
      tiles={['https://rnb-api.beta.gouv.fr/api/alpha/tiles/shapes/{x}/{y}/{z}.pbf']}
      minzoom={16}
      maxzoom={16}
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
