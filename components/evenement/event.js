import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {MapPin} from 'react-feather'

import theme from '@/styles/theme'

import Button from '../button'
import EventModal from './event-modal'

function Event({event, background, isPassed, id}) {
  const {title, address, date, type, startHour, endHour, isOnlineOnly} = event
  const {nom, numero, voie, codePostal, commune} = address

  const sanitizedDate = new Date(date).toLocaleDateString('fr-FR')

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div id={id} className='event-container'>
      <div className='event-top-infos'>
        <div className={`header ${type}`}>
          <Image src={`/images/icons/event-${type}.svg`} height={50} width={50} />
        </div>
        <div className='general-infos'>
          <h5>{title}</h5>
          <div className='date-container'>
            <div className='date'>{`le ${sanitizedDate}, de ${startHour} à ${endHour}`}</div>
          </div>

          {isOnlineOnly ? (
            <div>🖥️ <br />Évènement en ligne</div>
          ) : (
            <div><MapPin strokeWidth={3} size={14} style={{marginRight: 5}} />{nom}, {numero} {voie} - {codePostal} {commune}</div>
          )}
        </div>

        <div className='display-info-container'>
          <Button onClick={() => setIsModalOpen(true)}>Afficher les informations</Button>
        </div>
      </div>

      {isModalOpen && <EventModal event={event} date={sanitizedDate} isPassed={isPassed} onClose={() => setIsModalOpen(false)} />}

      <style jsx>{`
        .event-container, .general-infos, .event-bottom-infos {
          display: flex;
          flex-direction: column;
        }

        .event-container {
          width: 320px;
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

        .date {
          font-weight: bold;
          color: ${theme.primary};
        }

        .display-info-container {
          text-align: center;
          padding-bottom: 1em;
        }
      `}</style>
    </div>
  )
}

Event.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    address: PropTypes.object,
    date: PropTypes.string,
    type: PropTypes.string,
    startHour: PropTypes.string,
    endHour: PropTypes.string,
    isOnlineOnly: PropTypes.bool,
  }).isRequired,
  id: PropTypes.string.isRequired,
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
