import FaBook from 'react-icons/lib/fa/book'
import FaFolderOpenO from 'react-icons/lib/fa/folder-open-o'
import FaHome from 'react-icons/lib/fa/home'

import Section from './section'
import HeadLinkTitle from './head-link-title'

const BaseUrl = '/datasets'

const titles = [
  {
    title: 'Base Adresse Nationale (BAN)',
    href: BaseUrl + '/ban',
    description: <span></span>,
    icon: <FaBook />
  },
  {
    title: 'Base Adresse Ouverte (BANO)',
    href: BaseUrl + '/bano',
    description: <span></span>,
    icon: <FaFolderOpenO />
  },
  {
    title: 'Base Adresse Locale (BAL)',
    href: BaseUrl + '/bal',
    description: <span></span>,
    icon: <FaHome />
  }
]

const Datasets = () => (
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

export default Datasets
