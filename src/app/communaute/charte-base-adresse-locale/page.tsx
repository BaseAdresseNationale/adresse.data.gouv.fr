import { getPartenairesDeLaCharte, getPartenairesDeLaCharteServices } from '@/lib/api-bal-admin'
import SearchPartenaire from '@/components/PartenairesDeLaCharte/SearchPartenaire'
import { getDepartements } from '@/lib/api-geo'
import Section from '@/components/Section'
import { PartenairesMap } from '@/components/PartenairesDeLaCharte/PartenairesMap'
import Button from '@codegouvfr/react-dsfr/Button'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'
import Link from 'next/link'

const PARTENAIRE_SEARCH_FILTER = {
  type: PartenaireDeLaCharteTypeEnum.ORGANISME,
}

export default async function CharteBALPage() {
  const departements = await getDepartements()
  const initialPartenaires = await getPartenairesDeLaCharte({})
  const services = await getPartenairesDeLaCharteServices(PARTENAIRE_SEARCH_FILTER)

  return (
    <Section pageTitle={`${initialPartenaires.totalCommunes + initialPartenaires.totalOrganismes} acteurs engagés pour accompagner les communes dans l’adressage`}>
      <PartenairesMap />
      <p>
        <b>{initialPartenaires.totalCommunes} communes partenaires, {initialPartenaires.totalOrganismes} organismes partenaires et {initialPartenaires.totalEntreprises} référencées dans l&apos;annuaire des prestataires</b>
      </p>
      <p>La Charte de la Base Adresse Locale rassemble les organismes qui privilégient le format Base Adresse Locale et s’engagent en matière de gouvernance. L’enjeu pour la commune, autorité responsable de l’adresse, est d’identifier un référent en capacité de l’assister au besoin.</p>
      <p>Elle est disponible en deux versions (Commune et Organisme public). En parallèle, nous proposons également un annuaire des prestataires :</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', margin: '2rem 0' }}>
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right" linkProps={{ href: '/communaute/communes-partenaires' }}>Communes partenaires</Button>
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right" linkProps={{ href: '/communaute/organismes-partenaires' }}>Organismes partenaires</Button>
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right" linkProps={{ href: '/communaute/annuaire-des-prestataires' }}>Annuaire des prestataires</Button>
      </div>
      <h2>Partenaires disponibles sur votre territoire</h2>
      <p>De nombreux partenaires de la Charte de la Base Adresse Locale proposent un accompagnement et/ou des outils adaptés à votre territoire</p>
      <SearchPartenaire
        placeholder="Rechercher un partenaire pour ma commune"
        searchBy="perimeter"
        initialServices={services}
        initialPartenaires={initialPartenaires}
        departements={departements}
        filter={PARTENAIRE_SEARCH_FILTER}
      />
      <h2>Pour aller plus loin</h2>
      <ul>
        <li>
          Les{' '}
          <Link
            className="fr-link"
            href="/blog?tags=partenaires-charte&page=1"
          >témoignages
          </Link> des membres de la Charte
        </li>
        <li>
          La documentation mise à disposition par les partenaires :
          <ul>
            <li>
              <a
                className="fr-link"
                target="_blank"
                href="https://github.com/sigagglocompiegne/rva/blob/master/api/doc_api_balc_fme.md"
              >GéoCompiégnois - Paramétrage de l’API BAL pour FME
              </a>
            </li>
            <li>
              <a
                className="fr-link"
                target="_blank"
                href="https://sig14.github.io/adressage/IV_depot_bal"
              >Département du calvados - déposer une BAL via l’API BAN avec FME
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </Section>
  )
}
