import CandidacyModal from '@/components/PartenairesDeLaCharte/CandidacyModal'
import SearchPartenaire from '@/components/PartenairesDeLaCharte/SearchPartenaire'
import { PartenairesMap } from '@/components/PartenairesDeLaCharte/PartenairesMap'
import Section from '@/components/Section'
import { getPartenairesDeLaCharte, getPartenairesDeLaCharteServices } from '@/lib/api-bal-admin'
import { getDepartements } from '@/lib/api-geo'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'
import DownloadCard from '@/components/DownloadCard'

const PARTENAIRE_SEARCH_FILTER = {
  type: PartenaireDeLaCharteTypeEnum.ORGANISME,
}

export default async function OrganismesPartenairesPage() {
  const services = await getPartenairesDeLaCharteServices(PARTENAIRE_SEARCH_FILTER)
  const departements = await getDepartements()

  return (
    <Section pageTitle="Organismes partenaires de la Charte">
      <PartenairesMap />
      <p>
        La Charte des organismes partenaires s’adresse aux organismes publics (intercommunalités, syndicats mixtes, départements…) qui accompagnent les communes dans la publication de leurs adresses.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
        <DownloadCard
          title="Télécharger la charte des organismes partenaires"
          fileDescription="PDF - 295 ko"
          downloadlink="/chartes-partenaires/charte-bal-organismes.pdf"
          style={{ maxWidth: '400px' }}
        />
      </div>
      <p>
        Cet accompagnement peut prendre plusieurs formes : formation, accompagnement technique, mise à disposition d’outils mutualisés, réalisation de bases adresses locales par délégation pour les communes, sensibilisation, partage d’expérience.
      </p>
      <p>
        En rejoignant la communauté des partenaires, l’organisme sera reconnu comme acteur de référence sur son territoire. Il rejoindra ce faisant la communauté des partenaires afin de participer aux échanges et à l’évolution du programme Base Adresse Locale. Il bénéficiera également d’outils de suivi des publications.
      </p>
      <br />
      <p>
        Les organismes partenaires s’engagent à respecter le format Base Adresse Locale, sa gouvernance et pour ces raisons sont identifiés comme tiers de confiance. Votre organisme respecte déjà ces spécifications mais n’est pas identifié ? Vous pouvez rejoindre les partenaires de la Charte en remplissant ce formulaire :
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
        <CandidacyModal defaultType={PartenaireDeLaCharteTypeEnum.ORGANISME} services={Object.keys(services)} departements={departements} />
      </div>
      <SearchPartenaire
        placeholder="Rechercher un organisme partenaire"
        searchBy="name"
        departements={departements}
        filter={PARTENAIRE_SEARCH_FILTER}
      />
    </Section>
  )
}
