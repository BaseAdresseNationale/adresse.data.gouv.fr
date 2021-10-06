import Page from '@/layouts/main'
import ToolsIcon from '@/components/icons/tools'
import Head from '@/components/head'
import Tools from '@/components/tools'

const title = 'Outils'

function ToolsPage() {
  return (
    <Page title={title} description='adresse.data.gouv.fr met en place des outils pour une prise en main rapide des données adresses ouvertes.'>
      <Head title={title} icon={<ToolsIcon color='white' size={56} />} />
      <Tools />
    </Page>
  )
}

export default ToolsPage
