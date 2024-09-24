import { getDepartements, getEPCI } from '@/lib/api-geo'
import departementCenterMap from '@/data/departement-center.json'
import { getStats } from '@/lib/api-ban'
import DeploiementBALDashboard from '../../components/DeploiementBAL/DeploiementBALDashboard'
import Section from '@/components/Section'
import { mapToSearchResult } from '@/lib/deploiement-stats'

export type DeploiementBALSearchResultEPCI = {
  type: 'EPCI'
  code: string
  nom: string
  center: { type: string, coordinates: [number, number] }
  contour: { type: string, coordinates: number[][][] }
}

export type DeploiementBALSearchResultDepartement = {
  type: 'Département'
  code: string
  nom: string
  center: { type: string, coordinates: [number, number] }
}

export type DeploiementBALSearchResult = DeploiementBALSearchResultEPCI | DeploiementBALSearchResultDepartement

export default async function DeploiementBALPage({ searchParams }: { searchParams: Record<string, string> }) {
  const stats = await getStats()
  const departements = await getDepartements()
  const departementsWithCenter = departements.map(({ code, ...rest }) => {
    const { geometry } = (departementCenterMap as any)[code]

    return {
      ...rest,
      code,
      centre: geometry,
    }
  })

  let initialFilter: DeploiementBALSearchResult | null = null
  if (searchParams.departement) {
    const codeDepartement = searchParams.departement
    const dpt = departementsWithCenter.find(({ code }) => code === codeDepartement)
    initialFilter = mapToSearchResult([dpt], 'Département')[0]
  }
  else if (searchParams.epci) {
    const codeEPCI = searchParams.epci
    const epci = await getEPCI(codeEPCI as string, ['centre', 'contour'])
    initialFilter = mapToSearchResult([epci], 'EPCI')[0]
  }

  return (
    <Section pageTitle="État du déploiement des Bases Adresses Locales">
      <DeploiementBALDashboard departements={departementsWithCenter} initialStats={stats} initialFilter={initialFilter} />
    </Section>
  )
}
