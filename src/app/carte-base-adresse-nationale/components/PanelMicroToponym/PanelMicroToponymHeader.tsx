import Link from 'next/link'

import {
  MicroToponymLabelWrapper,
  MicroToponymDistrictLabelPrefix,
  MicroToponymDistrictLabel,
  MicroToponymLabel,
  MicroToponymLabelAlt,
  MicroToponymLabelFlag,
} from './PanelMicroToponymHeader.styles'

import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'

interface PanelMicroToponymHeaderProps {
  microToponym: TypeMicroToponymExtended
}

function PanelMicroToponymHeader({ microToponym }: PanelMicroToponymHeaderProps) {
  const district = microToponym.commune

  return (
    <>
      <MicroToponymLabelWrapper>
        <MicroToponymLabel>{microToponym.nomVoie}</MicroToponymLabel>
        {microToponym?.nomVoieAlt && Object.entries(microToponym.nomVoieAlt).map(([lang, odonyme]) => (
          <MicroToponymLabelAlt key={lang}>
            <MicroToponymLabelFlag src={`./img/flags/${lang}.svg`} alt={`Drapeau ${lang}`} />{' '}
            {odonyme}
          </MicroToponymLabelAlt>
        ))}
        <MicroToponymDistrictLabelPrefix>Commune de </MicroToponymDistrictLabelPrefix>
        <MicroToponymDistrictLabel $districtCode={district.code}>
          {district.nom} (COG  {district.code})
        </MicroToponymDistrictLabel>
      </MicroToponymLabelWrapper>
    </>
  )
}

export default PanelMicroToponymHeader
