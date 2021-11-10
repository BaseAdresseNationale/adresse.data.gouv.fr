import PropTypes from 'prop-types'
import Link from 'next/link'
import {HelpCircle} from 'react-feather'

import theme from '@/styles/theme'

import Section from './section'
import Notification from '@/components/notification'
import ButtonLink from './button-link'

function Api({title, description, links}) {
  return (
    <div className='api-container'>
      <div className='description-container'>
        <div>{title}</div>
        <p>{description}</p>
      </div>
      <ul>
        {links.map(link => {
          return (
            <li key={link.title} className={link.href.length === 0 ? 'disable' : ''}>
              <Link href={link.href}>
                <a>
                  {link.title}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>

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
          color: ${theme.darkText};
        }

        .description-container div {
          font-size: 20px;
          font-weight: bold;
        }

        .description-container p {
          text-align: left;
          font-size: 15px;
        }

        ul {
          display: flex;
          flex-direction: column;
          font-weight: bold;
          color: ${theme.primary};
          gap: 10px;
        }

        a {
          color: ${theme.darkText};
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
  links: PropTypes.array.isRequired
}

function Apis({apis}) {
  const {userApis, creatorApis, communityApis} = apis
  const notificationStyle = {
    margin: '2em 0 -1em 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1em'
  }

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

        <Notification style={notificationStyle}>
          <div className='notification-text'>
            <HelpCircle style={{verticalAlign: 'bottom', marginRight: '4px'}} />
            Vous avez créé un <b>outil libre</b> et <b>Open Source</b> qui intègre les données de la <b>BAN</b> et souhaitez être référencé sur cette page ?
          </div>
          <ButtonLink size='small' href='/nous-contacter'>Contactez-nous !</ButtonLink>
        </Notification>
      </Section>

      <style jsx>{`
        .apis-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 4em;
          padding: 2em 0;
        }

        .notification-text {
          text-align: center;
        }
      `}</style>
    </>
  )
}

Apis.propTypes = {
  apis: PropTypes.object.isRequired
}

export default Apis
