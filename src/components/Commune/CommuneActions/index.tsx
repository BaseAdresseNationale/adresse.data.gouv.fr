'use client'

import { Button } from '@codegouvfr/react-dsfr/Button'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import {
  CommuneActionsActionsWrapper,
  StyledIframeWrapper,
  StyledIframe,
  CommuneConfigItem,
} from './CommuneActions.styles'
import { BANCommune, CertificateTypeEnum } from '@/types/api-ban.types'
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
  const certificateType = district?.config?.certificate
  const CERTIFICATE_CONFIG = {
    [CertificateTypeEnum.ALL]: {
      label: 'Activé',
      tooltip: `Le certificat d’adressage est activé pour la commune de ${district.nomCommune}, les téléchargements sont disponibles via l'explorateur BAN.`,
    },
    [CertificateTypeEnum.DISTRICT]: {
      label: 'Restreint à la mairie',
      tooltip: `Les certificats sont téléchargeables depuis le site adresse.data.gouv.fr uniquement par les agents authentifiés de la mairie de la commune. `,
    },
  }

  return (
    <>
      <Section>
        {/* <CommuneActionsActionsWrapper style={{ marginBottom: '3rem' }}>
          {certificateType !== CertificateTypeEnum.DISABLED && certificateType
            ? (
                <Tooltip kind="hover" title={CERTIFICATE_CONFIG[certificateType].tooltip}>
                  <CommuneConfigItem className="ri-file-paper-2-line">Certificat d’adressage :{' '}
                    <b>{CERTIFICATE_CONFIG[certificateType].label}</b>
                  </CommuneConfigItem>
                </Tooltip>
              )
            : null}
        </CommuneActionsActionsWrapper> */}
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
