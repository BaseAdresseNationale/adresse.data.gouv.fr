import CompanyPage from '@/components/PartenairesDeLaCharte/CompanyPage'
import { DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT, getPartenairesDeLaCharte, getPartenairesDeLaCharteServices } from '@/lib/api-bal-admin'
import { getDepartements } from '@/lib/api-geo'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'

const PARTENAIRE_SEARCH_FILTER = {
  type: PartenaireDeLaCharteTypeEnum.ENTREPRISE,
}

export default async function SocietesPartenairesPage() {
  const services = await getPartenairesDeLaCharteServices(PARTENAIRE_SEARCH_FILTER)
  const {totalEntreprises} = await getPartenairesDeLaCharte(PARTENAIRE_SEARCH_FILTER, 1, 1)
  const departements = await getDepartements()
  const numPages = Math.ceil(totalEntreprises / DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT)
  const randomPage = Math.floor(Math.random() * numPages) + 1

  return (
    <CompanyPage services={services}  departements={departements} page={randomPage} />
  )
}
