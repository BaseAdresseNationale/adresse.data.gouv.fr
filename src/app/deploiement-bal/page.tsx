import { getEPCI } from '@/lib/api-geo'
import departements from '@/data/departement-center.json'
import { getStats } from '@/lib/api-ban'
import DeploiementBALDashboard from '../../components/DeploiementBAL/DeploiementBALDashboard'
import Section from '@/components/Section'
import { mapToSearchResult } from '@/lib/deploiement-stats'
import { DeploiementBALSearchResult } from '@/hooks/useStatsDeploiement'
import { Departement } from '@/types/api-geo.types'

export default async function DeploiementBALPage({ searchParams }: { searchParams: Record<string, string> }) {
  const stats = await getStats()
  const departementsWithCenter = Object.values(departements).map(({ properties, geometry }) => {
    return {
      ...properties,
      type: 'Département',
      centre: geometry,
    }
  }) as (Departement & { centre: { type: string, coordinates: number[] } })[]

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
