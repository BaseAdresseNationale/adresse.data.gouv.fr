'use client'

import { Fragment, useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import {
  ResumeDistrictWrapper,
  ResumeDistrictActionsWrapper,
  CertificatAdressageOptInActionsWrapper,
  StyledIframeWrapper,
  StyledIframe,
} from './ResumeDistrict.styles'
import { BANCommune } from '@/types/api-ban.types'
import Section from '@/components/Section'

const formatNumber = (value: string | number) => new Intl.NumberFormat('fr-FR').format(Number(value))

interface ResumeDistrictProps {
  district: BANCommune
  actionProps: any[]
}

function ResumeDistrict({ district, actionProps }: ResumeDistrictProps) {
  const [isConfigDistrictVisible, setIsConfigDistrictVisible] = useState(false)
  const iframeSRC = 'https://grist.numerique.gouv.fr/o/ban/forms/4eCgRqqpyXW5FMoZzQ3nNm/4'

  const { banId, codeCommune } = district

  return (
    <>
      <link href={iframeSRC} rel="prefetch" />
      <Section>
        <ResumeDistrictWrapper>
          <div className="resume-card">
            <i className="ri-key-line" />
            Code INSEE
            <div>
              <b>{codeCommune}</b>
            </div>
          </div>

          <div className="resume-card">
            <i className="ri-signpost-line" />

            {
              Number(district.codesPostaux.length) > 1
                ? <><b>{formatNumber(district.codesPostaux.length)}</b>&nbsp;codes Postaux</>
                : <>{district.codesPostaux.length || 'Aucune'} code Postal</>
            }{' '}
            <div>
              <b>{district.codesPostaux.map(formatNumber).join(', ')}</b>
            </div>
          </div>

          {banId && (
            <div className="resume-card">
              <i className="ri-key-line" />
              Code BAN :

              <div><b>{banId}</b></div>
            </div>
          )}
        </ResumeDistrictWrapper>

        <ResumeDistrictActionsWrapper>
          {actionProps && actionProps.length && actionProps.map(props => (
            <Fragment key={props.iconId}>
              <Button
                iconId={props.iconId}
                linkProps={{
                  href: props.linkProps.href,
                  target: props.linkProps.target,
                }}
                priority={props.priority}
              >
                {props.value}
              </Button>
              {' '}
            </Fragment>
          ))}
          <CertificatAdressageOptInActionsWrapper>
            <Button
              key="set-config"
              iconId="ri-settings-line"
              onClick={() => setIsConfigDistrictVisible(!isConfigDistrictVisible)}
            >
              Configurer les options de la commune
            </Button>
          </CertificatAdressageOptInActionsWrapper>
        </ResumeDistrictActionsWrapper>
      </Section>
      <Section title={`Configuration des options pour la commune de ${district.nomCommune}`} theme="grey" isVisible={isConfigDistrictVisible}>
        <p>
          <i>
            Cette fonctionnalité est en développement.
            Vous pouvez vous inscrire en liste d’attente pour l’activation
            du certificat d’adressage pour votre commune.
          </i>
        </p>
        <StyledIframeWrapper>
          <StyledIframe src={iframeSRC} width="100%" height="800" frameBorder="0" />
        </StyledIframeWrapper>
      </Section>
    </>
  )
}

export default ResumeDistrict
