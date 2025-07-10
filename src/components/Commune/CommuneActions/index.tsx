'use client'

import { useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
// import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import {
  CommuneActionsActionsWrapper,
  // StyledIframeWrapper,
  // StyledIframe,
  // CommuneConfigItem,
} from './CommuneActions.styles'
import { BANCommune } from '@/types/api-ban.types'
import Section from '@/components/Section'

import DistrictConfigForm from './DistrictConfigForm'
import ConnectionBox from './ConnectionBox'

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

  const [isConnected, setIsConneceted] = useState(false)
  const [permissionsDistricts, setPermissionsDistricts] = useState<BANCommune['codeCommune'][]>([])
  const [config, setConfig] = useState<BANCommune['config']>({ ...district.config })

  const connectUser = (connectionStatus: boolean) => {
    console.log('district', district)
    if (connectionStatus) {
      setPermissionsDistricts(['64102']) // Set authorization for testing purposes on District 'Bayonne'
      setIsConneceted(connectionStatus)
    }
    else {
      setIsConneceted(connectionStatus)
      setPermissionsDistricts([])
    }
  }

  const setConfiguration = (newConfig: BANCommune['config']) => {
    console.log('Config updated:', newConfig)
    setConfig({ ...config, ...newConfig })
    setPermissionsDistricts(['64102']) // Set authorization for testing purposes on Distric 'Bayonne'
  }

  return (
    <>
      <link href={iframeSRC} rel="prefetch" />
      <Section>
        {/* <CommuneActionsActionsWrapper style={{ marginBottom: '3rem' }}>
          {district.config?.certificate
            ? (
                <Tooltip kind="hover" title={`Le certificat d’adressage est activé pour la commune de ${district.nomCommune}, les téléchargements sont disponibles via l'explorateur BAN.`}>
                  <CommuneConfigItem className="ri-file-paper-2-line">Certificat d’adressage :{' '}
                    <b>Activé</b>
                  </CommuneConfigItem>
                </Tooltip>
              )
            : null}

          <Button
            key="set-config"
            iconId="ri-file-paper-2-line"
            onClick={() => setIsConfigDistrictVisible(!isConfigDistrictVisible)}
          >
            Demander l’activation du certificat d’adressage
          </Button>
        </CommuneActionsActionsWrapper> */}

        {/* <Section title={`Demande d'activation du certificat d'adressage pour la commune de ${district.nomCommune}`} theme="grey" isVisible={isConfigDistrictVisible}>
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
        </Section> */}

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
            iconId="fr-icon-settings-5-line"
            onClick={() => setIsConfigDistrictVisible(!isConfigDistrictVisible)}
          >
            Options et Configuration
          </Button>
        </CommuneActionsActionsWrapper>
      </Section>

      <Section
        title={`Options et configuration de la commune de ${district.nomCommune}`}
        theme="grey"
        isVisible={isConfigDistrictVisible}
      >
        <DistrictConfigForm config={config} onUpdateConfig={config => setConfiguration(config)} readOnly={!isConnected || !permissionsDistricts.includes(district.codeCommune)} />

        <hr />

        {!isConnected
          ? (
              <ConnectionBox
                teaser="Si vous disposez des habilitations nécéssaires, vous pouvez vous connecter pour modifier la configuration et les options de la commune."
                onConnect={(connectionStatus: boolean) => connectUser(connectionStatus)}
              />
            )
          : (
              <>
                {!permissionsDistricts.includes(district.codeCommune)
                && (
                  <div>
                    <p>
                      <em>Vous n’etes pas autorisés à modifier la configuration de cette commune.</em> (JSON.config: {JSON.stringify(permissionsDistricts)})
                    </p>
                  </div>
                )}

                <CommuneActionsActionsWrapper>
                  <Button
                    iconId="ri-logout-circle-r-line"
                    iconPosition="right"
                    onClick={() => connectUser(false)}
                  >
                    Déconnexion
                  </Button>
                </CommuneActionsActionsWrapper>
              </>
            )}

        {/* <p>
          <i>
            Cette fonctionnalité est en développement.
            Vous pouvez vous inscrire en liste d’attente pour l’activation
            du certificat d’adressage pour votre commune.
          </i>
        </p> */}
        {/* <StyledIframeWrapper>
          <StyledIframe src={iframeSRC} width="100%" height="800" frameBorder="0" />
        </StyledIframeWrapper> */}
      </Section>
    </>
  )
}

export default CommuneActions
