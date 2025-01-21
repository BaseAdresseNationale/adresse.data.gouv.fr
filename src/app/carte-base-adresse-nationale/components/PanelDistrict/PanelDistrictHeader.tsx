import Image from 'next/image'

import {
  DistrictHeaderWrapper,
  DistrictLabelWrapper,
  DistrictLabelPrefix,
  DistrictLabel,
  DistrictLabelCode,
  DistrictLogoWrapper,
} from './PanelDistrictHeader.styles'
import DistrictLink from '../DistrictLink'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'
import { CommuneAchievements } from '@/components/Commune/CommuneAchievements'
import { CommuneAchievements as CommuneAchievementsType } from '@/lib/commune'

interface PanelDistrictHeaderProps {
  district: TypeDistrictExtended
  logo?: string
  achievements?: CommuneAchievementsType
}

function PanelDistrictHeader({ district, logo, achievements }: PanelDistrictHeaderProps) {
  const formatedDistrict = {
    nom: district.nomCommune,
    code: district.codeCommune,
  }

  return (
    <>
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
      {achievements && <CommuneAchievements isMini achievements={achievements} />}
    </>
  )
}

export default PanelDistrictHeader
