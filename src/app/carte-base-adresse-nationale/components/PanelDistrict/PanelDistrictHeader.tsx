import CommuneLogo, { COMMUNE_LOGO_PANEL_PRESET } from '@/components/CommuneLogo/CommuneLogo'

import {
  DistrictHeaderWrapper,
  DistrictLabelWrapper,
  DistrictLabelPrefix,
  DistrictLabel,
  DistrictLabelCode,
  DistrictLogoWrapper,
  DistrictLogoBadge,
} from './PanelDistrictHeader.styles'
import DistrictLink from '../DistrictLink'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'

interface PanelDistrictHeaderProps {
  district: TypeDistrictExtended
  logo?: string
}

function PanelDistrictHeader({ district, logo }: PanelDistrictHeaderProps) {
  const formatedDistrict = {
    nom: district.nomCommune,
    code: district.codeCommune,
  }

  const certificatedAddressPercent = Math.round((district.nbNumerosCertifies / district.nbNumeros) * 100)

  return (
    <>
      <DistrictLink district={formatedDistrict}>
        <DistrictHeaderWrapper>
          <DistrictLogoWrapper>
            <CommuneLogo
              src={logo}
              codeCommune={district.codeCommune}
              alt="Logo de la commune"
              {...COMMUNE_LOGO_PANEL_PRESET}
            />
            {certificatedAddressPercent > 98 && <DistrictLogoBadge title={`Les adresse de cette commune sont certifiées à ${certificatedAddressPercent}%`} />}
          </DistrictLogoWrapper>
          <DistrictLabelWrapper>
            <DistrictLabelPrefix>Commune de </DistrictLabelPrefix>
            <DistrictLabel>
              {district.nomCommune}
            </DistrictLabel>
            <DistrictLabelCode>COG {district.codeCommune}</DistrictLabelCode>
          </DistrictLabelWrapper>
        </DistrictHeaderWrapper>
      </DistrictLink>
    </>
  )
}

export default PanelDistrictHeader
