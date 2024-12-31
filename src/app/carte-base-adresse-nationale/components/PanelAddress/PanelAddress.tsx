import Button from '@codegouvfr/react-dsfr/Button'

import { AddressDetailsCertification } from './PanelAddress.styles'
import { useMapFlyTo } from '../ban-map/BanMap.context'

import {
  PanelDetailsWrapper as AddressDetailsWrapper,
  PanelDetailsItem as AddressDetailsItem,
  PanelDetailsItemValue as AddressDetailsItemValue,
  PanelDetailsOrigin as AddressDetailsOrigin,
} from '../PanelStyles/PanelStyles'

import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface PanelAddressProps {
  address: TypeAddressExtended
}

interface Position {
  position: TypeAddressExtended['position']
  positionType: TypeAddressExtended['positionType']
}

function formatCoordinates(coords: [number, number]): string {
  const [lon, lat] = coords
  const formattedLon = Math.abs(lon).toFixed(6)
  const formattedLat = Math.abs(lat).toFixed(6)
  const lonDirection = lon >= 0 ? 'E' : 'W'
  const latDirection = lat >= 0 ? 'N' : 'S'
  return `${formattedLat}° ${latDirection}, ${formattedLon}° ${lonDirection}`
}

const configOriginAddress = {
  bal: {
    className: 'ri-star-fill isFormal',
    message: <>Cette adresse est issue d’une Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL)</>,
    desc: <>Les Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL) sont directement produites par les communes.</>,
  },
  default: {
    className: 'ri-government-fill',
    message: <>Cette adresse est issue d’une Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL)</>,
    desc: <>Les Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL) sont directement produites par les communes.</>,
  },
}

const certificationLevelConfig = {
  0: {
    message: 'Cette adresse n’est pas certifiée',
    desc: 'Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.',
    className: 'fr-icon-error-fill isFailed',
  },
  1: {
    message: 'Cette adresse est certifiée',
    desc: 'Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.',
    className: 'ri-checkbox-circle-fill isSuccessful',
  },
}

function PanelAddress({ address }: PanelAddressProps) {
  const { mapFlyTo } = useMapFlyTo()
  const dateMaj = new Date(address.dateMAJ).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const isMultiPosition = Number(address.positions?.length) > 1
  const {
    mainPosition,
    secondariesPositions,
  }: {
    mainPosition: Position
    secondariesPositions: Position[]
  } = isMultiPosition
    ? address.positions.reduce((acc, entry) => {
      if (entry.position.coordinates.join('--') === address.position.coordinates.join('--')) {
        acc.mainPosition = entry
      }
      else {
        acc.secondariesPositions.push(entry)
      }
      return acc
    }, { mainPosition: (null as unknown as Position), secondariesPositions: ([] as Position[]) })
    : { mainPosition: {
        position: address.position,
        positionType: address.positionType,
      }, secondariesPositions: [] }

  return (
    <AddressDetailsWrapper>
      <AddressDetailsOrigin config={configOriginAddress} origin={address.sourcePosition} />
      <AddressDetailsCertification certificationConfig={certificationLevelConfig} isCertified={address.certifie} />

      <AddressDetailsItem className="ri-key-line">
        <span>
          Identifiant BAN : <br />
          <AddressDetailsItemValue>{address.banId}</AddressDetailsItemValue>
        </span>
      </AddressDetailsItem>
      <AddressDetailsItem className="ri-links-line">
        <span>
          Clé d’interopérabilité : <br />
          <AddressDetailsItemValue>{address.cleInterop}</AddressDetailsItemValue>
        </span>
      </AddressDetailsItem>
      <AddressDetailsItem className="ri-collage-line">
        <span>
          Parcelles cadastrales : <br />
          <AddressDetailsItemValue>{address?.parcelles.join(', ') || 'Non renseignée(s)'}</AddressDetailsItemValue>
        </span>
      </AddressDetailsItem>
      <AddressDetailsItem className="ri-calendar-line">
        Date de mise à jour : <br />
        {dateMaj}
      </AddressDetailsItem>
      <AddressDetailsItem className="ri-edit-box-line">
        Producteur : <br />
        {address.sourcePosition}
      </AddressDetailsItem>
      <AddressDetailsItem className="ri-signpost-line">
        Libellé d’acheminement : <br />
        {address.libelleAcheminement}
      </AddressDetailsItem>
      <AddressDetailsItem className="ri-map-pin-line">
        {isMultiPosition ? 'Position Principale' : 'Position'} : <br />
        <span>{mainPosition.positionType} • {formatCoordinates(mainPosition.position.coordinates as [number, number])}</span> <br />
        <span>
          <Button
            iconId="ri-focus-3-line"
            onClick={() => mapFlyTo?.(mainPosition.position.coordinates as [number, number])}
            priority="tertiary no outline"
            size="small"
            title="Centrer sur la position"
          />
        </span>
      </AddressDetailsItem>
      {isMultiPosition && (
        <AddressDetailsItem className="ri-map-pin-2-line">
          Position Secondaire : <br />
          <ol>
            {secondariesPositions.map((entry, index) => (
              <li key={index}>
                <span>{entry.positionType} • {formatCoordinates(entry.position.coordinates as [number, number])}</span> <br />
                <span>
                  <Button
                    iconId="ri-focus-3-line"
                    onClick={() => mapFlyTo?.(entry.position.coordinates as [number, number])}
                    priority="tertiary no outline"
                    size="small"
                    title="Centrer sur la position"
                  />
                </span>
              </li>
            ))}
          </ol>
        </AddressDetailsItem>
      )}
    </AddressDetailsWrapper>
  )
}

export default PanelAddress
