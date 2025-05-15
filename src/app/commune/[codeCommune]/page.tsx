import Image from 'next/image'
import Link from 'next/link'

import CardWrapper from '@/components/CardWrapper'
import Section from '@/components/Section'
import {
  getCommune as getBANCommune,
} from '@/lib/api-ban'
import { getRevisionDetails, getRevisions } from '@/lib/api-depot'
import { getMairiePageURL } from '@/lib/api-etablissement-public'
import { getCommune as getAPIGeoCommune, getEPCI } from '@/lib/api-geo'
import { getCommuneFlag } from '@/lib/api-blasons-communes'

import { CommuneDownloadSection } from '../../../components/Commune/CommuneDownloadSection'
import { CommuneNavigation } from '../../../components/Commune/CommuneNavigation'

import CommuneActions from '../../../components/Commune/CommuneActions'
import { StyledCommunePage } from './page.styles'
import { CommuneAchievements } from '@/components/Commune/CommuneAchievements'
import { CommuneUpdatesSection } from '@/components/Commune/CommuneUpdatesSection'
import { CommuneCertificationBar } from '@/components/Commune/CommuneCertificationBar'
import { getCommuneAchievements } from '@/lib/commune'
import { env } from 'next-runtime-env'
import { getCommunesPrecedentes } from '@/lib/api-insee'
import { CommunePublicationConsole } from '@/components/Commune/CommunePublicationConsole'
import { getSignalements } from '@/lib/api-signalement'
import { getPartenairesDeLaCharte } from '@/lib/api-bal-admin'
import { SignalementStatusEnum } from '@/types/api-signalement.types'

interface CommunePageProps {
  params: { codeCommune: string }
}

