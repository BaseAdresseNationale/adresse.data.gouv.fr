import {Compass, Terminal, Map, Folder, Activity} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import {Tools} from '@/components/tools'

const title = 'Documentation des API'
const description = 'Découvrez l’API Adresse, l’API Base Adresse Locale et l’API de dépôt'

function ApiPage() {
  const apis = [
    {
      title: 'API Adresse',
      description: 'Recherchez ou normalisez des adresses à l’unité ou en lot. Géocodage direct ou inversé.',
      href: '/api-doc/adresse',
      icon: <Terminal alt='' aria-hidden='true' />
    },
    {
      title: 'API Gestion d\'une Base Adresse Locale',
      description: 'API permettant de créer une Base Adresse Locale et d’en gérer les adresses. Utilisée par Mes Adresses.',
      href: 'https://github.com/BaseAdresseNationale/api-bal/wiki/Documentation-de-l\'API',
      icon: <Map alt='' aria-hidden='true' />
    },
    {
      title: 'API Dépot d\'une Base Adresse Locale',
      description: 'API permettant de soumettre une Base Adresse Locale à la Base Adresse Nationale. Gestion des habilitations.',
      href: 'https://github.com/BaseAdresseNationale/api-depot/wiki/Documentation',
      icon: <Folder alt='' aria-hidden='true' />
    },
    {
      title: 'API FANTOIR',
      description: 'API permettant consulter la base FANTOIR de la DGFiP.',
      href: 'https://github.com/BaseAdresseNationale/api-fantoir/blob/master/README.md#api',
      icon: <Folder alt='' aria-hidden='true' />
    },
    {
      title: 'Supervision BAN/BAL',
      description: 'Consultez la disponiblité des différents systèmes grâce à un outil de monitoring.',
      href: 'https://stats.uptimerobot.com/jVEyBiY5jg',
      icon: <Activity alt='' aria-hidden='true' />
    }
  ]

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Compass color='white' size={56} alt='' aria-hidden='true' />} />
      <Tools items={apis} />
    </Page>
  )
}

export default ApiPage
