import PropTypes from 'prop-types'
import Link from 'next/link'

import {Map, Terminal, Folder} from 'react-feather'

import theme from '@/styles/theme'

import Section from './section'

const titles = [
  {
    title: 'API Adresse',
    href: '/api-doc/adresse',
    description: <span>Rechercher ou normaliser des adresses à l’unité ou en lot. Géocodage direct ou inversé.</span>,
    icon: <Terminal />
  },
  {
    title: 'API Gestion d’une Base Adresse Locale',
    href: 'https://github.com/etalab/api-bal/wiki/Documentation-de-l\'API',
    description: <span>API permettant de créer une Base Adresse Locale et d’en gérer les adresses. Utilisée par <a href='https://mes-adresses.data.gouv.fr'>mes-adresses.data.gouv.fr</a>.</span>,
    icon: <Map />
  },
  {
    title: 'API Dépôt d’une Base Adresse Locale',
    href: 'https://github.com/etalab/ban-api-depot/wiki/Documentation',
    description: <span>API permettant de soumettre une Base Adresse Locale à la Base Adresse Nationale. Gestion des habilitations.</span>,
    icon: <Folder />
  }
]

const apiStyle = {
  display: 'inline-grid',
  textDecoration: 'none',
  color: '#26353f'
}

function Api({title, icon, description, href}) {
  return (
    <Link href={href}>
      <a style={apiStyle}>
        <div className='article__author panel'>
          <div className='article__author-info'>
            <div className='article__author-name'>{title}</div>
            <div className='article__author-role'>Etalab</div>
          </div>
          <div className='article__author-img'>{icon}</div>
          <p className='article__author-description'>{description}</p>
          <style jsx>{`
            .article__author {
              min-width: 300px;
              min-height: 160px;
            }

            .article__author:hover {
              cursor: pointer;
              border-color: ${theme.primary};
            }

            .article__author-img {
              display: inline-block;
              float: right;
              font-size: x-large;
            }
        `}</style>
        </div>
      </a>
    </Link>
  )
}

Api.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired
}

function Apis() {
  return (
    <Section>
      <div className='grid'>
        {titles.map(({title, href, description, icon}) => (
          <Api
            key={title}
            title={title}
            href={href}
            description={description}
            icon={icon}
          />
        ))}
      </div>
    </Section>
  )
}

export default Apis
