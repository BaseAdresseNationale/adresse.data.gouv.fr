import DistrictLink from '../DistrictLink'
import formatNumber from '../../tools/formatNumber'

import {
  PanelDistrictLabelPrefix,
  PanelDistrictLabel,
  PanelNumberAndMicroTopoLabel,
  PanelAddressPostCode,
  PanelMicroTopoLabelAlt,
  PanelMicroTopoLabelAltFlag,
} from '../PanelStyles/PanelStyles'

import {
  AddressLabelWrapper,
  AddressNumber,
  AddressNumberSuffix,
  AddressMicroTopoLabel,
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
        <PanelNumberAndMicroTopoLabel>
          {(address.numero || address.suffixe) && (
            <>
              <AddressNumber>
                {address.numero ? `${address.numero}` : ''}
                {address.suffixe && <AddressNumberSuffix>{address.suffixe}</AddressNumberSuffix>}
              </AddressNumber>
              {' '}
            </>
          )}
          <AddressMicroTopoLabel $isOnNewLine={Boolean(address.suffixe)}>
            {microToponym.nomVoie},
          </AddressMicroTopoLabel>
        </PanelNumberAndMicroTopoLabel>

        {microToponym?.nomVoieAlt && Object.entries(microToponym.nomVoieAlt).map(([lang, odonyme]) => (
          <PanelMicroTopoLabelAlt key={lang}>
            <PanelMicroTopoLabelAltFlag src={`./img/flags/${lang}.svg`} alt={`Drapeau ${lang}`} />{' '}
            {odonyme}
          </PanelMicroTopoLabelAlt>
        ))}

        <PanelAddressPostCode>CP {formatNumber(address.codePostal)}</PanelAddressPostCode>

        {address.nomAncienneCommune && (
          <>
            <PanelDistrictLabelPrefix>Commune historique de </PanelDistrictLabelPrefix>
            <PanelDistrictLabel $historique>{address.nomAncienneCommune},</PanelDistrictLabel>
          </>
        )}
        <DistrictLink district={district}>
          <PanelDistrictLabel>{district.nom} (COG  {district.code})</PanelDistrictLabel>
        </DistrictLink>

      </AddressLabelWrapper>
    </>
  )
}

export default AddressCard
