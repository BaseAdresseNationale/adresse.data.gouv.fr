import {
  AddressDetailsItemValue,

  AddressHeaderWrapper,

  AddressLabelWrapper,
  AddressPostCode,

  AddressNumberAndMicroTopoLabel,
  AddressMicroTopoLabelAlt,
  AddressMicroTopoLabelFlag,

  AddressDistrictLabelPrefix,
  AddressDistrictLabel,
  AddressDetailsWrapper,
  AddressDetailsItem,
} from './AddressCard.styles'
import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface AddressCardProps {
  address: TypeAddressExtended
}

interface Position {
  position: TypeAddressExtended['position']
  positionType: TypeAddressExtended['positionType']
}

function AddressCard({ address }: AddressCardProps) {
  const district = address.commune
  const microToponym = address.voie
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
    <>
      <AddressHeaderWrapper>
        <AddressLabelWrapper>
          <AddressNumberAndMicroTopoLabel>
            {address.numero ? `${address.numero} ` : ''}
            {address.suffixe ? `${address.suffixe} ` : ''}<br />
            {microToponym.nomVoie},
          </AddressNumberAndMicroTopoLabel>
          {microToponym?.nomVoieAlt && Object.entries(microToponym.nomVoieAlt).map(([lang, odonyme]) => (
            <AddressMicroTopoLabelAlt key={lang}>
              <AddressMicroTopoLabelFlag src={`./img/flags/${lang}.svg`} alt={`Drapeau ${lang}`} />{' '}
              {odonyme}
            </AddressMicroTopoLabelAlt>
          ))}
          {address.nomAncienneCommune && (
            <>
              <AddressDistrictLabelPrefix>Commune historique de </AddressDistrictLabelPrefix>
              <AddressDistrictLabel $historique>{address.nomAncienneCommune},</AddressDistrictLabel>
            </>
          )}
          <AddressPostCode>CP {address.codePostal},</AddressPostCode>
          <AddressDistrictLabel>{district.nom} (COG  {district.code})</AddressDistrictLabel>
        </AddressLabelWrapper>
      </AddressHeaderWrapper>

      <AddressDetailsWrapper>
        <AddressDetailsItem className="ri-key-line">
          <span>
            Identifiant BAN : <br />
            <AddressDetailsItemValue>{address.banId}</AddressDetailsItemValue>
          </span>
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-links-line">
          <span>
            Clé d’interopérabilité :  <br />
            <AddressDetailsItemValue>{address.cleInterop}</AddressDetailsItemValue>
          </span>
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-collage-line">
          <span>
            Parcelles cadastrales :  <br />
            <AddressDetailsItemValue>{address?.parcelles.join(', ') || 'Non renseignée(s)'}</AddressDetailsItemValue>
          </span>
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-calendar-line">
          Date de mise à jour :  <br />
          {dateMaj}
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-edit-box-line">
          Producteur :  <br />
          {address.sourcePosition}
        </AddressDetailsItem>

        <AddressDetailsItem className="ri-signpost-line">
          Libellé d’acheminement :  <br />
          {address.libelleAcheminement}
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-map-pin-line">
          {isMultiPosition ? 'Position Principale' : 'Position'} :  <br />
          <span>Type / {mainPosition.positionType}</span> <br />
          <span>Coordonnées / {mainPosition.position.coordinates[0]}, {mainPosition.position.coordinates[1]}</span>
        </AddressDetailsItem>
        {isMultiPosition && (
          <AddressDetailsItem className="ri-map-pin-2-line">
            Position Secondaire :  <br />
            <ol>
              {secondariesPositions.map((entry, index) => (
                <li key={index}>
                  <span>Type / {entry.positionType}</span> <br />
                  <span>Coordonnées / {entry.position.coordinates[0]}, {entry.position.coordinates[1]}</span>
                </li>
              ))}
            </ol>
          </AddressDetailsItem>
        )}
      </AddressDetailsWrapper>
    </>
  )
}

export default AddressCard
