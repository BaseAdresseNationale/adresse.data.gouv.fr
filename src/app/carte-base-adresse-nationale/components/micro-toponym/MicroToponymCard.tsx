import Link from 'next/link'

import {
  MicroToponymHeaderWrapper,
  MicroToponymLabelWrapper,
  MicroToponymDistrictLabelPrefix,
  MicroToponymDistrictLabel,
  MicroToponymLabel,
  MicroToponymLabelAlt,
  MicroToponymLabelFlag,
} from './MicroToponymCard.styles'

import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'

interface MicroToponymCardProps {
  microToponym: TypeMicroToponymExtended
}

function MicroToponymCard({ microToponym }: MicroToponymCardProps) {
  const district = microToponym.commune

  return (
    <>
      <MicroToponymHeaderWrapper>
        <MicroToponymLabelWrapper>
          <MicroToponymLabel>{microToponym.nomVoie}</MicroToponymLabel>
          {microToponym?.nomVoieAlt && Object.entries(microToponym.nomVoieAlt).map(([lang, odonyme]) => (
            <MicroToponymLabelAlt key={lang}>
              <MicroToponymLabelFlag src={`./img/flags/${lang}.svg`} alt={`Drapeau ${lang}`} />{' '}
              {odonyme}
            </MicroToponymLabelAlt>
          ))}
          <MicroToponymDistrictLabelPrefix>Commune de </MicroToponymDistrictLabelPrefix>
          <MicroToponymDistrictLabel><Link href={`./commune/${district.code}`}>{district.nom} (COG  {district.code})</Link></MicroToponymDistrictLabel>
        </MicroToponymLabelWrapper>
      </MicroToponymHeaderWrapper>
    </>
  )
}

export default MicroToponymCard
