import CandidacyModal from '@/components/PartenairesDeLaCharte/CandidacyModal'
import SearchPartenaire from '@/components/PartenairesDeLaCharte/SearchPartenaire'
import Section from '@/components/Section'
import { getPartenairesDeLaCharte, getPartenairesDeLaCharteServices } from '@/lib/api-bal-admin'
import { getDepartements } from '@/lib/api-geo'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'

const PARTENAIRE_SEARCH_FILTER = {
  type: PartenaireDeLaCharteTypeEnum.ENTREPRISE,
}

export default async function SocietesPartenairesPage() {
  const services = await getPartenairesDeLaCharteServices(PARTENAIRE_SEARCH_FILTER)
  const initialPartenaires = await getPartenairesDeLaCharte(PARTENAIRE_SEARCH_FILTER, 1, 20)
  const departements = await getDepartements()

  return (
    <Section pageTitle="Annuaire des sociétés prestataires">
      <p>
        L’annuaire des sociétés prestataires recense les entreprises qui proposent des prestations aux communes pour la réalisation de leur Base Adresse locale. Ces organismes s’engagent à respecter le format Base Adresse Locale, sa gouvernance, et pour ces raisons sont identifiés comme tiers de confiance.
      </p>
      <p>
        Néanmoins, cela ne préjuge pas de la qualité du travail réalisé par ces sociétés, et nous invitons les communes à comparer la nature et le coût de ces prestations.
      </p>
      <p>
        En savoir plus sur le choix d&apos;un <a href="https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/les-prestations-pour-la-realisation-dune-base-adresse-locale" target="_blank">prestataire</a>.
      </p>
      <br />
      <p>
        Votre société réalise déjà des Bases Adresses Locales pour les communes ? Vous pouvez demander à intégrer cet annuaire en remplissant ce formulaire :
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
        <CandidacyModal defaultType={PartenaireDeLaCharteTypeEnum.ENTREPRISE} buttonLabel="Inscrivez-vous" services={Object.keys(services)} departements={departements} />
      </div>
      <SearchPartenaire
        placeholder="Filtrer les sociétés"
        shuffle
        searchBy="name"
        initialServices={services}
        initialPartenaires={initialPartenaires}
        departements={departements}
        filter={PARTENAIRE_SEARCH_FILTER}
      />
    </Section>
  )
}
