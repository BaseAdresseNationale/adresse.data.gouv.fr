import { fetchAndProcessActusGristData } from '@/lib/api-grist'
import pageTitle from '@/utils/pageTitle'
import Actualites from './components/Actualites'

export const metadata = pageTitle('Actualités')

export default async function BaseActualites() {
    const appsData = await fetchAndProcessActusGristData()
    return (
        <>
            <Actualites appsData={appsData}/>
        </>
    )
}
