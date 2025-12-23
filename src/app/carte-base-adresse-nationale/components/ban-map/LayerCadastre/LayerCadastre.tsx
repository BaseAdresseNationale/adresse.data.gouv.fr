import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'

import { cadastreLayers } from '../layers'

import type { FillLayer } from 'react-map-gl/maplibre'
import type { Address } from '../types.d'

interface PropsLayerCadastre {
  address: Address
  isVisible?: boolean
}

function LayerCadastre({ address, isVisible }: PropsLayerCadastre) {
  const cadastreFiltre = useMemo(() => (
    address?.parcelles && address.parcelles.length > 0
      ? ['any', ...address.parcelles.map(id => ['==', ['get', 'id'], id])]
      : ['==', ['get', 'id'], '']
  ), [address])

  return (
    <Source
      id="cadastre"
      type="vector"
      url="https://openmaptiles.geo.data.gouv.fr/data/cadastre.json"
    >
      {cadastreLayers.map((cadastreLayerElt: any) => {
        if (cadastreLayerElt.id === 'parcelle-highlighted') {
          if (cadastreLayerElt.filter !== undefined) {
            cadastreLayerElt.filter = cadastreFiltre as FillLayer['filter'] as string[]
          }
        }

        return (
          <Layer
            key={cadastreLayerElt.id}
            {...cadastreLayerElt}
            layout={{
              ...cadastreLayerElt.layout,
              visibility: isVisible ? 'visible' : 'none',
            } as FillLayer['layout']}
          />
        )
      }
      )}
    </Source>
  )
}

export default LayerCadastre
