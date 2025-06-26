import Link from 'next/link'

import formatNumber from '../../tools/formatNumber'
import PanelDistrictMicroToponymList from './PanelDistrictMicroToponymList'
import {
  PanelDetailsWrapper,
  PanelDetailsItem,
  PanelDetailsItemValue,
  PanelDetailsOrigin,
  PanelDetailsCertifications,
} from '../Panel'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'

interface PanelDistrictProps {
  district: TypeDistrictExtended
}

const configOriginDistrict = {
  bal: {
    className: 'ri-send-plane-fill isFormal',
    message: <>Les adresses de cette commune sont issues d’une Base Adresse Locale&nbsp;(BAL)</>,
    desc: <>Les Bases Adresse Locale&nbsp;(BAL) sont les fichiers de référence communale.</>,
  },
  default: {
    className: 'ri-government-fill',
    message: <>Les adresses de cette commune ne proviennent pas d’une BAL</>,
    desc: (
      <>
        En l&apos;absence d&apos;une BAL, une liste d&apos;adresses (nommée ASSEMBLAGE) est composée par l&apos;IGN à partir des meilleures sources disponibles (IGN, DGFIP, ARCEP).<br />
        <Link href="/contribuer" className="fr-link--icon-left fr-icon-pencil-line">Contribuez à la Base Adresse Nationale&nbsp;(BAN)</Link>
      </>
    ),
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
      <PanelDetailsWrapper>
        <PanelDetailsOrigin config={configOriginDistrict} origin={district.typeComposition} />
        <PanelDetailsCertifications certificationConfig={certificationConfig} origin={district.typeComposition} certificatedPercent={certificatedAddressPercent} />

        <PanelDetailsItem className="ri-key-line">
          <span>
            Identifiant BAN&nbsp;:&nbsp;
            <PanelDetailsItemValue>{district.banId || 'Non renseigné'}</PanelDetailsItemValue>
          </span>
        </PanelDetailsItem>
        <PanelDetailsItem className="ri-group-line">
          <b>{formatNumber(district.population)}</b>&nbsp;habitants
        </PanelDetailsItem>
        <PanelDetailsItem className="ri-map-pin-line">
          <b>{formatNumber(nbAddress)}</b>&nbsp;adresses répertoriées{' '}
          {
            nbAddressCertified > 0 && (
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
        </PanelDetailsItem>
        <PanelDetailsItem className="ri-signpost-line">
          {
            Number(district.codesPostaux.length) > 1
              ? <><b>{formatNumber(district.codesPostaux.length)}</b>&nbsp;codes Postaux</>
              : <>{district.codesPostaux.length || 'Aucune'} code Postal</>
          }{' '}
          ({district.codesPostaux.map(cp => formatNumber(cp).padStart(6, '0')).join(', ')})
        </PanelDetailsItem>

        <div>
          <Link
            href={`./commune/${district.codeCommune}`}
            className="fr-link fr-link--icon-right fr-icon-arrow-right-line"
          >
            Voir la page de la commune
          </Link>
        </div>
      </PanelDetailsWrapper>

      <PanelDistrictMicroToponymList district={district} />
    </>
  )
}

export default PanelDistrict
