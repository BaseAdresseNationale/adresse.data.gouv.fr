import PropTypes from 'prop-types'
import Link from 'next/link'

import {Map, Terminal, FileText, UserCheck} from 'react-feather'

import theme from '@/styles/theme'

import Section from './section'

const titles = [
  {
    title: 'L’explorateur BAN',
    href: '/base-adresse-nationale',
    description: <span>Cherchez des adresses dans la Base Adresse Nationale.</span>,
    icon: <Map />
  },
  {
    title: 'Le géocodeur CSV',
    href: '/csv',
    description: <span>Uploadez un fichier CSV, définissez les colonnes à utiliser pour le géocodage…</span>,
    icon: <FileText />
  },
  {
    title: 'Les API',
    href: '/api-doc',
    description: <span>Découvrez l’API Adresse, l’API Base Adresse Locale et l’API de dépôt...</span>,
    icon: <Terminal />
  },
  {
    title: 'Le validateur BAL',
    href: '/bases-locales/validateur',
    description: <span>Vérifier la conformité de votre fichier Base Adresse Locale.</span>,
    icon: <UserCheck />
  }
]

const toolStyle = {
  display: 'inline-grid',
  textDecoration: 'none',
  color: '#26353f'
}

function Tool({title, icon, description, href}) {
  return (
    <Link href={href}>
      <a style={toolStyle}>
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

Tool.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired
}

function Tools() {
  return (
    <Section>
      <div className='grid'>
        {titles.map(({title, href, description, icon}) => (
          <Tool
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

export default Tools
