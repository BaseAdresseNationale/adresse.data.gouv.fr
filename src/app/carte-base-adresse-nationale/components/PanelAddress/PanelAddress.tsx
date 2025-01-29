import { AddressDetailsCertification } from './PanelAddress.styles'
import AddressDetailPosition from '../AddressDetailPosition'

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

const isSmartDevice = () => /Mobi|Android/i.test(navigator.userAgent)

const isValidDate: { (dateStr: string): boolean } = dateStr => !isNaN(Number(new Date(dateStr)))

const configOriginAddress = {
  bal: {
    className: 'ri-star-fill isFormal',
    message: <>Cette adresse est issue d’une Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL)</>,
    desc: <>Les Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL) sont directement produites par les communes.</>,
  },
  default: {
    className: 'ri-government-fill',
    message: <>Cette adresse est fournie par l’IGN</>,
    desc: (
      <>
        En l’absence de Base Adresse Locale&nbsp;(BAL) officielle sur la commune,
        l’IGN fournie des adresses produites à partir de multiples sources.
      </>
    ),
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
  const dateMaj = isValidDate(address.dateMAJ)
    ? new Date(address.dateMAJ).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Non renseignée'

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
        {address.sourcePosition === 'bal' ? 'BAL' : 'IGN'}
      </AddressDetailsItem>
      <AddressDetailsItem className="ri-signpost-line">
        Libellé d’acheminement : <br />
        {address.libelleAcheminement}
      </AddressDetailsItem>
      <AddressDetailsItem className="ri-map-pin-line">
        {isMultiPosition ? 'Position Principale' : 'Position'} : <br />
        <AddressDetailPosition
          type={mainPosition.positionType}
          coords={mainPosition.position.coordinates as [number, number]}
          marker={isMultiPosition ? '⦿' : undefined}
          isSmartDevice={isSmartDevice()}
        />
      </AddressDetailsItem>
      {isMultiPosition && (
        <AddressDetailsItem className="ri-map-pin-2-line">
          Position Secondaire : <br />
          <ol>
            {secondariesPositions.map((entry, index) => (
              <li key={index}>
                <AddressDetailPosition
                  type={`${entry.positionType}`}
                  coords={entry.position.coordinates as [number, number]}
                  isSmartDevice={isSmartDevice()}
                />
              </li>
            ))}
          </ol>
        </AddressDetailsItem>
      )}
    </AddressDetailsWrapper>
  )
}

export default PanelAddress
