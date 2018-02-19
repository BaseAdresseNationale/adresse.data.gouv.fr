import FaBook from 'react-icons/lib/fa/book'
import FaFolderOpenO from 'react-icons/lib/fa/folder-open-o'
import FaHome from 'react-icons/lib/fa/home'

import Section from './section'
import HeadLinkTitle from './head-link-title'

const BaseUrl = '/datasets'

const titles = [
  {
    title: 'Base Adresse Nationale (BAN)',
    href: BaseUrl + '/base-adresse-national',
    description: <span>Référence l’intégralité des adresses du territoire français</span>,
    icon: <FaBook />
  },
  {
    title: 'Base Adresse National Ouverte (BANO)',
    href: BaseUrl + '/base-adresse-national-ouverte',
    description: <span>Base de données composite, constituée à partir de différentes sources</span>,
    icon: <FaFolderOpenO />
  },
  {
    title: 'Base Adresse Locale (BAL)',
    href: BaseUrl + '/base-adresse-locale',
    description: <span></span>,
    icon: <FaHome />
  }
]

const Datasets = () => (
  <Section>
    {titles.map(({title, href, description, icon}) => (
      <div key={title}>
        <HeadLinkTitle
          key={title}
          title={title}
          href={href}
          subtitle={description}
          icon={icon} />
        <div className='meta'>
          <div>Producteur</div>
          <div>Fréquence de mise à jour</div>
          <div>Licencse</div>
        </div>
      </div>
      )
    )}
    <style jsx>{`
      .meta {
        display: flex;
      }
      `}</style>
  </Section>
)

export default Datasets
