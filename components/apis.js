import PropTypes from 'prop-types'
import Link from 'next/link'
import {BookOpen, GitHub} from 'react-feather'

import theme from '@/styles/theme'

import Section from './section'

function Api({title, href, description, github, documentation}) {
  return (
    <div className='api-container'>
      <div className='description-container'>
        <Link href={href}>
          <a>{title}</a>
        </Link>

        <p>{description}</p>
      </div>
      <div className='links-container'>
        <Link href={github}>
          <a className={github.length === 0 ? 'disable' : ''}>
            <GitHub size={38} color={theme.colors.white} />
          </a>
        </Link>

        <Link href={documentation}>
          <a className={documentation.length === 0 ? 'disable' : ''}>
            <BookOpen size={38} color={theme.colors.white} />
          </a>
        </Link>
      </div>

      <style jsx>{`
        .api-container {
          background: ${theme.colors.white};
          border-radius: ${theme.borderRadius};
          border: solid 1px ${theme.border};
          padding: 1em;
          display: grid;
          height: 290px;
          grid-template-rows: 1fr auto;
        }

        .description-container {
          border-bottom: solid 3px ${theme.borderSeparator};
          text-align: center;
        }

        .description-container a {
          font-size: 20px;
          color: ${theme.darkText};
          font-weight: bold;
        }

        .description-container p {
          padding-top: 2em;
          text-align: left;
          font-size: 15px;
        }

        .links-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding-top: 1em;
        }

        .links-container a {
          height: 60px;
          width: 60px;
          border-radius: 50%;
          background: ${theme.colors.almostBlack};
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .disable {
          opacity: 30%;
          pointer-events: none;
        }
    `}</style>
    </div>
  )
}

Api.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  github: PropTypes.string,
  documentation: PropTypes.string
}

function Apis({apis}) {
  const {userApis, creatorApis, communityApis} = apis

  return (
    <>
      <Section title='Outils pour les utilisateurs de la Base Adresse Nationale'>
        <div className='apis-container'>
          {userApis.map(api => <Api key={api.name} {...api} />)}
        </div>
      </Section>

      <Section title='Outils pour les producteurs de la Base Adresse Locale' background='grey'>
        <div className='apis-container'>
          {creatorApis.map(api => <Api key={api.name} {...api} />)}
        </div>
      </Section>

      <Section title='Outils développés par la communauté'>
        <div className='apis-container'>
          {communityApis.map(api => <Api key={api.name} {...api} />)}
        </div>
      </Section>

      <style jsx>{`
        .apis-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 4em;
          padding: 2em 0;
        }
      `}</style>
    </>
  )
}

Apis.propTypes = {
  apis: PropTypes.object.isRequired
}

export default Apis
