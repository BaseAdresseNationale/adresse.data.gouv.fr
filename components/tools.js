import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import FaTable from 'react-icons/lib/fa/table'
import FaTerminal from 'react-icons/lib/fa/terminal'
import FaMap from 'react-icons/lib/fa/map'

import theme from '../styles/theme'

import Section from './section'

const titles = [
  {
    title: 'Carte interactive',
    href: '/map',
    description: <span>Cherchez des adresses et lieux-dits.</span>,
    icon: <FaMap />
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
  },
  {
    title: 'Le validateur BAL',
    href: '/bases-locales/validateur',
    description: <span>Vérifier la conformité de votre fichier Base Adresse Locale.</span>,
    icon: <FaTable />
  }
]

const Tool = ({title, icon, description, href}) => {
  return (
    <Link href={href}>
      <div className='article__author panel'>
        <div className='article__author-info'>
          <div className='article__author-name'>{title}</div>
          <div className='article__author-role'>Etalab</div>
        </div>
        <div className='article__author-img'>{icon}</div>
        <p className='article__author-description'>{description}</p>
        <style jsx>{`
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
    </Link>
  )
}

Tool.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired
}

const Tools = () => (
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

export default Tools
