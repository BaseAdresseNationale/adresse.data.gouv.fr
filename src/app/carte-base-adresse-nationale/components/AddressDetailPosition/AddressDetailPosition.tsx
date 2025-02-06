import { Fragment, useCallback } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'

import { useMapFlyTo } from '../ban-map/BanMap.context'

import {
  PositionWrapper,
  PositionDetails,
  PositionActions,
  PositionDetailEntryType,
  PositionType,
  PositionCoords,
  PositionCoordValue,
  PositionMarker,
} from './AddressDetailPosition.styles'

import {
  formatCoords,
  copyCoordsToClipboard,
  getLinkFromCoords,
} from './AddressDetailPosition.helper'

interface AddressDetailPositionProps {
  type: string
  coords: [number, number]
  marker?: string
  onFlyToPosition?: () => void
  isSmartDevice: boolean
}

export const AddressDetailPosition = ({ type, coords, marker, onFlyToPosition, isSmartDevice }: AddressDetailPositionProps) => {
  const { mapFlyTo } = useMapFlyTo()

  interface FlyToOptions {
    zoom: number
  }

  const flyToPosition = useCallback((coords: [number, number], options: FlyToOptions) => {
    mapFlyTo?.(coords, options)
    onFlyToPosition?.()
  }, [mapFlyTo, onFlyToPosition])

  return (
    <PositionWrapper>
      {marker && <PositionMarker>{marker}</PositionMarker>}
      <PositionDetails>
        <PositionType>Type : <PositionDetailEntryType>{type}</PositionDetailEntryType></PositionType>
        <PositionCoords>{
          formatCoords(coords)?.split(',').map(
            (coord, i, arr) => (
              <Fragment key={coord}>
                <PositionCoordValue>
                  {coord.trim()}
                </PositionCoordValue>
                {(i < (arr.length - 1)) ? ', ' : ''}
              </Fragment>
            )
          )
        }
        </PositionCoords>
      </PositionDetails>
      <PositionActions>
        <Button
          iconId="ri-focus-3-line"
          onClick={() => flyToPosition?.(coords, { zoom: 19 })}
          priority="tertiary no outline"
          size="small"
          title="Centrer sur la position"
        />
        <Button
          iconId="ri-file-copy-line"
          onClick={() => copyCoordsToClipboard(coords)}
          priority="tertiary no outline"
          size="small"
          title="Copier la position GPS"
        />
        {
          isSmartDevice && 'geolocation' in navigator
          && (
            <Button
              iconId="ri-share-forward-line"
              linkProps={{
                href: getLinkFromCoords(coords),
              }}
              priority="tertiary no outline"
              size="small"
              title="Afficher la position GPS"
            />
          )
        }
      </PositionActions>
    </PositionWrapper>
  )
}
