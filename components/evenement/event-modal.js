import {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {MapPin, XCircle, Target} from 'react-feather'

import theme from '@/styles/theme'

import {formatTag} from '@/lib/tag'
import {dateWithDay} from '@/lib/date'

import ButtonLink from '@/components/button-link'
import SectionText from '@/components/section-text'
import ActionButtonNeutral from '@/components/action-button-neutral'

function EventModal({event, isPassed, onClose}) {
  const modalRef = useRef(null)

  const {title, subtitle, address, description, href, date, isSubscriptionClosed, tags, type, startHour, endHour, target, isOnlineOnly, instructions} = event
  const {nom, numero, voie, codePostal, commune} = address
  const isSubscriptionBlocked = isSubscriptionClosed || isPassed

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
      <div className='modal' ref={modalRef}>
        <div className={`header ${type}-backg`}>
          <ActionButtonNeutral label='Fermer la fenêtre'>
            <XCircle onClick={onClose} color={theme.colors.white} />
          </ActionButtonNeutral>

          <div className='presentation'>
            <Image src={`/images/icons/event-${type}.svg`} height={150} width={170} alt aria-hidden='true' />
            <div className='header-infos'>
              <div className='title-container'>
                <h5>{title}</h5>
                <div>{subtitle}</div>
              </div>

              <div>
                <div className='date' aria-label={`le ${dateWithDay(date)}, de ${startHour} à ${endHour}`}>{`Le ${dateWithDay(date)} | ${startHour}-${endHour}`}</div>
                {!isOnlineOnly && <div className='location'><MapPin size={15} /> {nom}, {numero} {voie} <br /> {codePostal} {commune}</div>}
                {isOnlineOnly && (
                  href ? (
                    <div className={isSubscriptionBlocked ? 'subscription-closed' : ''}>
                      <ButtonLink size='small' color='white' isOutlined href={href} isExternal>{isSubscriptionBlocked ? 'Inscriptions closes' : 'S’inscrire à l’évènement' }</ButtonLink>
                    </div>
                  ) : (
                    <div>{isSubscriptionBlocked ? 'Inscriptions closes' : instructions}</div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='description-container'>
          <SectionText>{description}</SectionText>
          <div className='target'><div className='target-icon'><Target size={24} /></div> Cet événement est à destination {target ? `des ${target}` : 'de tous'}.</div>
          <div className='tags'>{tags.map(tag => <div key={tag} className={`${type}-txt`}>&nbsp;{formatTag(tag)}</div>)}</div>
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

        .modal, .header-infos, .presentation, .target, .tags {
          display: flex;
        }

        .modal {
          padding: 0;
          border-radius: 5px;
          max-height: 90%;
          max-width: 90%;
          width: 800px;
          height: fit-content;
          flex-direction: column;
          overflow: auto;
        }

        .header {
          padding: 1em;
          color: ${theme.colors.white};
          border-radius: 5px 5px 0 0;
          text-align: right;
        }

        .header-infos {
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2em;
        }

        .date {
          font-size: large;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .subscription-closed {
          pointer-events: none;
          opacity: 70%;
        }

        .presentation {
          gap: 2em;
          justify-content: space-between;
          margin-top: .5em;
          border-top: .5px solid white;
          padding: 1.5em 2em 0 2em;
        }

        .title-container h5 {
          font-size: x-large;
          margin: 0;
        }

        .description-container {
          padding: 1em;
        }

        .close {
          width: 100%;
          text-align: right;
        }

        .target {
          font-weight: bold;
          font-size: large;
          gap: 5px;
          justify-content: center;
          align-items: center;
          margin-bottom: 1em;
        }

        .target-icon {
          height: 24px;
        }

        .tags {
          font-style: italic;
          gap: .5em;
          flex-wrap: wrap;
        }

        .adresselab-backg {
         background: ${theme.colors.red};
        }

        .formation-backg {
          background: ${theme.colors.darkGreen};
        }

        .partenaire-backg {
          background: ${theme.colors.blue};
        }

        .adresse-region-backg {
          background: ${theme.colors.purple};
        }

        .adresselab-txt {
         color: ${theme.colors.red};
        }

        .formation-txt {
          color: ${theme.colors.darkGreen};
        }

        .partenaire-txt {
          color: ${theme.colors.blue};
        }

        .adresse-region-txt {
          color: ${theme.colors.purple};
        }

        @media (max-width: 624px) {
          .presentation {
            flex-wrap: wrap;
            justify-content: flex-end;
          }
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
    date: PropTypes.string.isRequired,
    endHour: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    isOnlineOnly: PropTypes.bool.isRequired,
    instructions: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  isPassed: PropTypes.bool.isRequired
}

export default EventModal
