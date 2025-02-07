import CardWrapper from '@/components/CardWrapper'
import DownloadCard from '@/components/DownloadCard'
import CandidacyModal from '@/components/PartenairesDeLaCharte/CandidacyModal'
import { PartenairesMap } from '@/components/PartenairesDeLaCharte/PartenairesMap'
import SearchPartenaire from '@/components/PartenairesDeLaCharte/SearchPartenaire'
import Section from '@/components/Section'
import { getPartenairesDeLaCharte, getPartenairesDeLaCharteServices } from '@/lib/api-bal-admin'
import { getDepartements } from '@/lib/api-geo'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'

const PARTENAIRE_SEARCH_FILTER = {
  type: PartenaireDeLaCharteTypeEnum.COMMUNE,
}

export default async function CommunesPartenairesPage() {
  const services = await getPartenairesDeLaCharteServices(PARTENAIRE_SEARCH_FILTER)
  const initialPartenaires = await getPartenairesDeLaCharte(PARTENAIRE_SEARCH_FILTER)
  const departements = await getDepartements()

  return (
    <Section pageTitle="Communes partenaires de la Charte">
      <PartenairesMap />
      <p>
        La Charte des communes partenaires s’adresse aux communes qui ont publié leur Base Adresse Locale, qui ont porté attention particulière portée à la qualité des données publiées, et qui souhaitent rejoindre la communauté des partenaires afin de participer aux échanges et à l’évolution du programme Base Adresse Locale et nous faire remonter leurs pratiques de terrain. Les communes partenaires s’engagent également à partager leur expérience auprès des autres communes.
      </p>

      <CardWrapper style={{ marginBottom: '1.5rem' }}>
        <DownloadCard
          title="Télécharger la charte des communes partenaires"
          text={<p>La charte des communes partenaires est destinée aux communes qui partagent leur expérience avec d’autres communes.</p>}
          fileDescription="PDF - 295 ko"
          downloadlink="/chartes-partenaires/charte-bal-communes.pdf"
        />
      </CardWrapper>

      <p>
        Votre commune a déjà publié sa Base Adresse Locale et vous souhaitez rejoindre la communauté des partenaires pour participer aux échanges et à l’évolution du programme Base Adresse Locale ? Vous pouvez rejoindre les partenaires de la Charte en remplissant ce formulaire :
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
        <CandidacyModal services={Object.keys(services)} departements={departements} />
      </div>
      <SearchPartenaire
        placeholder="Rechercher une commune partenaire"
        searchBy="name"
        initialServices={services}
        initialPartenaires={initialPartenaires}
        departements={departements}
        filter={PARTENAIRE_SEARCH_FILTER}
      />

    </Section>
  )
}
