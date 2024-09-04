import DownloadCard from '@/components/DownloadCard'
import Section from '@/components/Section'
import { getCommune, getAddressCSVLegacy, getLieuxDitsCSVLegacy, getAdressesCsvBal } from '@/lib/api-ban'
import { getMairie } from '@/lib/api-etablissement-public'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { StyledCommunePage } from './page.styles'
import { getRevisionDownloadUrl, getRevisions } from '@/lib/api-depot'
import CardWrapper from '@/components/CardWrapper'
import { Table } from "@codegouvfr/react-dsfr/Table";
import { BALWidgetShowCommune } from '@/components/BALWidget/BALWidgetShowCommune'
import { CommuneNavigation } from './CommuneNavigation'

interface CommunePageProps {
  params: { codeCommune: string }
}

export default async function CommunePage({ params }: CommunePageProps) {
  const { codeCommune } = params
  const commune = await getCommune(codeCommune)
  const communeHasBAL = commune.typeComposition !== 'assemblage'

  const mairie = await getMairie(codeCommune)

  const revisions = await getRevisions(codeCommune)
  const modificationHistoryData = revisions.map(revision => {
    return [
        `le ${new Date(revision.createdAt).toLocaleDateString()} à ${new Date(revision.createdAt).toLocaleTimeString()}`,
        revision.client.mandataire,
        revision.client.nom,
        <a href={getRevisionDownloadUrl(revision._id)} download>Fichier CSV</a>
    ]
  })

  return (
    <>
        <CommuneNavigation commune={commune} />
        <StyledCommunePage>
        <Section pageTitle={`${commune.nomCommune} (${commune.codeCommune})`}>
            <div className="commune-info-wrapper">
            <div className="commune-info-card">
                <p>
                Région : <b>{commune.region.nom}</b><br />
                Département : <b>{commune.departement.nom}</b><br />
                Code postal : <b>{commune.codesPostaux}</b><br />
                Population : <b>{commune.population} habitants</b><br />
                </p>
                {mairie && (
                <>
                    <h3>Contact de la mairie</h3>
                    <p>
                    {/* Site web : <b>{mairie.nom}</b><br /> */}
                    Téléphone : <b>{mairie.telephone}</b><br />
                    Email : <b>{mairie.email}</b><br />
                    </p>
                </>
                )}

            </div>
            <div className="commune-info-card">
                <h3>Les adresses</h3>
                <p>
                Nombre de numéros : <b>{commune.nbNumeros}</b><br />
                Nombre de voies : <b>{commune.nbVoies}</b><br />
                Nombre de lieux-dits : <b>{commune.nbLieuxDits}</b><br />
                </p>
            </div>
            </div>

            <Alert
            description={communeHasBAL ? 'Les adresses de la commune proviennent d\'une Base Adresse Locale' : 'Les adresses de la commune proviennent d\'un assemblage de données de différentes sources, cet assemblage n\'est pas mis à jour.'}
            severity={communeHasBAL ? 'success' : 'info'}
            title="État de la base adresse"
            />
        </Section>
        {communeHasBAL && (
            <Section title="Historique des modifications" theme='primary'>
            <div className='modification-history-wrapper'>
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
