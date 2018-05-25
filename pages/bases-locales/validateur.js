import FaTable from 'react-icons/lib/fa/table'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Validateur from '../../components/bases-locales/validateur'

const title = 'Le validateur BAL'
const description = 'Vérifier la conformité de votre fichier Base Adresse Locale.'

export default () => (
  <Page>
    <Head title={title} icon={<FaTable />}>
      {description}
    </Head>
    <Validateur />
  </Page>
)
