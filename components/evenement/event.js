import PropTypes from 'prop-types'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {MapPin, ChevronDown, ChevronRight} from 'react-feather'

import theme from '@/styles/theme'

import ButtonLink from '../button-link'
const AddToCalendar = dynamic(import('./add-to-calendar'), {ssr: false}) // eslint-disable-line node/no-unsupported-features/es-syntax

const formatTag = tag => {
  tag.replace(/[^\w\s]/gi, ' ')

  return `#${tag.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

function Event({event, background, isPassed, id, activeEvent, setActiveEvent}) {
  const {titre, adresse, description, date, href, tags, type, heureDebut, heureFin, cible, isOnlineOnly, instructions} = event
  const {nom, numero, voie, codePostal, commune} = adresse

  const sanitizedDate = new Date(date).toLocaleDateString('fr-FR')
  const isEventOpen = activeEvent === id || activeEvent === null

  return (
    <div id={id} className='event-container'>
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
          <button type='button' onClick={() => setActiveEvent(activeEvent === id ? null : id)} className='button-container'>
            {activeEvent === id ? (
              <p>Masquer les informations</p>
            ) : (
              <p>Afficher les informations</p>
            )}
            <div className='chevron'>
              {activeEvent === id ? (
                <ChevronDown size={18} color={`${theme.colors.lightBlue}`} />
              ) : (
                <ChevronRight size={18} color={`${theme.colors.lightBlue}`} />
              )}
            </div>
          </button>
        </div>
      </div>

      <div className={activeEvent === id ? 'event-bottom-infos' : 'hidden'}>
        {cible ? (
          <div className='cible'>Cet événement est à destination des {cible}.</div>
        ) : (
          <div className='cible'>Cet événement est à destination de tous.</div>
        )}

        <p>
          {description}
        </p>

        {!isPassed && instructions && (
          <div className='instructions'>{instructions}</div>
        )}

        <div className='tags'>
          {tags.map(tag => <div key={tag}>&nbsp;{formatTag(tag)}</div>)}
        </div>

        {!isPassed && href && (
          <div className='subscribe'>
            <ButtonLink href={href} isExternal>
              S’inscrire à l’évènement
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
          width: 260px;
          height: fit-content;
          background: ${background === 'grey' ? theme.colors.white : theme.colors.lighterGrey};
          border-radius: ${theme.borderRadius};
          font-size: 14px;
          position: relative;
          z-index: ${activeEvent === id ? 1 : ''};
          filter:${isEventOpen ? '' : 'blur(2px)'};
          position: relative;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          text-align: center;
        }

        .adresselab {
          background: ${theme.colors.lightPink};
        }

        .formation {
          background: ${theme.colors.lightEmeraude};
        }

        .partenaire {
          background: ${theme.colors.lightCyan};
        }

        .general-infos {
          padding: 1em;
          text-align: center;
          gap: 1em;
        }

        h5 {
          font-size: 13px;
          margin: 0;
        }

        .date-container {
          pointer-events: ${isEventOpen ? '' : 'none'}
        }

        .date {
          font-weight: bold;
          color: ${theme.primary};
        }

        .event-bottom-infos {
          gap: 5px;
          padding: 0 1em 10px 1em;
          position: absolute;
          top: 100%;
          background: ${background === 'grey' ? theme.colors.white : theme.colors.lighterGrey};
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
          font-size: 12px;
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

        p {
          font-size: 11px;
        }

        .instructions {
          font-weight: bold;
          font-size: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  setActiveEvent: PropTypes.func.isRequired,
  activeEvent: PropTypes.string,
  background: PropTypes.oneOf([
    'white',
    'grey'
  ]),
  isPassed: PropTypes.bool
}

Event.defaultProps = {
  background: 'white',
  isPassed: false,
  activeEvent: null
}

export default Event
