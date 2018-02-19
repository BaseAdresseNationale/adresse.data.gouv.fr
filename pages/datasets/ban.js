import FaBook from 'react-icons/lib/fa/book'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Ban from '../../components/ban'
import Partners from '../../components/partners'

const title = 'Base Adresse National'
const description = 'Référence l’intégralité des adresses du territoire français'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaBook />}>
      En savoir plus sur <strong>adresse.data.gouv.fr</strong>.
    </Head>
    <Ban />
    <Partners />
  </Page>
)
