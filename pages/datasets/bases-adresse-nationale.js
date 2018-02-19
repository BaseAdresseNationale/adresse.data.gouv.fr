import FaBook from 'react-icons/lib/fa/book'
import Page from '../../layouts/main'

import Head from '../../components/head'

import Description from '../../components/ban/description'
import Data from '../../components/ban/data'
import Partners from '../../components/ban/partners'

const title = 'Base Adresse National'
const description = 'Référence l’intégralité des adresses du territoire français'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaBook />}>
      En savoir plus sur <strong>adresse.data.gouv.fr</strong>.
    </Head>
    <Description />
    <Data />
    <Partners />
  </Page>
)
