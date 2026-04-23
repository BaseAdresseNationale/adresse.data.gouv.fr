import { fetchAndProcessGristData } from '@/lib/api-grist'
import UsagesClient from './components/UsagesClient'
import pageTitle from '@/utils/pageTitle'

export const metadata = pageTitle('Usagers')

export const revalidate = 86400 // 24h

export default async function BaseUsages() {
  const appsData = await fetchAndProcessGristData()
  return <UsagesClient appsData={appsData} />
}
