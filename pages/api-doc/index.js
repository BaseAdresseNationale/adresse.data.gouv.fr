import {Compass} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Apis from '@/components/apis'

const title = 'Documentation des API'
const description = 'Découvrez l’API Adresse, l’API Base Adresse Locale et l’API de dépôt'

function ApiPage() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Compass color='white' size={56} />} />
      <Apis />
    </Page>
  )
}

export default ApiPage
