import { fetchAndProcessGristData } from '@/lib/api-grist'
import UsagesClient from './components/UsagesClient'

export const revalidate = 86400 // 24h

export default async function BaseUsages() {
  const appsData = await fetchAndProcessGristData()
  return <UsagesClient appsData={appsData} />
}
