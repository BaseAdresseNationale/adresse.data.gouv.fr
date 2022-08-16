import {useState, useEffect} from 'react'

import {sortEventsByDate} from '@/lib/date'
import theme from '@/styles/theme'

import allEvents from '../../events.json'

import EventModal from './event-modal'
import ActionButtonNeutral from '@/components/action-button-neutral'

const today = new Date().setHours(0, 0, 0, 0)
const events = sortEventsByDate(allEvents, 'asc').filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today).slice(0, 3)

function EventBanner() {
  const [index, setIndex] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const sanitizedDate = selectedEvent && new Date(selectedEvent.date).toLocaleDateString('fr-FR')
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
  const accessibleDate = selectedEvent && new Date(selectedEvent.date).toLocaleDateString('fr-FR', options)

  useEffect(() => {
    if (!selectedEvent) {
      const slideInterval = setTimeout(() => {
        setIndex(index === events.length - 1 ? 0 : index + 1)
      }, 4000)

      return () => {
        clearInterval(slideInterval)
      }
    }
  }, [index, selectedEvent])

  if (events.length === 0) {
    return null
  }

  return (
    <div className='banner'>
      <div className='banner-title'>Les prochains évènements autour de l’adresse</div>
      <ul className='slider'>
        {events.map((event, idx) => {
          const sanitizedDate = new Date(event.date).toLocaleDateString('fr-FR')

          return (
            <li className={idx === index ? 'slide' : 'hidden'} key={`${event.title}-${sanitizedDate}`}>
              <ActionButtonNeutral label={`Afficher l’évènement ${event.title}`} onClick={() => setSelectedEvent(event)}>
                <div className='event-link'>
                  {event.title}
                </div>
              </ActionButtonNeutral>
              {event.subtitle && <div>{event.subtitle}</div>}
              <div className='date'>le {sanitizedDate}</div>
            </li>
          )
        }
        )}
      </ul>

      <div className='slideshow-dots'>
        {events.map((event, idx) => (
          <ActionButtonNeutral
            label={`${index === idx ? 'Vous êtes sur la fiche de' : 'Allez à la fiche de'} l’évènement ${event.title} du ${accessibleDate}`}
            key={`${event.title}-${event.date}`}
            onClick={() => setIndex(idx)}
          >
            <div className={`slideshow-dot ${index === idx ? 'active' : ''}`} />
          </ActionButtonNeutral>
        ))}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          sanitizedDate={sanitizedDate}
          accessibleDate={accessibleDate}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <style jsx>{`
        .banner {
          background: ${theme.primary};
          padding: 5px;
          text-align: center;
          overflow: hidden;
          display: grid;
          grid-template-rows: auto 60px auto;
          height: 165px;
          align-items: center;
        }

        .banner-title {
          font-size: 20px;
          margin-bottom: 5px;
          font-weight: bold;
          color: ${theme.colors.white};
        }

        .slider {
          white-space: nowrap;
          text-align: center;
          padding: 0;
          margin: 0;
          color: ${theme.colors.white};
        }

        .slide {
          text-align: center;
          display: inline-block;
          animation: fadeIn linear 1s;
        }

        .event-link {
          font-size: 16px;
          font-weight: bold;
          text-align: center;
        }

        .date {
          font-style: italic;
        }

        @keyframes fadeIn {
          0% {opacity:0;}
          100% {opacity:1;}
        }

          /* Buttons */
        .slideshow-dots {
          text-align: center;
        }

        .slideshow-dot {
          display: inline-block;
          height: 7px;
          width: 7px;
          border-radius: 50%;
          cursor: pointer;
          margin: 15px 7px 0px;
          background-color: ${theme.colors.white};
          opacity: 50%;
          padding: 0;
          border: none;
        }

        .active {
          opacity: 100%;
        }

        .event-link {
          color: ${theme.colors.white};
          cursor: pointer;
          text-decoration: underline;
        }

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default EventBanner
