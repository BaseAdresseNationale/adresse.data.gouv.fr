import Link from 'next/link'

import formatNumber from '../../tools/formatNumber'
import PanelDistrictMicroToponymList from './PanelDistrictMicroToponymList'
import { DistrictDetailsCertification } from './PanelDistrict.styles'
import {
  PanelDetailsWrapper as DistrictDetailsWrapper,
  PanelDetailsItem as DistrictDetailsItem,
  PanelDetailsOrigin as DistrictDetailsOrigin,
} from '../PanelStyles/PanelStyles'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'

interface PanelDistrictProps {
  district: TypeDistrictExtended
}

const configOriginDistrict = {
  bal: {
    className: 'ri-star-fill isFormal',
    message: <>Les adresses de cette commune sont issues d’une Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL)</>,
    desc: <>Les Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL) sont directement produites par les communes.</>,
  },
  default: {
    className: 'ri-government-fill',
    message: <>Les adresses de cette commune sont issues d’une Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL)</>,
    desc: <>Les Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL) sont directement produites par les communes.</>,
  },
}

const certificationConfig = {
  0: {
    message: 'Aucune adresse certifiée par la commune',
    desc: 'Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.',
    className: 'fr-icon-error-fill isFailed',
  },
  1: {
    message: `Adresses en cours de certification ({{CERTIFICATED_PERCENT}}%)`,
    desc: 'Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.',
    className: 'ri-award-line',
  },
  2: {
    message: `Adresses certifiées à {{CERTIFICATED_PERCENT}}%`,
    desc: 'Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.',
    className: 'ri-award-fill isSuccessful',
  },
}

function PanelDistrict({ district }: PanelDistrictProps) {
  const nbAddress = Number(district.nbNumeros || 0)
  const nbAddressCertified = Number(district.nbNumerosCertifies || 0)
  const certificatedAddressPercent = nbAddress ? Math.round((nbAddressCertified / nbAddress) * 100) : 0

  return (
    <>
      <DistrictDetailsWrapper>
        <DistrictDetailsOrigin config={configOriginDistrict} origin={district.typeComposition} />
        <DistrictDetailsCertification certificationConfig={certificationConfig} origin={district.typeComposition} certificatedAddressPercent={certificatedAddressPercent} />

        <DistrictDetailsItem className="ri-group-line">
          <b>{formatNumber(district.population)}</b>&nbsp;habitants
        </DistrictDetailsItem>
        <DistrictDetailsItem className="ri-map-pin-line">
          <b>{formatNumber(nbAddress)}</b>&nbsp;adresses répertoriées{' '}
          {
            nbAddressCertified && (
              nbAddressCertified === nbAddress
                ? <>et certifiées</>
                : (
                    <>
                      <br />
                      (dont{' '}
                      <b>{formatNumber(nbAddressCertified)}</b>{' '}
                      {
                        (nbAddressCertified > 1)
                          ? 'adresses certifiées'
                          : 'adresse certifiée'
                      }
                      )
                    </>
                  )
            )
          }
        </DistrictDetailsItem>
        <DistrictDetailsItem className="ri-signpost-line">
          {
            Number(district.codesPostaux.length) > 1
              ? <><b>{formatNumber(district.codesPostaux.length)}</b>&nbsp;codes Postaux</>
              : <>{district.codesPostaux.length || 'Aucune'} code Postal</>
          }{' '}
          ({district.codesPostaux.map(cp => formatNumber(cp).padStart(6, '0')).join(', ')})
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
