import Page from '@/layouts/main'
import {Map, FileText, Terminal, UserPlus, Archive} from 'react-feather'

import ToolsIcon from '@/components/icons/tools'
import Head from '@/components/head'
import {Tools} from '@/components/tools'

const title = 'Outils'

function ToolsPage() {
  const tools = [
    {
      title: 'L‘explorateur BAN',
      description: 'Cherchez des adresses dans la Base Adresse Nationale.',
      href: '/base-adresse-nationale#4.4/46.9/1.7',
      icon: <Map alt='' aria-hidden='true' />
    },
    {
      title: 'Le géocodeur CSV',
      description: 'Uploadez un fichier CSV, définissez les colonnes à utiliser pour le géocodage.',
      href: '/csv',
      icon: <FileText alt='' aria-hidden='true' />
    },
    {
      title: 'Le Validateur Base Adresse Locale',
      description: 'Vérifiez la conformité de votre fichier Base Adresse Locale.',
      href: '/bases-locales/validateur',
      icon: <UserPlus alt='' aria-hidden='true' />,
    },
    {
      title: 'Les APIS',
      description: 'Découvrez l‘API Adresse, l‘API Base Adresse Locale et l‘API de dépôt...',
      href: '/api-doc',
      icon: <Terminal alt='' aria-hidden='true' />
    },
    {
      title: 'L’explorateur FANTOIR',
      description: 'Consultez la base FANTOIR de la DGFiP en quelques clics',
      href: '/fantoir',
      icon: <Archive alt='' aria-hidden='true' />
    }
  ]

  return (
    <Page title={title} description='adresse.data.gouv.fr met en place des outils pour une prise en main rapide des données adresses ouvertes.'>
      <Head title={title} icon={<ToolsIcon color='white' size={56} />} alt='' aria-hidden='true' />
      <Tools items={tools} />
    </Page>
  )
}

export default ToolsPage
