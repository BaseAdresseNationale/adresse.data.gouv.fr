'use client'

import { Fragment, useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import {
  CommuneActionsActionsWrapper,
  CertificatAdressageOptInActionsWrapper,
  StyledIframeWrapper,
  StyledIframe,
} from './CommuneActions.styles'
import { BANCommune } from '@/types/api-ban.types'
import Section from '@/components/Section'

interface CommuneActionsProps {
  district: BANCommune
  actionProps: any[]
}

function CommuneActions({ district, actionProps }: CommuneActionsProps) {
  const [isConfigDistrictVisible, setIsConfigDistrictVisible] = useState(false)
  const iframeSRC = 'https://grist.numerique.gouv.fr/o/ban/forms/4eCgRqqpyXW5FMoZzQ3nNm/4'

  return (
    <>
      <link href={iframeSRC} rel="prefetch" />
      <Section>
        <CommuneActionsActionsWrapper>
          {actionProps && actionProps.length && actionProps.map(props => (
            <Button
              key={props.value}
              iconId={props.iconId}
              linkProps={{
                href: props.linkProps.href,
                target: props.linkProps.target,
              }}
              priority={props.priority}
            >
              {props.value}
            </Button>
          ))}
          <Button
            key="set-config"
            iconId="ri-settings-line"
            onClick={() => setIsConfigDistrictVisible(!isConfigDistrictVisible)}
          >
            Configurer les options de la commune
          </Button>
        </CommuneActionsActionsWrapper>
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

export default CommuneActions
