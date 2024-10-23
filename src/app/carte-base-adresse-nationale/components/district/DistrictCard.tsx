import Link from 'next/link'
import Image from 'next/image'

import formatNumber from '../../tools/formatNumber'
import {
  DistrictHeaderWrapper,
  DistrictLabelWrapper,
  DistrictLabelPrefix,
  DistrictLabel,
  DistrictLabelCode,
  DistrictLogoWrapper,
  DistrictDetailsWrapper,
  DistrictDetailsItem,
} from './DistrictCard.styles'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'

interface DistrictCardProps {
  district: TypeDistrictExtended
  logo?: string
}

function DistrictCard({ district, logo }: DistrictCardProps) {
  return (
    <>
      <DistrictHeaderWrapper>
        {logo && (
          <DistrictLogoWrapper>
            <Image width={80} height={80} alt="logo commune par défault" src={logo} />
          </DistrictLogoWrapper>
        )}

        <DistrictLabelWrapper>
          <DistrictLabelPrefix>Commune de </DistrictLabelPrefix>
          <DistrictLabel>
            <Link href={`./commune/${district.codeCommune}`}>{district.nomCommune}</Link>
          </DistrictLabel>
          <DistrictLabelCode>COG {district.codeCommune}</DistrictLabelCode>
        </DistrictLabelWrapper>
      </DistrictHeaderWrapper>

      <DistrictDetailsWrapper>
        <DistrictDetailsItem className="ri-group-line">
          <b>{formatNumber(district.population)}</b>&nbsp;habitants
        </DistrictDetailsItem>
        <DistrictDetailsItem className="ri-home-4-line">
          <b>{formatNumber(district.nbNumeros)}</b>&nbsp;adresses répertoriées
        </DistrictDetailsItem>
        <DistrictDetailsItem className="ri-shield-check-line">
          {
            Number(district.nbNumerosCertifies) > 1
              ? <><b>{formatNumber(district.nbNumerosCertifies)}</b>&nbsp;adresses certifiées</>
              : <>{district.nbNumerosCertifies || 'Aucune'} adresses certifiées</>
          }{' '}
        </DistrictDetailsItem>
        <DistrictDetailsItem className="ri-signpost-line">
          {
            Number(district.codesPostaux.length) > 1
              ? <><b>{formatNumber(district.codesPostaux.length)}</b>&nbsp;codes Postaux</>
              : <>{district.codesPostaux.length || 'Aucune'} code Postal</>
          }{' '}
          ({district.codesPostaux.map(formatNumber).join(', ')})
        </DistrictDetailsItem>

        <div>
          <Link
            href={`./commune/${district.codeCommune}`}
            className="fr-link fr-link--icon-right fr-icon-arrow-right-line"
          >
            En Savoir plus
          </Link>
        </div>

      </DistrictDetailsWrapper>
    </>
  )
}

export default DistrictCard