export default async function CommunePage({ params }: CommunePageProps) {
  const { codeCommune } = params
  const [
    commune,
    APIGeoCommune,
  ] = await Promise.all([
    getBANCommune(codeCommune),
    getAPIGeoCommune(codeCommune),
  ])

  const communeHasBAL = commune.typeComposition !== 'assemblage'
  const certificationPercentage = Math.ceil(commune.nbNumerosCertifies / commune.nbNumeros * 100)

  const [
    mairiePageResponse,
    communeFlagResponse,
    EPCIResponse,
    lastRevisionsDetailsResponse,
    communesPrecedentesResponse,
    paginatedSignalementsResponse,
    paginatedPartenairesDeLaCharteResponse,
  ] = await Promise.allSettled([
    getMairiePageURL(codeCommune),
    getCommuneFlag(codeCommune),
    APIGeoCommune?.codeEpci && getEPCI(APIGeoCommune.codeEpci),
    communeHasBAL
      ? getRevisions(codeCommune)
        .then(revisions => Promise.all(revisions
          .slice(0, 5)
          .map(revision => getRevisionDetails(revision, commune)))
        )
      : [],
    getCommunesPrecedentes(codeCommune),
    getSignalements({ codeCommunes: [commune.codeCommune], status: [SignalementStatusEnum.PROCESSED, SignalementStatusEnum.IGNORED] }, 1, 1),
    getPartenairesDeLaCharte({ search: commune.nomCommune }, 1, 1),
  ])

  if (mairiePageResponse.status === 'rejected') {
    console.error(`Failed to get mairie page URL for commune ${codeCommune}`, mairiePageResponse.reason?.message)
  }
  const mairiePageUrl = mairiePageResponse.status === 'fulfilled' ? mairiePageResponse.value : null

  if (communeFlagResponse.status === 'rejected') {
    console.error(`Failed to get commune flag for commune  ${codeCommune}`, communeFlagResponse.reason?.message)
  }
  const communeFlagUrl = communeFlagResponse.status === 'fulfilled' ? communeFlagResponse.value : null

  if (EPCIResponse.status === 'rejected') {
    console.error(`Failed to get EPCI for commune ${codeCommune}`, EPCIResponse.reason?.message)
  }
  const EPCI = EPCIResponse.status === 'fulfilled' ? EPCIResponse.value : null

  if (lastRevisionsDetailsResponse.status === 'rejected') {
    console.error(`Failed to get last revisions details for commune ${codeCommune}`, lastRevisionsDetailsResponse.reason?.message)
  }
  const lastRevisionsDetails = lastRevisionsDetailsResponse.status === 'fulfilled' ? lastRevisionsDetailsResponse.value : null

  if (communesPrecedentesResponse.status === 'rejected') {
    console.error(`Failed to get communes precedentes for commune ${codeCommune}`, communesPrecedentesResponse.reason)
  }
  const communesPrecedentes = communesPrecedentesResponse.status === 'fulfilled' ? communesPrecedentesResponse.value : null

  if (paginatedSignalementsResponse.status === 'rejected') {
    console.error(`Failed to get paginated signalements for commune ${codeCommune}`, paginatedSignalementsResponse.reason)
  }
  const paginatedSignalements = paginatedSignalementsResponse.status === 'fulfilled' ? paginatedSignalementsResponse.value : undefined

  if (paginatedPartenairesDeLaCharteResponse.status === 'rejected') {
    console.error(`Failed to get paginated partenaires for commune ${codeCommune}`, paginatedPartenairesDeLaCharteResponse.reason)
  }
  const paginatedPartenairesDeLaCharte = paginatedPartenairesDeLaCharteResponse.status === 'fulfilled' ? paginatedPartenairesDeLaCharteResponse.value : undefined

  const communeAchievements = communeHasBAL
    ? getCommuneAchievements({
      commune,
      paginatedPartenairesDeLaCharte,
      paginatedSignalements,
    })
    : null

  const filteredCommunesPrecedentes = communesPrecedentes
    ?.map(({ code, intitule }) => `${intitule} - ${code}`)

  const partenaireDeLaCharte = paginatedPartenairesDeLaCharte?.data[0]
  const publicationConsoleTabs = []

  if (partenaireDeLaCharte?.apiDepotClientId && partenaireDeLaCharte.apiDepotClientId.length > 0) {
    publicationConsoleTabs.push({ tabId: 'api-depot', label: 'API-dépôt' })
  }
  if (partenaireDeLaCharte?.dataGouvOrganizationId && partenaireDeLaCharte.dataGouvOrganizationId.length > 0) {
    publicationConsoleTabs.push({ tabId: 'moissonnage', label: 'Moissonnage' })
  }

  return (
    <>
      <CommuneNavigation commune={commune} />
      <StyledCommunePage $certificationPercentage={certificationPercentage}>
        <Section className="commune-main-section">
          <h1>
            <Image width={80} height={80} alt="logo commune par défault" src={communeFlagUrl || '/commune/default-logo.svg'} />
            <br />
            {commune.nomCommune} - {commune.codeCommune}
          </h1>

          {filteredCommunesPrecedentes && filteredCommunesPrecedentes.length > 1 && (
            <div className="communes-precedentes-wrapper">
              Commune issue de la fusion de :  <b>{filteredCommunesPrecedentes?.join(', ')}</b>
            </div>
          )}

          <CardWrapper className="commune-general-info-wrapper">
            <div className="commune-general-info">
              <label>
                Région
              </label>
              <div>
                {commune.region.nom}
              </div>
            </div>
            <div className="commune-general-info">
              <label>
                Département
              </label>
              <div>
                <Link href={`/deploiement-bal?departement=${commune.departement.code}`}>{commune.departement.nom}</Link>
              </div>
            </div>
            <div className="commune-general-info">
              <label>
                Intercommunalité
              </label>
              <div>
                {EPCI ? <Link href={`/deploiement-bal?epci=${EPCI.code}`}>{EPCI.nom}</Link> : '-'}
              </div>
            </div>
          </CardWrapper>

          {communeAchievements && (
            <CommuneAchievements
              achievements={communeAchievements}
            />
          )}

          <CommuneCertificationBar
            certificationPercentage={certificationPercentage}
            commune={commune}
            communeHasBAL={communeHasBAL}
            lastRevisionsDetails={lastRevisionsDetails}
          />

          <CommuneActions
            district={commune}
            actionProps={[
              {
                iconId: 'fr-icon-road-map-line',
                linkProps: {
                  href: `/carte-base-adresse-nationale?id=${commune.codeCommune}`,
                },
                priority: 'secondary',
                value: 'Afficher sur la carte',
              },
              ...(communeHasBAL && lastRevisionsDetails && lastRevisionsDetails[0][2] === 'Mes Adresses')
                ? [{
                    iconId: 'fr-icon-error-warning-line',
                    linkProps: {
                      href: `${env('NEXT_PUBLIC_MES_SIGNALEMENTS')}/#/?sourceId=${env('NEXT_PUBLIC_MES_SIGNALEMENTS_SOURCE_ID')}`,
                      target: '_blank',
                    },
                    priority: 'secondary',
                    value: 'Proposer une amélioration',
                  }]
                : [],
              ...(mairiePageUrl)
                ? [{
                    iconId: 'fr-icon-discuss-line',
                    linkProps: {
                      href: mairiePageUrl,
                      target: '_blank',
                    },
                    priority: 'secondary',
                    value: 'Contacter la mairie',
                  }]
                : [],
            ]}
          />

        </Section>

        <CommuneDownloadSection commune={commune} hasRevision={communeHasBAL} />

        {communeHasBAL && lastRevisionsDetails && (
          <CommuneUpdatesSection lastRevisionsDetails={lastRevisionsDetails} />
        )}

        {partenaireDeLaCharte && publicationConsoleTabs.length > 0 && <CommunePublicationConsole partenaireDeLaCharte={partenaireDeLaCharte} tabs={publicationConsoleTabs} />}
      </StyledCommunePage>
    </>
  )
}
