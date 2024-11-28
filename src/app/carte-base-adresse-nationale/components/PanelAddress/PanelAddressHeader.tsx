import {
  AddressLabelWrapper,
  AddressPostCode,
  AddressNumberAndMicroTopoLabel,
  AddressMicroTopoLabelAlt,
  AddressMicroTopoLabelFlag,
  AddressDistrictLabelPrefix,
  AddressDistrictLabel,
} from './PanelAddressHeader.styles'

import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface AddressCardProps {
  address: TypeAddressExtended
}

function AddressCard({ address }: AddressCardProps) {
  const district = address.commune
  const microToponym = address.voie

  return (
    <>
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
    </>
  )
}

export default AddressCard
