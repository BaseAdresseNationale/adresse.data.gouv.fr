import Link from 'next/link'

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

function AddressCard({ address }: AddressCardProps) {
  const district = address.commune
  const microToponym = address.voie
  const dateMaj = new Date(address.dateMAJ).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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
        <AddressDetailsItem className="ri-key-fill">
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
        <AddressDetailsItem className="ri-map-pin-range-line">
          Position :  <br />
          {address.positionType}
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-focus-3-line">
          Coordonnées :  <br />
          {address.position.coordinates[0]}, {address.position.coordinates[1]}
        </AddressDetailsItem>
      </AddressDetailsWrapper>
    </>
  )
}

export default AddressCard
