import { getPartenairesDeLaCharte, getPartenairesDeLaCharteServices } from '@/lib/api-bal-admin'
import SearchPartenaire from '@/components/PartenairesDeLaCharte/SearchPartenaire'
import { getDepartements } from '@/lib/api-geo'
import Section from '@/components/Section'
import { PartenairesMap } from '@/components/PartenairesDeLaCharte/PartenairesMap'
import Button from '@codegouvfr/react-dsfr/Button'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'

const PARTENAIRE_SEARCH_FILTER = {
  type: PartenaireDeLaCharteTypeEnum.ORGANISME,
}

export default async function CharteBALPage() {
  const departements = await getDepartements()
  const initialPartenaires = await getPartenairesDeLaCharte({})

  return (
    <Section pageTitle={`${initialPartenaires.totalCommunes + initialPartenaires.totalOrganismes} acteurs engagés pour accompagner les communes dans l’adressage`}>
      <PartenairesMap />
      <p>
        <b>{initialPartenaires.totalCommunes} communes partenaires et {initialPartenaires.totalOrganismes} organismes partenaires</b>
      </p>
      <p>La Charte de la Base Adresse Locale rassemble les organismes qui privilégient le format Base Adresse Locale et s’engagent en matière de gouvernance. L’enjeu pour la commune, autorité responsable de l’adresse, est d’identifier un référent en capacité de l’assister au besoin.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', margin: '2rem 0' }}>
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right" linkProps={{ href: '/communaute/communes-partenaires' }}>Communes partenaires</Button>
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right" linkProps={{ href: '/communaute/organismes-partenaires' }}>Organismes partenaires</Button>
      </div>
      <h2>Partenaires disponibles sur votre territoire</h2>
      <p>De nombreux partenaires de la Charte de la Base Adresse Locale proposent un accompagnement et/ou des outils adaptés à votre territoire</p>
      <SearchPartenaire
        placeholder="Rechercher un partenaire pour ma commune"
        searchBy="perimeter"
        departements={departements}
        filter={PARTENAIRE_SEARCH_FILTER}
      />
    </Section>
  )
}
