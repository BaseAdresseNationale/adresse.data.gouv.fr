import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'

import {
  adresseCircleLayer,
  adresseLabelLayer,
  adresseCompletLabelLayer,
  voieLayer,
  toponymeLayer,
} from '../layers'

import type { FillLayer } from 'react-map-gl/maplibre'
import type { Address } from '../types.d'
import { env } from 'next-runtime-env'

const API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

function LayerBan({ address }: { address: Address }) {
  const isAdresseFilter = useMemo(() => ['==', ['get', 'id'], address?.id], [address])
  const isNotAdresseFilter = useMemo(() => ['!=', ['get', 'id'], address?.id], [address])

  return (
    <Source
      id="base-adresse-nationale"
      type="vector"
      tiles={[
        `${API_BAN_URL}/tiles/ban/{z}/{x}/{y}.pbf`,
      ]}
      minzoom={10}
      maxzoom={14}
      promoteId="id"
    >

      {/* Points Adresse */}
      <Layer {...(adresseCircleLayer as FillLayer)} />

      {/* Label des adresses */}
      <Layer
        {...{
          ...adresseLabelLayer,
          filter: address?.type === 'numero' ? isNotAdresseFilter : true,
        } as FillLayer}
      />

      {/* Label de l'adresse en cours d'affichage */}
      <Layer
        {...{
          ...adresseCompletLabelLayer,
          filter: address?.type === 'numero' ? isAdresseFilter : false,
        } as FillLayer}
      />

      {/* Toponyme : */}
      <Layer {...(voieLayer as unknown as FillLayer)} />

      {/* Toponyme sans adresse : */}
      <Layer {...(toponymeLayer as unknown as FillLayer)} />
    </Source>
  )
}

export default LayerBan
