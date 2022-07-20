import {useState, useEffect} from 'react'
import {Pause, Play} from 'react-feather'

import {sortEventsByDate} from '@/lib/date'
import theme from '@/styles/theme'

import allEvents from '../../events.json'

import EventModal from './event-modal'
import ActionButtonNeutral from '@/components/action-button-neutral'

const today = new Date().setHours(0, 0, 0, 0)
const events = sortEventsByDate(allEvents, 'asc').filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today).slice(0, 3)

const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
const handleAccessibleDate = eventDate => {
  return new Date(eventDate).toLocaleDateString('fr-FR', options)
}

function EventBanner() {
  const [index, setIndex] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isAutoplay, setIsAutoplay] = useState(true)

  const sanitizedDate = selectedEvent && new Date(selectedEvent.date).toLocaleDateString('fr-FR')
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
  const accessibleDate = selectedEvent && new Date(selectedEvent.date).toLocaleDateString('fr-FR', options)

  useEffect(() => {
    if (!selectedEvent && isAutoplay) {
      const slideInterval = setTimeout(() => {
        setIndex(index === events.length - 1 ? 0 : index + 1)
      }, 3000)

      return () => {
        clearInterval(slideInterval)
      }
    }
  }, [index, selectedEvent, isAutoplay])

  if (events.length === 0) {
    return null
  }

  return (
    <div className='banner'>
      <div className='banner-title'>Les prochains évènements autour de l’adresse</div>
      <div className='slides-controls-container'>
        <div className='slideshow-dots'>
          <ActionButtonNeutral
            label={isAutoplay ? 'Le défilement est automatique. Mettre en pause le défilement.' : 'Le défilement est en pause. Lancer le défilement.'}
            onClick={() => setIsAutoplay(!isAutoplay)}
          >
            {isAutoplay ? <Pause size={18} color={theme.colors.white} /> : <Play size={18} color={theme.colors.white} />}
          </ActionButtonNeutral>
          <div>
            {events.map((event, idx) => (
              <ActionButtonNeutral
                label={`${index === idx ? 'Vous êtes sur la fiche de' : 'Allez à la fiche de'} l’évènement ${event.title} du ${accessibleDate}`}
                key={`${event.title}-${event.date}`}
                onClick={() => setIndex(idx)}
                disabled={index === idx}
              >
                <div className='slideshow-dot' />
              </ActionButtonNeutral>
            ))}
          </div>
        </div>
        <ul className='slider'>
          {events.map((event, idx) => {
            const sanitizedDate = new Date(event.date).toLocaleDateString('fr-FR')

            return (
              <li className={idx === index ? 'slide' : 'hidden'} key={`${event.title}-${sanitizedDate}`}>
                <ActionButtonNeutral label={`Afficher l’évènement ${event.title}`} onClick={() => setSelectedEvent(event)} isFullSize>
                  <div className='event-link'>
                    {event.title}
                  </div>
                </ActionButtonNeutral>
                {event.subtitle && <div className='subtitle'>{event.subtitle}</div>}
                <div className='date'>le {sanitizedDate}</div>
              </li>
            )
          }
          )}
        </ul>
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          sanitizedDate={sanitizedDate}
          accessibleDate={handleAccessibleDate(selectedEvent.date)}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <style jsx>{`
        .banner {
          background: ${theme.primary};
          text-align: center;
          display: grid;
          grid-template-rows: .5fr 1fr;
          gap: .5em;
          height: fit-content;
          align-items: center;
          color: ${theme.colors.white};
        }

        .banner-title {
          font-size: 18px;
          font-weight: bold;
        }

        .slides-controls-container {
          display: flex;
          gap: .5em;
          /* Accessibility: Use column-reverse to show slider controler on bottom (keep it above for the DOM) */
          flex-direction: column-reverse;
        }

        .slider {
          padding: 0;
          margin: 0;
        }

        .slide {
          display: grid;
          grid-template-rows: repeat(3, 1fr);
          justify-content: center;
          animation: fadeIn linear 1s;
        }

        .event-link {
          font-size: 16px;
          font-weight: bold;
          color: ${theme.colors.white};
          text-decoration: underline;
        }

        .subtitle {
          font-size: 15px;
          color: ${theme.colors.white};
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
          display: grid;
          grid-template-columns: 18px auto;
          justify-content: center;
        }

        .slideshow-dot {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background-color: ${theme.colors.white};
          margin: 5px;
        }

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default EventBanner
