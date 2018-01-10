import FaMapMarker from 'react-icons/lib/fa/map-marker'
import FaTable from 'react-icons/lib/fa/table'
import FaTerminal from 'react-icons/lib/fa/terminal'

import Section from './section'
import HeadLinkTitle from './head-link-title'

const titles = [
  {
    title: 'La carte interactive',
    href: '/map',
    description: <span>Cherchez des adresses et lieux-dits, zoomez et déplacez la carte pour faire un géocodage inversé…</span>,
    icon: <FaMapMarker />
  },
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
