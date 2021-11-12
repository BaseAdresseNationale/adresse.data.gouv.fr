import {Compass} from 'react-feather'

import apis from '../../apis.json'

import Page from '@/layouts/main'
import Head from '@/components/head'
import {Tools} from '@/components/tools'

const title = 'Documentation des API'
const description = 'Découvrez l’API Adresse, l’API Base Adresse Locale et l’API de dépôt'

function ApiPage() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Compass color='white' size={56} />} />
      <Tools items={apis} />
    </Page>
  )
}

export default ApiPage
