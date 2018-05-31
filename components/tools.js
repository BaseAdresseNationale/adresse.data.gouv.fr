import FaTable from 'react-icons/lib/fa/table'
import FaTerminal from 'react-icons/lib/fa/terminal'
import FaMap from 'react-icons/lib/fa/map'

import Section from './section'
import HeadLinkTitle from './head-link-title'

const titles = [
  {
    title: 'Le géocodeur CSV',
    href: '/csv',
    description: <span>Uploadez un fichier CSV, définissez les colonnes à utiliser pour le géocodage…</span>,
    icon: <FaTable />
  },
  {
    title: 'L’API',
    href: '/api',
    description: <span>Géocodez vos adresses grâce à l’API en ligne…</span>,
    icon: <FaTerminal />
  },
  {
    title: 'Le validateur BAL',
    href: '/validateur-bal',
    description: <span>Vérifier la conformité de votre fichier Base Adresse Locale.</span>,
    icon: <FaTable />
  },
  {
    title: 'Carte interactive',
    href: '/map',
    description: <span>Cherchez des adresses et lieux-dits, zoomez et déplacez la carte pour faire un géocodage inversé.</span>,
    icon: <FaMap />
  }
]

const Tools = () => (
  <Section>
    {titles.map(({title, href, description, icon}) =>
    (<HeadLinkTitle
      key={title}
      title={title}
      href={href}
      subtitle={description}
      icon={icon} />)
    )}
  </Section>
)

export default Tools
