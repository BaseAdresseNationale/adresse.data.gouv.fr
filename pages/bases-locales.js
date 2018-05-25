import FaDatabase from 'react-icons/lib/fa/database'
import Page from '../layouts/main'

import Head from '../components/head'
import BasesLocales from '../components/bases-locales'

const title = 'Bases locales'
const description = 'BAL'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaDatabase />}>
      {description}
    </Head>
    <BasesLocales />
  </Page>
)
