'use client'

import { useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import {
  CommuneActionsActionsWrapper,
  StyledIframeWrapper,
  StyledIframe,
  CommuneConfigItem,
} from './CommuneActions.styles'
import { BANCommune } from '@/types/api-ban.types'
import Section from '@/components/Section'

interface CommuneActionProps {
  iconId: any
  linkProps: {
    href: string
    target?: string
  }
  priority: any
  value: string
}

interface CommuneActionsProps {
  district: BANCommune
  actionProps: CommuneActionProps[]
}

function CommuneActions({ district, actionProps }: CommuneActionsProps) {
  const [isConfigDistrictVisible, setIsConfigDistrictVisible] = useState(false)
  const iframeSRC = 'https://grist.numerique.gouv.fr/o/ban/forms/4eCgRqqpyXW5FMoZzQ3nNm/4'

  return (
    <>
      <link href={iframeSRC} rel="prefetch" />
      <Section>
        <CommuneActionsActionsWrapper style={{ marginBottom: '3rem' }}>
          {district.config?.certificate
            ? (
                <Tooltip kind="hover" title={`Le certificat d’adressage est activé pour la commune de ${district.nomCommune}, les téléchargements sont disponibles via l'explorateur BAN.`}>
                  <CommuneConfigItem className="ri-file-paper-2-line">Certificat d’adressage :{' '}
                    <b>Activé</b>
                  </CommuneConfigItem>
                </Tooltip>
              )
            : (
                <Button
                  key="set-config"
                  iconId="ri-file-paper-2-line"
                  onClick={() => setIsConfigDistrictVisible(!isConfigDistrictVisible)}
                >
                  Demander l’activation du certificat d’adressage
                </Button>
              )}
        </CommuneActionsActionsWrapper>
        <Section title={`Demande d'activation du certificat d'adressage pour la commune de ${district.nomCommune}`} theme="grey" isVisible={isConfigDistrictVisible}>
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
        </CommuneActionsActionsWrapper>
      </Section>
    </>
  )
}

export default CommuneActions
