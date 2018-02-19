import FaDatabase from 'react-icons/lib/fa/database'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Datasets from '../../components/datasets'

const title = 'Données'
const description = 'Sources de données de l’Adresse Ouverte'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaDatabase />}>
      {description}
    </Head>
    <Datasets />
  </Page>
)
