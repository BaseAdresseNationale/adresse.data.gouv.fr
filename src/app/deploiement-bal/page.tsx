import { getDepartements } from '@/lib/api-geo'
import departementCenterMap from '@/data/departement-center.json'
import { getStats } from '@/lib/api-ban'
import DeploiementBALMap from './DeploiementBALMap'

export default async function DeploiementBALPage() {
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

  return <DeploiementBALMap departements={departementsWithCenter} initialStats={stats} />
}
