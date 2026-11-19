import { Layer, Source } from 'react-map-gl/maplibre'

import { rnbLayers, RNB_MINZOOM, RNB_SOURCE_ID } from '../layers'

import type { FillLayerSpecification } from 'react-map-gl/maplibre'

interface PropsLayerRnb {
  isVisible?: boolean
}

function LayerRnb({ isVisible }: PropsLayerRnb) {
  return (
    <Source
      id={RNB_SOURCE_ID}
      type="vector"
      tiles={['https://rnb-api.beta.gouv.fr/api/alpha/tiles/shapes/{x}/{y}/{z}.pbf']}
      minzoom={RNB_MINZOOM}
      maxzoom={RNB_MINZOOM}
      // Identifiant des features = rnb_id, pour les états survolé et sélectionné
      promoteId="rnb_id"
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
