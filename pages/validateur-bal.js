import FaTable from 'react-icons/lib/fa/table'
import Page from '../layouts/main'

import Head from '../components/head'
import ValidateurBal from '../components/bal/validateur-bal'

const title = 'Le validateur BAL'
const description = 'Vérifier la conformité de votre fichier Base Adresse Locale.'

export default () => (
  <Page>
    <Head title={title} icon={<FaTable />}>
      {description}
    </Head>
    <ValidateurBal />
  </Page>
)
