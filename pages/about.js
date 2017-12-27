import FaInfoCircle from 'react-icons/lib/fa/info-circle'
import Page from '../layouts/main'

import Head from '../components/head'
import About from '../components/about'

const title = 'À propos'
const description = 'En savoir plus sur adresse.data.gouv.fr'

export default () => (
  <Page>
    <Head title={title} icon={<FaInfoCircle />}>
      En savoir plus sur <strong>adresse.data.gouv.fr</strong>.
    </Head>
    <About />
  </Page>
)
