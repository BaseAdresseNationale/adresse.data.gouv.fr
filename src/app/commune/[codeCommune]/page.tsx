import Image from 'next/image'
import Link from 'next/link'
import { Table } from '@codegouvfr/react-dsfr/Table'

import CardWrapper from '@/components/CardWrapper'
import Section from '@/components/Section'
import {
  getCommune as getBANCommune,
  assemblageSources,
} from '@/lib/api-ban'
import { formatFr } from '@/lib/array'
import { getRevisionDetails, getRevisions } from '@/lib/api-depot'
import { getMairiePageURL } from '@/lib/api-etablissement-public'
import { getCommune as getAPIGeoCommune, getEPCI } from '@/lib/api-geo'
import { getCommuneFlag } from '@/lib/api-blasons-communes'

import { CommuneDownloadSection } from '../../../components/Commune/CommuneDownloadSection'
import { CommuneNavigation } from '../../../components/Commune/CommuneNavigation'

import ResumeDistrict from './ResumeDistrict'
import { StyledCommunePage } from './page.styles'

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
  const certificationPercentage = Math.round(commune.nbNumerosCertifies / commune.nbNumeros * 100)

  const [
    mairiePageResponse,
    communeFlagResponse,
    EPCIResponse,
    lastRevisionsDetailsResponse,
  ] = await Promise.allSettled([
    getMairiePageURL(codeCommune),
    getCommuneFlag(codeCommune),
    getEPCI(APIGeoCommune?.codeEpci),
    communeHasBAL && getRevisions(codeCommune)
      .then(revisions => Promise.all(revisions
        .slice(0, 5)
        .map(revision => getRevisionDetails(revision, commune)))
      ),
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
          <div className="commune-adresse-info-wrapper">
            <CardWrapper>
              <div className="adresse-recap">
                <div>
                  {commune.nbVoies}
                </div>
                <label>
                  voies, places et lieux-dits adressés
                </label>
              </div>
              <div className="adresse-recap">
                <div>
                  {commune.nbNumeros}
                </div>
                <label>
                  adresses
                </label>
              </div>
              <div className="adresse-recap">
                <div>
                  {certificationPercentage} %
                </div>
                <label>
                  d&apos;adresses certifiées
                </label>
              </div>
            </CardWrapper>
            <CardWrapper>
              <div className="publication-recap">
                <label>
                  Mode de publication
                </label>
                <div>
                  {!communeHasBAL && 'Assemblage'}
                  {communeHasBAL && lastRevisionsDetails && lastRevisionsDetails[0][1]}
                </div>
              </div>
              <div className="publication-recap">
                <label>
                  Source
                </label>
                <div>
                  {!communeHasBAL && formatFr(assemblageSources(commune.voies))}
                  {communeHasBAL && lastRevisionsDetails && lastRevisionsDetails[0][2]}
                </div>
              </div>
              <div className="publication-recap">
                <label>
                  Dernière mise à jour
                </label>
                <div>
                  {!communeHasBAL && '-'}
                  {communeHasBAL && lastRevisionsDetails && (lastRevisionsDetails[0][0] as string).split(' à ')[0]}
                </div>
              </div>
            </CardWrapper>
          </div>

          <ResumeDistrict
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
              {
                iconId: 'fr-icon-discuss-line',
                linkProps: {
                  href: mairiePageUrl,
                  target: '_blank',
                },
                priority: 'secondary',
                value: 'Contacter la mairie',
              },
            ]}
          />

        </Section>

        {communeHasBAL && lastRevisionsDetails && (
          <Section title="Les dernières mises à jour" theme="primary">
            <div className="modification-history-wrapper">
              <Table
                headers={[
                  'Date',
                  'Mode de publication',
                  'Source',
                  'Télécharger',
                ]}
                data={lastRevisionsDetails}
              />
            </div>
          </Section>
        )}
        <CommuneDownloadSection commune={commune} />
      </StyledCommunePage>
    </>
  )
}
