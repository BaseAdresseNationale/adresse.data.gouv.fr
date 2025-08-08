'use client'

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
  return (
    <>
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
            : null}
        </CommuneActionsActionsWrapper>
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
