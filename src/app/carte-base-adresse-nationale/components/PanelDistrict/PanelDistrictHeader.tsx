import Image from 'next/image'

import DistrictLink from '../DistrictLink'

import {
  DistrictHeaderWrapper,
  DistrictLabelWrapper,
  DistrictLabelPrefix,
  DistrictLabel,
  DistrictLabelCode,
  DistrictLogoWrapper,
} from './PanelDistrictHeader.styles'

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

  return (
    <DistrictLink district={formatedDistrict}>
      <DistrictHeaderWrapper>
        {logo && (
          <DistrictLogoWrapper>
            <Image width={80} height={80} alt="logo commune par défault" src={logo} />
          </DistrictLogoWrapper>
        )}
        <DistrictLabelWrapper>
          <DistrictLabelPrefix>Commune de </DistrictLabelPrefix>
          <DistrictLabel>
            {district.nomCommune}
          </DistrictLabel>
          <DistrictLabelCode>COG {district.codeCommune}</DistrictLabelCode>
        </DistrictLabelWrapper>
      </DistrictHeaderWrapper>
    </DistrictLink>
  )
}

export default PanelDistrictHeader
