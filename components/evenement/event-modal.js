import {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {XSquare, MapPin} from 'react-feather'

import theme from '@/styles/theme'

import ButtonLink from '../button-link'
import SectionText from '../section-text'
import Notification from '../notification'

const formatTag = tag => {
  tag.replace(/[^\w\s]/gi, ' ')

  return `#${tag.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

function EventModal({event, date, isPassed, onClose}) {
  const modalRef = useRef(null)

  const {title, address, description, href, tags, type, startHour, endHour, target, isOnlineOnly, instructions} = event
  const {nom, numero, voie, codePostal, commune} = address

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [onClose])

  return (
    <div className='modal-wrapper'>
      <div className='modal-container' ref={modalRef}>
        <div className='close-container'>
          <button type='button' onClick={onClose} className='close-button'>
            <XSquare />
          </button>
        </div>
        <div className='modal-content'>
          <div className={`left-content ${type}`}>
            <div className='left-title'>📅 &nbsp; À vos agendas !</div>
            <div className='date-hours-container'>
              <div className='date-container'>
                L’évènement aura lieu le
                <div className='date'>{date}</div>
              </div>
              <div className='date-container'>
                De
                <div className='date'>{`${startHour} à ${endHour}`}</div>
              </div>
            </div>
            {isOnlineOnly ? (
              <div className='place'><span>🖥️</span><br />{title} se déroulera en ligne</div>
            ) : (
              <div><MapPin strokeWidth={3} size={14} style={{marginRight: 5}} />{nom}, {numero} {voie} - {codePostal} {commune}</div>
            )}
            {!isPassed && (
              <div className='subscribe'>
                {instructions && (
                  <div className='instructions'>{instructions}</div>
                )}

                {href && (
                  <ButtonLink href={href} isExternal>
                    S’inscrire à l’évènement
                  </ButtonLink>
                )}
              </div>
            )}
          </div>
          <div className='right-content'>
            <div className='title-container'>
              <Image src={`/images/icons/event-${type}.svg`} height={60} width={60} />
              <div className='right-title'>{title}</div>
            </div>
            <SectionText>{description}</SectionText>
            <Notification><div className='target'>Cet événement est à destination {target ? `des ${target}` : 'de tous'}.</div></Notification>
            <div className='tags'>
              {tags.map(tag => <div key={tag}>&nbsp;{formatTag(tag)}</div>)}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-wrapper {
          height: 100vh;
          position: fixed;
          background: rgb(24, 24, 24, 0.7);
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-container {
          max-height: 90%;
          height: fit-content;
          width: 90%;
          padding: 1em;
          background: ${theme.colors.white};
          border-radius: ${theme.borderRadius};
          display: flex;
          flex-direction: column;
          overflow: auto;
        }

        .date-container, .date, .instructions, .left-title, .right-title{
          font-weight: bold;
        }

        .close-container {
          border-bottom: 2px solid ${theme.primary};
          text-align: right;
        }

        .close-button {
          color: ${theme.primary};
          background: transparent;
          border: none;
        }

        .modal-content {
          display: flex;
          gap: 1em;
          margin-top: 1em;
          flex-wrap: wrap-reverse;
        }

        .left-content, .right-content {
          min-width: 260px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          border-radius: ${theme.borderRadius};
          padding: 1em;
          gap: 1em;
          text-align: center;
        }

        .date-container {
          font-size: 16px;
          margin-bottom: 1em;
        }

        .date {
          font-size: 22px;
        }

        .place {
          font-size: 16px;
          font-style: italic;
        }

        .place span {
          font-style: normal;
          font-size: 2em;
        }

        .title-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1em;
          flex-wrap: wrap;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          color: ${theme.primary};
          font-style: italic;
          font-size: 14px;
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

        .left-title {
          font-size: 1.5em;
        }

        .right-title {
          font-size: 2em;
        }
      `}</style>
    </div>
  )
}

EventModal.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    address: PropTypes.object,
    description: PropTypes.string,
    href: PropTypes.string,
    tags: PropTypes.array,
    type: PropTypes.string,
    startHour: PropTypes.string,
    endHour: PropTypes.string,
    target: PropTypes.string,
    isOnlineOnly: PropTypes.bool,
    instructions: PropTypes.string,
  }).isRequired,
  date: PropTypes.string.isRequired,
  isPassed: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}
export default EventModal
