import FaPencil from 'react-icons/lib/fa/pencil'
import Page from '../layouts/main'

import Head from '../components/head'
import Contrib from '../components/contrib'

const title = 'Contribuer'
const description = 'Les différents outils à votre disposition pour contribuer au contenu de la BAN.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaPencil />}>
      {description}
    </Head>
    <Contrib />
  </Page>
)
