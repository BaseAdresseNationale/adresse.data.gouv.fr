import CompanyPage from '@/components/PartenairesDeLaCharte/CompanyPage'
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
    <CompanyPage services={services} initialPartenaires={initialPartenaires} departements={departements} />
  )
}
