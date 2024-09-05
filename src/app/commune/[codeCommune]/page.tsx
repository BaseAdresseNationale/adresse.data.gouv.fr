import DownloadCard from '@/components/DownloadCard'
import Section from '@/components/Section'
import { getCommune as getBANCommune, getAddressCSVLegacy, getLieuxDitsCSVLegacy, getAdressesCsvBal } from '@/lib/api-ban'
import { getMairiePageURL } from '@/lib/api-etablissement-public'
import { StyledCommunePage } from './page.styles'
import { getRevisionDownloadUrl, getRevisions } from '@/lib/api-depot'
import CardWrapper from '@/components/CardWrapper'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { BALWidgetShowCommune } from './BALWidgetShowCommune'
import { CommuneNavigation } from './CommuneNavigation'
import Image from 'next/image'
import { getCommune as getAPIGeoCommune, getEPCI } from '@/lib/api-geo'
import { getDataset } from '@/lib/api-data-gouv'

interface CommunePageProps {
  params: { codeCommune: string }
}

export default async function CommunePage({ params }: CommunePageProps) {
  const { codeCommune } = params
  const commune = await getBANCommune(codeCommune)
  const APIGeoCommune = await getAPIGeoCommune(codeCommune)
  const EPCI = await getEPCI(APIGeoCommune?.codeEpci)

  const mairiePageUrl = await getMairiePageURL(codeCommune)

  const revisions = await getRevisions(codeCommune)
  const lastRevision = revisions[0]
  const modificationHistoryData = revisions
    .slice(0, 5)
    .map(revision => [
        `le ${new Date(revision.createdAt).toLocaleDateString()} à ${new Date(revision.createdAt).toLocaleTimeString()}`,
        revision.client.mandataire,
        revision.client.nom,
        <a key={revision._id} href={getRevisionDownloadUrl(revision._id)} download>Fichier CSV</a>,
    ])

  const modeDePublication = !lastRevision ? 'Assemblage' : lastRevision.client.nom === 'Mes Adresses' ? 'Mes Adresses' : lastRevision.client.nom === 'Moissonneur BAL' ? 'Moissonneur' : 'API Dépôt'

  let source = !lastRevision ? 'Assemblage' : lastRevision.client.nom === 'Mes Adresses' ? `Commune de ${commune.nomCommune}` : lastRevision.client.nom === 'Moissonneur BAL' ? 'Moissonneur' : lastRevision.client.nom
  if (source === 'Moissonneur') {
    const sourceId = lastRevision?.context?.extras?.sourceId
    const id: string[] = sourceId.split('-')
    const dataset = await getDataset(id[1])
    source = dataset?.nom || source
  }

  return (
    <>
      <CommuneNavigation commune={commune} />
      <StyledCommunePage>
        <Section className="commune-main-section">
          <h1>
            <Image width={80} height={80} alt="logo commune par défault" src="/commune/default-logo.svg" />
            <br />
            {commune.nomCommune} ({commune.codeCommune})
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
                {commune.departement.nom}
              </div>
            </div>
            <div className="commune-general-info">
              <label>
                Intercommunalité
              </label>
              <div>
                {EPCI?.nom || '-'}
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
                  {Math.round(commune.nbNumerosCertifies / commune.nbNumeros * 100)} %
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
                  {modeDePublication}
                </div>
              </div>
              <div className="publication-recap">
                <label>
                  Source
                </label>
                <div>
                  {source}
                </div>
              </div>
              <div className="publication-recap">
                <label>
                  Dernière mise à jour
                </label>
                <div>
                  {!lastRevision ? '-' : `le ${new Date(lastRevision.createdAt).toLocaleDateString()}`}
                </div>
              </div>
            </CardWrapper>
          </div>
          {mairiePageUrl && <a href={mairiePageUrl} target="_blank" className="fr-btn fr-btn--secondary">Contacter la mairie</a>}
        </Section>
        {lastRevision && (
          <Section title="Les dernières mises à jour" theme="primary">
            <div className="modification-history-wrapper">
              <Table
                headers={[
                  'Date',
                  'Auteur',
                  'Outil',
                  'Télécharger',
                ]}
                data={modificationHistoryData}
              />
            </div>
          </Section>
        )}
        <Section title="Télécharger les adresses de la commune">
          <p>
            Voici les adresses de la communes dans la Base Adresse Nationale. Ce fichier de référence présente la liste des voies avec les libellés enrichis (minuscules accentuées), mais aussi les libellés à la norme AFNOR, les codes FANTOIR mis à jour par la DGFiP, les points adresses géocodés, ainsi que leur lien avec les parcelles s’ils sont renseignés, la source des adresses et leur certification. Pour plus d’information sur la structure des informations, consultez la documentation des fichiers de la Base Adresse Nationale.
          </p>
          <CardWrapper isSmallCard style={{ marginBottom: '2rem' }}>
            <DownloadCard title="Télécharger Format BAL 1.3" fileDescription="Fichier CSV" downloadlink={getAdressesCsvBal(codeCommune, '1.3')} text="" />
            <DownloadCard title="Télécharger Format BAL 1.4" fileDescription="Fichier CSV" downloadlink={getAdressesCsvBal(codeCommune, '1.4')} text="" />
            <DownloadCard title="Télécharger Format Historique" fileDescription="Fichier CSV" downloadlink={getAddressCSVLegacy(codeCommune)} text="" />
            <DownloadCard title="Télécharger Format Historique lieu-dit" fileDescription="Fichier CSV" downloadlink={getLieuxDitsCSVLegacy(codeCommune)} text="" />
          </CardWrapper>
          <p>
            La commune est l’échelon de compétence pour mettre à jour les adresses. En cas de problème d’adresse sur la commune, contactez la. Vous pouvez également lui indiquer notre contact (<a href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</a>) au besoin.
          </p>
        </Section>

      </StyledCommunePage>
      <BALWidgetShowCommune codeCommune={codeCommune} nomCommune={commune.nomCommune} />
    </>
  )
}
