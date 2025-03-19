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
    communeAchievementsResponse,
  ] = await Promise.allSettled([
    getMairiePageURL(codeCommune),
    getCommuneFlag(codeCommune),
    getEPCI(APIGeoCommune?.codeEpci),
    communeHasBAL
      ? getRevisions(codeCommune)
        .then(revisions => Promise.all(revisions
          .slice(0, 5)
          .map(revision => getRevisionDetails(revision, commune)))
        )
      : [],
    getCommuneAchievements(commune),
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

  if (communeAchievementsResponse.status === 'rejected') {
    console.error(`Failed to get commune achievements for commune ${codeCommune}`, communeAchievementsResponse.reason)
  }
  const communeAchievements = communeAchievementsResponse.status === 'fulfilled' ? communeAchievementsResponse.value : null

  const districtMapURL = `/carte-base-adresse-nationale?id=${commune.codeCommune}`

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
                  href: districtMapURL,
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

        <CommuneDownloadSection commune={commune} hasRevision={Boolean(lastRevisionsDetails)} />

        {communeHasBAL && lastRevisionsDetails && (
          <CommuneUpdatesSection lastRevisionsDetails={lastRevisionsDetails} />
        )}
      </StyledCommunePage>
    </>
  )
}
