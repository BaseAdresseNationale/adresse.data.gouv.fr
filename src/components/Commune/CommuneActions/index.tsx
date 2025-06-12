'use client'

import { useState, useEffect } from 'react'
import { customFetch } from '@/lib/fetch'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import { ProConnectButton } from '@codegouvfr/react-dsfr/ProConnectButton'
// import ProConnectButtonCustom from '../../ProConnectButtonCustom/ProConnectButtonCustom'
import LogoutProConnectButtonCustom from '@/components/LogoutProConnectButtonCustom/LogoutProConnectButtonCustom'
import { getCommune } from '@/lib/api-geo'

import {
  CommuneActionsSectionWrapper,
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

interface technicalRequirements {
  hasID: boolean
  hasAbove75PercentCertifiedNumbers: boolean
  hasAbove50PercentParcelles: boolean
}
interface CommuneActionsProps {
  technicalRequirements: technicalRequirements
  district: BANCommune
  actionProps: CommuneActionProps[]
}

// Helper component for Tooltip with CommuneConfigItem
const TooltipWithCommuneConfigItem = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Tooltip kind="hover" title={title}>
    <CommuneConfigItem className="ri-file-paper-2-line">{children}</CommuneConfigItem>
  </Tooltip>
)

function CommuneActions({ technicalRequirements, district, actionProps }: CommuneActionsProps) {
  const [isConfigDistrictVisible, setIsConfigDistrictVisible] = useState(false)
  const iframeSRC = 'https://grist.numerique.gouv.fr/o/ban/forms/4eCgRqqpyXW5FMoZzQ3nNm/4'
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [habilitationEnabled, setHabilitationEnabled] = useState<boolean>(false)
  // const techRequired = (technicalRequirements.hasID && technicalRequirements.hasAbove75PercentCertifiedNumbers && technicalRequirements.hasAbove50PercentParcelles)
  const techRequired = technicalRequirements.hasID
  const requiredConditions = 'L’émission du certificat d’adressage n’est possible que si l’adresse est certifiée et rattachée à une parcelle.'

  useEffect(() => {
    if (!district) return
    (async () => {
      const commune = await getCommune(district.codeCommune)
      if (!commune) return
      try {
        // if (commune.code == '64102' || commune.code == '64103' || commune.code == '64104') {
        const response = await customFetch('/api/me')
        console.log('commune.siren == JSON.parse(response).siret.slice(0, 9)?', commune.siren == JSON.parse(response).siret.slice(0, 9))
        // Check if the commune's SIREN matches the first 9 digits of the SIRET
        setHabilitationEnabled(commune.siren == JSON.parse(response).siret.slice(0, 9))
        setAuthenticated(response)
        // }
      }
      catch (error: any) {
        if (error?.status === 401) {
          // Not authenticated, do not enable habilitation
          setHabilitationEnabled(false)
        }
        else {
          // Handle other errors if needed
          console.error(error)
        }
      }
    })()
  }, [authenticated, district])

  // @todo: add authenticated condition

  const tooltipTitle = `Le certificat d’adressage est activé pour la commune de ${district.nomCommune}, les téléchargements sont disponibles via l'explorateur BAN.`

  const logOutButton = (
    <LogoutProConnectButtonCustom text="Se déconnecter de ProConnect" loginUrl="/api/logout" />
  )

  const conditions = (
    <>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          {technicalRequirements.hasID
            ? (<span className="fr-icon-success-line" aria-hidden="true" />)
            : (<span className="fr-icon-error-warning-line" aria-hidden="true" />)}
          <span>Pour que le certificat d&lsquo;adressage soit actif, il faut vérifier la présence des identifiants.</span>
          {/* <span className="fr-h6">Pour que le certificat d&lsquo;adressage soit actif, il faut vérifier la condition :{' '}</span> */}
          {/* <span className="fr-h6">Pour que le certificat d&lsquo;adressage soit actif, il faut vérifier ces 3 conditions :{' '}</span> */}
          {/* <ul style={{ listStyleType: 'none' }}>
            <li>
              {technicalRequirements.hasID
                ? (<span className="fr-icon-success-line" aria-hidden="true" />)
                : (<span className="fr-icon-error-warning-line" aria-hidden="true" />)}
              {' '}la présence des identifiants

            </li>
            <li>
              <span className="fr-icon-check-line" aria-hidden="true" />
              au moins 75% des adresses sont certifiées
            </li>
            <li>
              <span className="fr-icon-check-line" aria-hidden="true" />
              la présence des parcelles (au moins à 50%)
            </li>
          </ul> */}
        </li>
      </ul>
    </>
  )

  const renderHabilitationContent = () => {
    if (!authenticated) {
      return (
        <>
          {conditions}
          <div>{requiredConditions}</div>
          <b>Gérer les options de la commune avec ProConnect :</b>
          <ProConnectButton url="/api/login" />
        </>
      )
    }

    if (!habilitationEnabled) {
      return (
        <>
          {conditions}
          <div>{requiredConditions}</div>
          <b>Vous n’êtes pas habilité·e pour cette commune à activer la certification d’adressage.</b>
          {logOutButton}
        </>
      )
    }

    // console.log('techRequired', techRequired)

    if (techRequired) {
      return (
        <>
          {conditions}
          <div>{requiredConditions}</div>
          {!district.config?.certificate && (
            <>
              <Button
                key="set-config"
                iconId="ri-file-paper-2-line"
                onClick={() => setIsConfigDistrictVisible(!isConfigDistrictVisible)}
              >
                Activer le certificat d’adressage
              </Button>
            </>
          )}
          {logOutButton}
        </>
      )
    }
    else {
      return (
        <>
          {conditions}
          <div>{requiredConditions}</div>
          {logOutButton}
        </>
      )
    }
  }

  return (
    <>
      <link href={iframeSRC} rel="prefetch" />
      <Section>
        <CommuneActionsSectionWrapper style={{ marginBottom: '3rem' }}>
          {district.config?.certificate
            ? (
                <TooltipWithCommuneConfigItem title={tooltipTitle}>
                  Certificat d’adressage :{' '}
                  <b>Activé</b>
                </TooltipWithCommuneConfigItem>
              )
            : null}
          {renderHabilitationContent()}
        </CommuneActionsSectionWrapper>
        <Section
          title={`Demande d'activation du certificat d'adressage pour la commune de ${district.nomCommune}`}
          theme="grey"
          isVisible={isConfigDistrictVisible}
        >
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
