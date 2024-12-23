import DistrictLink from '../DistrictLink'
import formatNumber from '../../tools/formatNumber'

import {
  PanelDistrictLabelPrefix,
  PanelDistrictLabel,
  PanelNumberAndMicroTopoLabel,
  PanelAddressPostCode,
  PanelMicroTopoLabelAlt,
  PanelMicroTopoLabelAltFlag,
} from '../PanelStyles'

import {
  AddressLabelWrapper,
  AddressNumber,
  AddressNumberSuffix,
  AddressMicroTopoLabel,
  AddressParentsWrapper,
  AddressParents,
  AddressCertification,
  BadgeWrapper,
  Badge,
} from './PanelAddressHeader.styles'

import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface AddressCardProps {
  address: TypeAddressExtended
}

function AddressCard({ address }: AddressCardProps) {
  const district = address.commune
  const microToponym = address.voie

  return (
    <AddressLabelWrapper $isCertified={address.certifie}>
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
        {microToponym?.nomVoieAlt && Object.entries(microToponym.nomVoieAlt).map(([lang, odonyme]) => (
          <PanelMicroTopoLabelAlt key={lang}>
            <PanelMicroTopoLabelAltFlag src={`./img/flags/${lang}.svg`} alt={`Drapeau ${lang}`} />{' '}
            {odonyme}
          </PanelMicroTopoLabelAlt>
        ))}
        {address?.lieuDitComplementNom && (<PanelMicroTopoLabelAlt>{address?.lieuDitComplementNom},</PanelMicroTopoLabelAlt>)}
      </PanelNumberAndMicroTopoLabel>

      <AddressParentsWrapper>
        <AddressParents>
          <PanelAddressPostCode>CP {formatNumber(address.codePostal).padStart(6, '0')}</PanelAddressPostCode>

          <DistrictLink district={district}>
            {address.nomAncienneCommune && address.nomAncienneCommune !== district.nom && address.codeAncienneCommune
              ? (
                  <>
                    <PanelDistrictLabelPrefix>Commune historique de </PanelDistrictLabelPrefix>
                    <PanelDistrictLabel $cog={address.codeAncienneCommune} $separator=", " $historique>{address.nomAncienneCommune}</PanelDistrictLabel>
                  </>
                )
              : (
                  <PanelDistrictLabelPrefix>Commune de </PanelDistrictLabelPrefix>
                )}
            <PanelDistrictLabel $cog={district.code}>{district.nom}</PanelDistrictLabel>
          </DistrictLink>
        </AddressParents>
        {
          address.certifie && (
            <AddressCertification>
              <BadgeWrapper>
                <Badge className="badge green">
                  <div className="circle"><i className="ri-checkbox-circle-fill"></i></div>
                  <div className="ribbon"><span>Certifiée</span></div>
                </Badge>
              </BadgeWrapper>
            </AddressCertification>
          )
        }

      </AddressParentsWrapper>

    </AddressLabelWrapper>
  )
}

export default AddressCard
