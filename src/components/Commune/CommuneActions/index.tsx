'use client'

import { useCallback, useState, useEffect } from 'react'
import { customFetch } from '@/lib/fetch'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import { ProConnectButton } from '@codegouvfr/react-dsfr/ProConnectButton'
// import ProConnectButtonCustom from '../../ProConnectButtonCustom/ProConnectButtonCustom'
import LogoutProConnectButtonCustom from '@/components/LogoutProConnectButtonCustom/LogoutProConnectButtonCustom'
import { getCommune } from '@/lib/api-geo'
import { Commune } from '@/types/api-geo.types'

import {
  CommuneActionsSectionWrapper,
  CommuneActionsActionsWrapper,
  CommuneConfigItem,
} from './CommuneActions.styles'
import { BANCommune } from '@/types/api-ban.types'
import Section from '@/components/Section'

import { env } from 'next-runtime-env'
const NEXT_PUBLIC_CERTIFICATION_LIMITED = env('NEXT_PUBLIC_CERTIFICATION_LIMITED')
const NEXT_PUBLIC_CERTIFICATION_LIMITED_LIST = env('NEXT_PUBLIC_CERTIFICATION_LIMITED_LIST')

const limitedList = (NEXT_PUBLIC_CERTIFICATION_LIMITED_LIST || '').split(',').map(code => code.trim())

console.log('>>> limited=', NEXT_PUBLIC_CERTIFICATION_LIMITED)
console.log('>>> limitedList=', limitedList)

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
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [habilitationEnabled, setHabilitationEnabled] = useState<boolean>(false)
  // const techRequired = (technicalRequirements.hasID && technicalRequirements.hasAbove75PercentCertifiedNumbers && technicalRequirements.hasAbove50PercentParcelles)
  // const techRequired = technicalRequirements.hasID
  const techRequired = !!district?.withBanId
  const requiredConditions = 'L’émission du certificat d’adressage n’est possible que si l’adresse est certifiée et rattachée à une parcelle.'
  const [featureProConnectEnabled, setFeatureProConnectEnabled] = useState<boolean>(false)
  const [clickedEnable, setClickedEnable] = useState<boolean>(false)
  const [commune, setCommune] = useState<Commune | null>(null)

  const enableAddressingCertification = useCallback(async () => {
    try {
      if (authenticated) {
        await customFetch('/api/me')
          .then((result) => {
            const {
              sub,
              name,
              given_name,
              family_name,
              usual_name,
              email,
              siret,
              aud,
              exp,
              iat,
              iss,
            } = JSON.parse(result)

            const body = {
              districtID: district.banId,
              sub: sub,
              name: name,
              givenName: given_name,
              familyName: family_name,
              usualName: usual_name,
              email: email,
              siret,
              siren: commune?.siren,
              aud: aud,
              exp: exp,
              iat: iat,
              iss: iss,
            }

            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            }

            return options
          })
          .then((options) => {
            customFetch(`/api/addressing-certification-enable`, options)
            setClickedEnable(true)
          })
      }
    }
    catch (error) {
      console.log('error', error)
    }
  }, [district, commune?.siren, authenticated])

  useEffect(() => {
    if (!district) return
    (async () => {
      const commune = await getCommune(district.codeCommune)
      if (!commune) return
      setCommune(commune)
      console.log('>>> district.withBanId=', district?.withBanId)
      try {
        // limited to some communes
        if (NEXT_PUBLIC_CERTIFICATION_LIMITED === 'true') {
          if (limitedList.includes(commune.code)) {
            setFeatureProConnectEnabled(true)
          }
        }
        else {
          // unlimited communes
          setFeatureProConnectEnabled(true)
        }

        // check withBanId ancien/nouveau socle
        if (!district?.withBanId) {
          setFeatureProConnectEnabled(false)
        }

        if (featureProConnectEnabled) {
          const response = await customFetch('/api/me')

          console.log('>>>response=', response)
          console.log('>>>siren siret=', commune.siren + ' ' + JSON.parse(response).siret)
          console.log('>>>compare siren include in siret=', commune.siren == JSON.parse(response).siret.slice(0, 9))

          setHabilitationEnabled(commune.siren == JSON.parse(response).siret.slice(0, 9))
          setAuthenticated(response)
        }
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
  }, [authenticated, featureProConnectEnabled, district])

  const tooltipTitle = `Le certificat d’adressage est activé pour la commune de ${district.nomCommune}, les téléchargements sont disponibles via l'explorateur BAN.`

  const logOutButton = (
    <LogoutProConnectButtonCustom text="Se déconnecter de ProConnect" loginUrl="/api/logout" />
  )

  const conditions = (
    <>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          {!!district?.withBanId
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
          <b>Gérer les options de la commune avec ProConnect :</b>
          <ProConnectButton url="/api/login" />
        </>
      )
    }

    if (!habilitationEnabled) {
      return (
        <>
          <b>Vous n’êtes pas habilité·e pour cette commune à activer la certification d’adressage.</b>
          {logOutButton}
        </>
      )
    }

    if (techRequired) {
      if (!clickedEnable) {
        return (
          <>
            {!district?.config?.certificate && (
              <Button
                key="set-config"
                iconId="ri-file-paper-2-line"
                onClick={enableAddressingCertification}
              >
                Activer la certification d’adressage
              </Button>
            )}
            {logOutButton}
          </>
        )
      }
      else {
        return (
          <>
            La certification d’adressage est en cours d’activation pour la commune de {district.nomCommune} dans quelques minutes.
            {logOutButton}
          </>
        )
      }
    }
    else {
      return logOutButton
    }
  }

  const renderHabilitationWrapper = () => {
    return (
      <>
        {conditions}
        <div>{requiredConditions}</div>
        {featureProConnectEnabled && renderHabilitationContent()}
      </>
    )
  }

  return (
    <>
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
          {renderHabilitationWrapper()}
        </CommuneActionsSectionWrapper>
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
