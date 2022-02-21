import {useEffect} from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line camelcase
import {atcb_init} from 'add-to-calendar-button'

const calendarDate = date => {
  const [year, month, day] = date.split('-')
  return `${month}-${day}-${year}`
}

function AddToCalendar({eventData}) {
  const {titre, adresse, description, date, heureDebut, heureFin} = eventData
  const {nom, numero, voie, codePostal, commune} = adresse

  const eventDate = calendarDate(date)

  const calendarOptions = {
    event: {
      name: titre,
      description,
      dateStart: eventDate,
      dateEnd: eventDate,
      timeStart: heureDebut,
      timeEnd: heureFin,
      location: `${nom} ${numero} ${voie} ${codePostal} ${commune}`
    },
    label: '🗓️ &nbsp;Ajouter au calendrier',
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

  // Add to calendar button init
  useEffect(() => atcb_init(), [])

  return (
    <div className='atcb'>
      <script type='application/ld+json'>
        {JSON.stringify(calendarOptions)}
      </script>
    </div>
  )
}

AddToCalendar.propTypes = {
  eventData: PropTypes.object.isRequired
}

export default AddToCalendar
