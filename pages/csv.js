import {FileText} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Csv from '@/components/csv/csv'

const title = 'Géocoder un fichier CSV'
const description = 'adresse.data.gouv.fr met en place des outils pour une prise en main rapide des données adresses ouvertes.'

function CsvPage() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<FileText size={56} alt='' aria-hidden='true' />} />
      <Csv />
    </Page>
  )
}

export default CsvPage
