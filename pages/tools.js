import apis from '../apis.json'

import Page from '@/layouts/main'
import ToolsIcon from '@/components/icons/tools'
import Head from '@/components/head'
import {Apis} from '@/components/apis'

const title = 'Outils'

function ToolsPage() {
  return (
    <Page title={title} description='adresse.data.gouv.fr met en place des outils pour une prise en main rapide des données adresses ouvertes.'>
      <Head title={title} icon={<ToolsIcon color='white' size={56} />} />
      <Apis apis={apis} />
    </Page>
  )
}

export default ToolsPage
