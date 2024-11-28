import Image from 'next/image'

import {
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
  return (
    <>
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
    </>
  )
}

export default PanelDistrictHeader
