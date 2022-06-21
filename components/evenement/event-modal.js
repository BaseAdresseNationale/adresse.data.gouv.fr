import {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {XSquare, MapPin} from 'react-feather'

import theme from '@/styles/theme'

import {formatTag} from '@/lib/tag'

import ButtonLink from '../button-link'
import SectionText from '../section-text'
import Notification from '../notification'

function EventModal({event, sanitizedDate, accessibleDate, isPassed, onClose}) {
  const modalRef = useRef(null)

  const {title, subtitle, address, description, href, isSubscriptionClosed, tags, type, startHour, endHour, target, isOnlineOnly, instructions} = event
  const {nom, numero, voie, codePostal, commune} = address

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
          <button type='button' onClick={onClose} aria-label='Fermer la fenêtre' className='close-button'>
            <XSquare />
          </button>
        </div>
        <div className='modal-content'>
          <div className={`left-content ${type}`}>
            <div className='left-title'>📅 &nbsp; À vos agendas !</div>
            <div className='date-hours-container'>
              <div className='date-container'>
                L’évènement {isPassed ? 'a eu' : 'aura'} lieu le
                <div className='date' aria-label={accessibleDate}>{sanitizedDate}</div>
              </div>
              <div className='date-container'>
                De
                <div className='date'>{`${startHour} à ${endHour}`}</div>
              </div>
            </div>
            {isOnlineOnly ? (
              <div className='place'><span>🖥️</span><br />{`${title} ${isPassed ? 's’est déroulé en ligne' : 'se déroulera en ligne'}`}</div>
            ) : (
              <div><MapPin strokeWidth={3} size={14} style={{marginRight: 5}} />{nom}, {numero} {voie} - {codePostal} {commune}</div>
            )}

            {!isPassed && (
              <div className='subscribe'>
                {isSubscriptionClosed ? (
                  <div className='instructions'>Inscriptions closes</div>
                ) : (
                  instructions && (
                    <div className='instructions'>{instructions}</div>
                  )
                )}

                {(href && !isSubscriptionClosed) && (
                  <ButtonLink href={href} isExternal>
                    S’inscrire à l’évènement
                  </ButtonLink>
                )}
              </div>
            )}
          </div>
          <div className='right-content'>
            <div className='head-container'>
              <Image src={`/images/icons/event-${type}.svg`} height={60} width={60} />
              <div className='title-container'>
                <div className='right-title'>{title}</div>
                <div>{subtitle}</div>
              </div>
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
          max-width: 90%;
          width: 950px;
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
          border-bottom: ${`2px solid ${type === 'partenaire' ? theme.colors.blue : (type === 'formation' ? theme.colors.darkGreen : theme.colors.red)}`};
          text-align: right;
        }

        .close-button {
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

        .head-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1em;
          flex-wrap: wrap;
        }

        .title-container {
          text-align: ${subtitle ? 'start' : 'center'};
          line-height: ${subtitle ? '30' : '35'}px;
        }

        .title-container div:nth-child(2) {
          font-size: 18px;
          margin-top: 10px;
          font-style: italic;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          color: ${theme.primary};
          font-style: italic;
          font-size: 14px;
        }

        .adresselab {
          background: ${theme.colors.lightRed};
        }

        .formation {
          background: ${theme.colors.lightGreen};
        }

        .partenaire {
          background: ${theme.colors.lighterBlue};
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
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    address: PropTypes.object,
    description: PropTypes.string.isRequired,
    href: PropTypes.string,
    isSubscriptionClosed: PropTypes.bool,
    tags: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    startHour: PropTypes.string.isRequired,
    endHour: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    isOnlineOnly: PropTypes.bool.isRequired,
    instructions: PropTypes.string,
  }).isRequired,
  sanitizedDate: PropTypes.string.isRequired,
  accessibleDate: PropTypes.string.isRequired,
  isPassed: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default EventModal
