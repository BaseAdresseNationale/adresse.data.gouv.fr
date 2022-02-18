import {useState, useEffect} from 'react'
import Link from 'next/link'
import {orderBy} from 'lodash'

import events from '../../events.json'
import theme from '@/styles/theme'
import EventModal from './event-modal'

function sortEventsByDate(events, order) {
  return orderBy(events, [
    function (event) {
      return Date.parse(`${event.date}T${event.startHour}`)
    },
  ], [order])
}

function EventBanner() {
  const [index, setIndex] = useState(0)
  const [event, setEvent] = useState(null)

  const today = new Date().setHours(0, 0, 0, 0)
  const selectedFirstEvents = sortEventsByDate(events, 'asc').filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today).slice(0, 3)

  useEffect(() => {
    if (!event) {
      const slideInterval = setTimeout(() => {
        setIndex(index === selectedFirstEvents.length - 1 ? 0 : index + 1)
      }, 4000)

      return () => {
        clearInterval(slideInterval)
      }
    }
  }, [index, event, selectedFirstEvents])

  return (
    <div className='banner'>
      <div className='banner-title'>Les prochains évènements autour de l’adresse</div>
      <ul className='slider'>
        {selectedFirstEvents.length === 0 ? (
          <ul className='slide'>
            Aucun évènement n’est actuellement programmé. Retrouvez <Link href='/evenements' passHref><span className='event-link'>ici</span></Link> nos évènements passés.
          </ul>
        ) : (
          selectedFirstEvents.map((event, idx) => {
            const sanitizedDate = new Date(event.date).toLocaleDateString('fr-FR')
            return idx === index && (
              <li className='slide' key={`${event.title}-${sanitizedDate}`}>
                <div className='event-link' onClick={() => setEvent(event)}>{event.title}</div>
                <div className='date'>le {sanitizedDate}</div>
              </li>
            )
          })
        )}
      </ul>

      <div className='slideshow-dots'>
        {selectedFirstEvents.map((event, idx) => (
          <div
            key={`${event.title}-${event.date}`}
            className={`slideshow-dot ${index === idx ? 'active' : ''}`}
            onClick={() => setIndex(idx)}
          />
        ))}
      </div>
      {event && <EventModal event={event} date={new Date(event.date).toLocaleDateString('fr-FR')} onClose={() => setEvent(null)} />}

      <style jsx>{`
        .banner {
          background: ${theme.primary};
          padding: 5px;
          text-align: center;
          overflow: hidden;
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
        }

        .date {
          font-style: italic
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
        }

        .active {
          opacity: 100%;
        }

        .event-link {
          color: ${theme.colors.white};
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default EventBanner
