import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/legacy/image'

import {dateWithDay} from '@/lib/date'
import {removeAccents} from '@/lib/format-strings'

import theme from '@/styles/theme'

import Button from '../button'
import EventModal from './event-modal'

function Event({event, background, isPassed}) {
  const {title, subtitle, address, date, type, startHour, endHour, isOnlineOnly} = event
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='event-container'>
      <div className={`header ${removeAccents(type)}`}>
        <div className='presentation-wrapper'>
          <Image src={`/images/icons/event-${removeAccents(type)}.svg`} height={50} width={50} alt='' aria-hidden='true' />
          <div className='title-container'>
            <h5>{title}</h5>
            <div>{subtitle}</div>
          </div>
        </div>

        <div className='date-location-container'>
          <div className='date' aria-label={`le ${dateWithDay(date)}, de ${startHour} à ${endHour}`}>
            {`le ${dateWithDay(date)} | ${startHour}-${endHour}`}
          </div>
          {isOnlineOnly ? (
            <div className='location'>Évènement en ligne</div>
          ) : (
            address &&
              <div className='location'>
                {address.nom}, {address.numero} {address.voie} <br /> {address.codePostal} {address.commune}
              </div>
          )}
        </div>
      </div>

      <div className='open-modal'>
        <Button onClick={() => setIsModalOpen(true)}>Afficher les informations</Button>
      </div>

      {isModalOpen && <EventModal event={event} onClose={() => setIsModalOpen(false)} isPassed={isPassed} />}

      <style jsx>{`
        {/* Avoid opacity heritance on modal */}
        .header, .open-modal {
          opacity: ${isPassed ? '60%' : '100%'};
        }

        .event-container {
          display: grid;
          grid-template-rows: 1fr 100px;
          width: 320px;
          min-height: 320px;
          background: ${background === 'secondary' ? theme.colors.white : theme.colors.lighterGrey};
          border-radius: 5px;
        }

        .header {
          color: ${theme.colors.white};
          border-radius: 5px 5px 0 0;
          padding: 1em;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .presentation-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }

        .title-container div {
          font-style: italic;
          font-size: 14px;
        }

        .title-container h5 {
          margin: 0;
          font-size: 15px;
        }

        .date-location-container {
          text-align: center;
        }

        .date {
          font-weight: bold;
        }

        .location {
          font-size: 14px;
          text-align: center;
        }

        .open-modal {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .adresselab {
         background: ${theme.colors.red};
        }

        .formation {
          background: ${theme.colors.darkGreen};
        }

        .formation-lvl2 {
          background: ${theme.colors.green};
        }

        .presentation {
          background: rgb(26, 168, 255);
        }

        .partenaire {
          background: ${theme.colors.blue};
        }

        .adresse-region {
          background: ${theme.colors.purple};
        }
      `}</style>
    </div>
  )
}

Event.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    address: PropTypes.object,
    date: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    startHour: PropTypes.string.isRequired,
    endHour: PropTypes.string.isRequired,
    isOnlineOnly: PropTypes.bool.isRequired,
  }).isRequired,
  background: PropTypes.oneOf([
    '',
    'secondary'
  ]),
  isPassed: PropTypes.bool
}

Event.defaultProps = {
  background: '',
  isPassed: false
}

export default Event
