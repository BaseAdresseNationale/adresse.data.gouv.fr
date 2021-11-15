import {Compass, Terminal, Map, Folder} from 'react-feather'

import apis from '../../apis.json'

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
      icon: <Terminal />
    },
    {
      title: 'API Gestion d\'une Base Adresse Locale',
      description: 'API permettant de créer une Base Adresse Locale et d’en gérer les adresses. Utilisée par Mes Adresses.',
      href: 'https://github.com/BaseAdresseNationale/api-bal/wiki/Documentation-de-l\'API',
      icon: <Map />
    },
    {
      title: 'API Dépot d\'une Base Adresse Locale',
      description: 'API permettant de soumettre une Base Adresse Locale à la Base Adresse Nationale. Gestion des habilitations.',
      href: 'https://github.com/BaseAdresseNationale/api-depot/wiki/Documentation',
      icon: <Folder />
    }
  ]

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Compass color='white' size={56} />} />
      <Tools items={apis} />
    </Page>
  )
}

export default ApiPage
