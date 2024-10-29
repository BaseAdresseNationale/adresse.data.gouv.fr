import Section from '@/components/Section'
import { getCommune as getBANCommune, assemblageSources } from '@/lib/api-ban'
import { getMairiePageURL } from '@/lib/api-etablissement-public'
import { StyledCommunePage } from './page.styles'
import { getRevisionDetails, getRevisions } from '@/lib/api-depot'
import CardWrapper from '@/components/CardWrapper'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { CommuneNavigation } from '../../../components/Commune/CommuneNavigation'
import Image from 'next/image'
import { getCommune as getAPIGeoCommune, getEPCI } from '@/lib/api-geo'
import { getCommuneFlag } from '@/lib/api-wikidata'
import { CommuneDownloadSection } from '../../../components/Commune/CommuneDownloadSection'
import { formatFr } from '@/lib/array'
import Link from 'next/link'

interface CommunePageProps {
  params: { codeCommune: string }
}

export default async function CommunePage({ params }: CommunePageProps) {
  const { codeCommune } = params
  const commune = await getBANCommune(codeCommune)
  const communeHasBAL = commune.typeComposition !== 'assemblage'
  const APIGeoCommune = await getAPIGeoCommune(codeCommune)
  const EPCI = await getEPCI(APIGeoCommune?.codeEpci)

  const mairiePageUrl = await getMairiePageURL(codeCommune)
  const communeFlagUrl = await getCommuneFlag(codeCommune)
  const certificationPercentage = Math.round(commune.nbNumerosCertifies / commune.nbNumeros * 100)

  let lastRevisionsDetails
  if (communeHasBAL) {
    const revisions = await getRevisions(codeCommune)
    lastRevisionsDetails = await Promise.all(revisions
      .slice(0, 5)
      .map(revision => getRevisionDetails(revision, commune)))
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
          {mairiePageUrl && <Link href={mairiePageUrl} target="_blank" className="fr-btn fr-btn--secondary">Contacter la mairie</Link>}
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
