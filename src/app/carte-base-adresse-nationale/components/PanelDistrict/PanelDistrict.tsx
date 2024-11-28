import Link from 'next/link'

import formatNumber from '../../tools/formatNumber'
import PanelDistrictMicroToponymList from './PanelDistrictMicroToponymList'
import {
  DistrictDetailsWrapper,
  DistrictDetailsItem,
} from './PanelDistrict.styles'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'

interface PanelDistrictProps {
  district: TypeDistrictExtended
}

function PanelDistrict({ district }: PanelDistrictProps) {
  return (
    <>
      <DistrictDetailsWrapper>
        <DistrictDetailsItem className="ri-group-line">
          <b>{formatNumber(district.population)}</b>&nbsp;habitants
        </DistrictDetailsItem>
        <DistrictDetailsItem className="ri-shield-check-line">
          {
            Number(district.nbNumerosCertifies) > 1
              ? <><b>{formatNumber(district.nbNumerosCertifies)}</b>&nbsp;adresses certifiées</>
              : <>{district.nbNumerosCertifies || 'Aucune'} adresse certifiée</>
          }{'\u00A0/\u00A0'}
          <b>{formatNumber(district.nbNumeros)}</b>&nbsp;adresses répertoriées{' '}
          <b>(soit {Math.round((district.nbNumerosCertifies / district.nbNumeros) * 100)}%)</b>
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
            Voir la page de la commune
          </Link>
        </div>
      </DistrictDetailsWrapper>

      <PanelDistrictMicroToponymList district={district} />
    </>
  )
}

export default PanelDistrict
