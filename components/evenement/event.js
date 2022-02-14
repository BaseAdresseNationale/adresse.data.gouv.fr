import {useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
// eslint-disable-next-line camelcase
import {atcb_init} from 'add-to-calendar-button'
import {MapPin} from 'react-feather'

import theme from '@/styles/theme'

import ButtonLink from '../button-link'

const formatTag = tag => {
  if (tag.includes('’')) {
    tag = tag.replace('’', ' ')
  }

  return `#${tag.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

function Event({event, background}) {
  const {titre, adresse, description, date, href, tags, type, heureDebut, heureFin} = event
  const {name, numero, voie, codePostal, commune} = adresse

  const sanitizedDate = new Date(date).toLocaleDateString('fr-FR')

  // Add to calendar button init
  useEffect(() => atcb_init())

  const calendarOptions = {
    event: {
      name: titre,
      description,
      startDate: `${date}T${heureDebut}`,
      endDate: `${date}T${heureFin}`,
      location: `${name} ${numero} ${voie} ${codePostal} ${commune}`
    },
    label: 'Ajouter au calendrier',
    options: [
      'Google',
      'iCal',
      'Microsoft365',
      'Outlook.com',
      'Yahoo'
    ],
    timeZone: 'Europe/France',
    timeZoneOffset: '+01:00',
    iCalFileName: `Rappel ${titre}`,
    trigger: 'click'
  }

  return (
    <div className='event-container'>
      <div className='event-left'>
        <Image src={`/images/icons/event-${type}.svg`} height={90} width={90} />
        <div className='date'>le {sanitizedDate}</div>
        <div className='event-actions'>
          <div>
            <MapPin size={10} style={{marginRight: 5}} />{name}, {numero} {voie} <br />{codePostal} {commune}
          </div>
          <div className='atcb'>
            <script type='application/ld+json'>
              {JSON.stringify(calendarOptions)}
            </script>
          </div>
        </div>
      </div>
      <div className='event-right'>
        <div className='event-description'>
          <h5>{titre}</h5>
          <p>{description}</p>
          <div className='tags'>
            {tags.map(tag => <div key={tag}>&nbsp;{formatTag(tag)}</div>)}
          </div>
        </div>
        {href && <ButtonLink href={href} isExternal>S’incrire</ButtonLink>}
      </div>

      <style jsx>{`
        .event-container {
          font-size: 12px;
          padding: 1em;
          background: ${background === 'grey' ? theme.colors.white : theme.colors.lighterGrey};
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          border-radius: ${theme.borderRadius};
          gap: 1em;
        }

        .event-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 18px;
        }

        .event-left {
          border-right: solid 2px #0053b375;
        }

        h5, .date {
          text-align: center;
        }

        .date {
          font-size: 18px;
          font-weight: bold;
          color: ${theme.primary};
          margin: 5px;
        }

        .event-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }

        .event-description {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .tags {
          font-size: 11px;
          color: ${theme.primary};
          font-style: italic;
          display: flex;
          padding: 10px 1em;
        }

        p {
          margin: 0;
          padding: 0 1em;
        }

        @media only screen and (max-width:1299px) {
          .event-left {
            border-right: none;
            border-bottom: solid 1px ${theme.primary};
          }
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
  ])
}

Event.defaultProps = {
  background: 'white'
}

export default Event
