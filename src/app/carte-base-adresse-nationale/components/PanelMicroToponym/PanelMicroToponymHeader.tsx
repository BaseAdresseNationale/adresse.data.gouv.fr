import DistrictLink from '../DistrictLink'

import {
  MicroToponymLabelWrapper,
} from './PanelMicroToponymHeader.styles'

import {
  PanelDistrictLabelPrefix,
  PanelDistrictLabel,
  PanelNumberAndMicroTopoLabel,
  PanelMicroTopoLabelAlt,
  PanelMicroTopoLabelAltFlag,
} from '../PanelStyles/PanelStyles'

import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'

interface PanelMicroToponymHeaderProps {
  microToponym: TypeMicroToponymExtended
}

function PanelMicroToponymHeader({ microToponym }: PanelMicroToponymHeaderProps) {
  const district = microToponym.commune

  return (
    <>
      <MicroToponymLabelWrapper>
        <PanelNumberAndMicroTopoLabel>{microToponym.nomVoie}</PanelNumberAndMicroTopoLabel>
        {microToponym?.nomVoieAlt && Object.entries(microToponym.nomVoieAlt).map(([lang, odonyme]) => (
          <PanelMicroTopoLabelAlt key={lang}>
            <PanelMicroTopoLabelAltFlag src={`./img/flags/${lang}.svg`} alt={`Drapeau ${lang}`} />{' '}
            {odonyme}
          </PanelMicroTopoLabelAlt>
        ))}
        <DistrictLink district={district}>
          <PanelDistrictLabelPrefix>Commune de </PanelDistrictLabelPrefix>
          <PanelDistrictLabel>{district.nom} (COG  {district.code})</PanelDistrictLabel>
        </DistrictLink>
      </MicroToponymLabelWrapper>
    </>
  )
}

export default PanelMicroToponymHeader
