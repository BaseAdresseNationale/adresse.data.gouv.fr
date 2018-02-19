import FaBook from 'react-icons/lib/fa/book'
import FaFolderOpenO from 'react-icons/lib/fa/folder-open-o'
import FaHome from 'react-icons/lib/fa/home'

import theme from '../styles/theme'

import Section from './section'
import HeadLinkTitle from './head-link-title'
import DatasetMeta from './dataset-meta'

const BaseUrl = '/datasets'

const titles = [
  {
    title: 'Base Adresse Nationale (BAN)',
    href: BaseUrl + '/base-adresse-nationale',
    description: (
      <div>
        <span>Référence l’intégralité des adresses du territoire français</span>
      </div>
    ),
    meta: {
      producer: 'Partenariat BAN',
      updateFrequency: 'hebdomadaire',
      license: 'Licence gratuite de repartage / ODbL 1.0'
    },
    icon: <FaBook />
  },
  {
    title: 'Base Adresse Nationale Ouverte (BANO)',
    href: BaseUrl + '/base-adresse-nationale-ouverte',
    description: <span>Base de données composite, constituée à partir de différentes sources</span>,
    meta: {
      producer: 'OpenStreetMap France',
      updateFrequency: 'quotidienne',
      license: 'ODbL 1.0'
    },
    icon: <FaFolderOpenO />
  },
  {
    title: 'Bases Adresse locales (BAL)',
    href: BaseUrl + '/bases-adresse-locales',
    description: <span>[Ajouter une description]</span>,
    meta: {
      producer: 'Collectivités'
    },
    icon: <FaHome />
  }
]

const Datasets = () => (
  <Section>
    {titles.map(({title, href, description, meta, icon}) => (
      <div key={title}>
        <HeadLinkTitle
          key={title}
          title={title}
          href={href}
          subtitle={description}
          icon={icon} />
        <DatasetMeta {...meta} />
      </div>
      )
    )}
    <style jsx>{`
      .meta {
        display: grid;
        height: auto;
        min-height: 2em;
        grid-template-columns: repeat(3, 1fr);
        margin-left: 4em;
      }

      .meta span {
        margin-left: 1em;
        padding: 0.5em;
        border-radius: 3px;
        background-color: ${theme.backgroundGrey};
        color: ${theme.colors.almostBlack};
      }
      `}</style>
  </Section>
)

export default Datasets
