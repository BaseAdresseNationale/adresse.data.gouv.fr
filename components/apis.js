import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import {Map, Terminal, Folder} from 'react-feather'

import theme from '@/styles/theme'

import Section from './section'

const titles = [
  {
    title: 'L’API Adresse',
    href: '/api-doc/adresse',
    description: <span>Géocodez vos adresses grâce à l’API en ligne…</span>,
    icon: <Terminal />
  },
  {
    title: 'L’API Base Adresse Locale',
    href: 'https://github.com/etalab/api-bal/wiki/Documentation-de-l\'API',
    description: <span>API de gestion de Bases Adresses à l’échelon local</span>,
    icon: <Map />
  },
  {
    title: 'l’API de dépôt',
    href: 'https://github.com/etalab/ban-api-depot/wiki/Documentation',
    description: <span>API de soumission de Bases Adresses Locale de périmètre communal</span>,
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
