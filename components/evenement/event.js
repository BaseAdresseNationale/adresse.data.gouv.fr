import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {MapPin, ChevronDown, ChevronRight} from 'react-feather'

import theme from '@/styles/theme'

import ButtonLink from '../button-link'
import SectionText from '../section-text'
const AddToCalendar = dynamic(import('./add-to-calendar'), {ssr: false}) // eslint-disable-line node/no-unsupported-features/es-syntax

const formatTag = tag => {
  if (tag.includes('’')) {
    tag = tag.replace('’', ' ')
  }

  return `#${tag.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

function Event({event, background, isPassed}) {
  const {titre, adresse, description, date, href, tags, type, heureDebut, heureFin, cible, isOnlineOnly} = event
  const {nom, numero, voie, codePostal, commune} = adresse

  const [isDisplay, setIsDisplay] = useState(false)

  const sanitizedDate = new Date(date).toLocaleDateString('fr-FR')

  return (
    <div className='event-container'>
      <div className='event-top-infos'>
        <div className={`header ${type}`}>
          <Image src={`/images/icons/event-${type}.svg`} height={50} width={50} />
        </div>
        <div className='general-infos'>
          <h5>{titre}</h5>
          <div className='date-container'>
            <div className='date'>{`le ${sanitizedDate}, de ${heureDebut} à ${heureFin}`}</div>
            {!isPassed && <AddToCalendar eventData={event} />}
          </div>

          {isOnlineOnly ? (
            <div>🖥️ <br />Évènement en ligne</div>
          ) : (
            <div><MapPin strokeWidth={3} size={14} style={{marginRight: 5}} />{nom}, {numero} {voie} - {codePostal} {commune}</div>
          )}
        </div>

        <div className='display-info-container'>
          <button type='button' onClick={() => setIsDisplay(!isDisplay)} className='button-container'>
            {isDisplay ? (
              <p>Masquer les informations</p>
            ) : (
              <p>Afficher les informations</p>
            )}
            <div className='chevron'>
              {isDisplay ? (
                <ChevronDown size={18} color={`${theme.colors.lightBlue}`} />
              ) : (
                <ChevronRight size={18} color={`${theme.colors.lightBlue}`} />
              )}
            </div>
          </button>
        </div>
      </div>

      <div className={isDisplay ? 'event-bottom-infos' : 'hidden'}>
        {cible ? (
          <div className='cible'>Cet événement est à destination des {cible}.</div>
        ) : (
          <div className='cible'>Cet événement est à destination de tous.</div>
        )}

        <SectionText>{description}</SectionText>

        <div className='tags'>
          {tags.map(tag => <div key={tag}>&nbsp;{formatTag(tag)}</div>)}
        </div>

        {!isPassed && (
          <div className={`subscribe ${href ? '' : 'disable'}`}>
            <ButtonLink href={href} isExternal>
              {href ? 'S’inscrire à l’évènement' : 'Inscription bientôt disponible'}
            </ButtonLink>
          </div>
        )}
      </div>

      <style jsx>{`
        .event-container, .general-infos, .event-bottom-infos {
          display: flex;
          flex-direction: column;
        }

        .event-container {
          height: fit-content;
          background: ${background === 'grey' ? theme.colors.white : theme.colors.lighterGrey};
          border-radius: ${theme.borderRadius};
          font-size: 14px;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          text-align: center;
        }

        .adresselab {
          background: #c6b2ff;
        }

        .formation {
          background: #a4ffa4;
        }

        .partenaire {
          background: #a8eaff;
        }

        .general-infos {
          padding: 1em;
          text-align: center;
          gap: 1em;
        }

        h5 {
          font-size: 18px;
          margin: 0;
        }

        .date {
          font-weight: bold;
          color: ${theme.primary};
        }

        .event-bottom-infos {
          gap: 5px;
          padding: 0 1em 10px 1em;
        }

        .display-info-container {
          width: 100%;
          display: grid;
          padding: 10px 1em;
        }

        .display-info-container p {
          font-style: italic;
          font-weight: lighter;
          margin: 0;
        }

        .button-container {
          display: grid;
          grid-template-columns: 1fr 0.1fr;
          align-items: center;
          justify-items: self-start;
          border-style: none;
          background-color: transparent;
          border-bottom: 2px solid ${theme.colors.lightBlue};
          box-shadow: 0px 14px 21px -15px ${theme.boxShadow};
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          color: ${theme.primary};
          font-style: italic;
        }

        .subscribe {
          text-align: center;
        }

        .cible {
          font-weight: bold;
          font-style: italic;
          font-size: 12px;
        }

        .hidden {
          display: none;
        }

        .disable {
          opacity: 50%;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  background: PropTypes.oneOf([
    'white',
    'grey'
  ]),
  isPassed: PropTypes.bool
}

Event.defaultProps = {
  background: 'white',
  isPassed: false
}

export default Event
