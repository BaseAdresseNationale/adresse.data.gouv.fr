import AddressDetailPosition from '../AddressDetailPosition'

import {
  PanelDetailsWrapper,
  PanelDetailsItem,
  PanelDetailsItemValue,
  PanelDetailsOrigin,
  PanelDetailsCertification,
} from '../Panel'

import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface PanelAddressProps {
  address: TypeAddressExtended
  onFlyToPosition?: () => void
}

interface Position {
  position: TypeAddressExtended['position']
  positionType: TypeAddressExtended['positionType']
}

const isSmartDevice = () => /Mobi|Android/i.test(navigator.userAgent)

const isValidDate: { (dateStr: string): boolean } = dateStr => !isNaN(Number(new Date(dateStr)))

const rankPosition = (mainPosition: Position, positions: Position[]) => {
  const isMultiPosition = Number(positions.length) > 1
  const defaultRankedPositions = { mainPosition, secondariesPositions: [] as Position[] }
  return isMultiPosition
    ? positions.reduce<{ mainPosition: Position, secondariesPositions: Position[] }>((acc, entry, index) => {
      if (entry.position.coordinates.join('--') === mainPosition.position.coordinates.join('--')) {
        acc.mainPosition = entry
      }
      else {
        acc.secondariesPositions.push(entry)
      }
      return acc
    }, defaultRankedPositions)
    : defaultRankedPositions
}

const configOriginAddress = {
  bal: {
    className: 'ri-send-plane-fill isFormal',
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

function PanelAddress({ address, onFlyToPosition }: PanelAddressProps) {
  const dateMaj = isValidDate(address.dateMAJ)
    ? new Date(address.dateMAJ).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Non renseignée'

  const { mainPosition, secondariesPositions } = rankPosition(
    {
      position: address.position,
      positionType: address.positionType,
    },
    address.positions
  )
  const isMultiPosition = secondariesPositions.length > 0

  return (
    <PanelDetailsWrapper>
      <PanelDetailsOrigin config={configOriginAddress} origin={address.sourcePosition} />
      <PanelDetailsCertification certificationConfig={certificationLevelConfig} isCertified={address.certifie} />

      <PanelDetailsItem className="ri-key-line">
        <span>
          Identifiant BAN : <br />
          <PanelDetailsItemValue>{address.banId || 'Non renseigné'}</PanelDetailsItemValue>
        </span>
      </PanelDetailsItem>
      <PanelDetailsItem className="ri-links-line">
        <span>
          Clé d’interopérabilité : <br />
          <PanelDetailsItemValue>{address.cleInterop}</PanelDetailsItemValue>
        </span>
      </PanelDetailsItem>
      <PanelDetailsItem className="ri-collage-line">
        <span>
          Parcelles cadastrales : <br />
          <PanelDetailsItemValue>{address?.parcelles.join(', ') || 'Non renseignée(s)'}</PanelDetailsItemValue>
        </span>
      </PanelDetailsItem>
      <PanelDetailsItem className="ri-calendar-line">
        Date de mise à jour : <br />
        {dateMaj}
      </PanelDetailsItem>
      <PanelDetailsItem className="ri-signpost-line">
        Libellé d’acheminement : <br />
        {address.libelleAcheminement}
      </PanelDetailsItem>
      <PanelDetailsItem className="ri-map-pin-line">
        {isMultiPosition ? 'Position Principale' : 'Position'} : <br />
        <AddressDetailPosition
          type={mainPosition.positionType}
          coords={mainPosition.position.coordinates as [number, number]}
          marker={isMultiPosition ? '⦿' : undefined}
          onFlyToPosition={onFlyToPosition}
          isSmartDevice={isSmartDevice()}
        />
      </PanelDetailsItem>
      {isMultiPosition && (
        <PanelDetailsItem className="ri-map-pin-2-line">
          Position Secondaire : <br />
          <ol>
            {secondariesPositions.map((entry, index) => (
              <li key={index}>
                <AddressDetailPosition
                  type={`${entry.positionType}`}
                  coords={entry.position.coordinates as [number, number]}
                  onFlyToPosition={onFlyToPosition}
                  isSmartDevice={isSmartDevice()}
                />
              </li>
            ))}
          </ol>
        </PanelDetailsItem>
      )}
    </PanelDetailsWrapper>
  )
}

export default PanelAddress
