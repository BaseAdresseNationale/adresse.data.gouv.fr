import Page from '@/layouts/main'
import Head from '@/components/head'
import {orderBy} from 'lodash'
import {Calendar} from 'react-feather'

import events from '../events.json'

import Section from '@/components/section'
import SectionText from '@/components/section-text'
import Event from '@/components/evenement/event'

function sortEventsByDate(events, order) {
  return orderBy(events, [
    // Sort date
    function (event) {
      return Date.parse(event.date)
    },
    // ...then sort by start hour
    function (event) {
      return Date.parse(`${event.date} ${event.heureDebut}`)
    },
  ], [order, order])
}

function Evenements() {
  const today = new Date().setHours(0, 0, 0, 0)

  const passedEvents = sortEventsByDate(events, 'desc').filter(event => new Date(event.date).setHours(0, 0, 0, 0) < today)
  const futureEvents = sortEventsByDate(events, 'asc').filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today)

  return (
    <Page>
      <Head title='Les évènements autour de l’adresse' icon={<Calendar size={56} />} />
      <Section title='Évènements à venir'>
        <SectionText>
          Que vous soyez maire ou élu, agent municipal, géomaticien, producteur ou utilisateur... vous pouvez consulter ici la référence à un événement à venir adapté à vos besoins sur l’adresse.
        </SectionText>
        <div className='events-container'>
          {futureEvents.length > 0 ? (
            futureEvents.map(event => <Event key={`${event.titre}-${event.date}`} event={event} />)
          ) : (
            <div>Aucun évènement n’est actuellement programmé</div>
          )}
        </div>
      </Section>

      <Section title='Évènements passés' background='grey'>
        <SectionText>
          Cette section référence les événements passés organisés sur l’adresse par les équipes Base Adresse Locale - Base Adresse Nationale.
        </SectionText>
        <div className='events-container'>
          {futureEvents.length > 0 ? (
            passedEvents.map(event => <Event key={`${event.titre}-${event.date}`} event={event} background='grey' isPassed />)
          ) : (
            <div>Aucun évènement n’est actuellement programmé</div>
          )}
        </div>
      </Section>

      <style jsx>{`
        .events-container {
          display: flex;
          flex-wrap: wrap;
          gap: 3em;
          justify-content: flex-start;
        }
      `}</style>
    </Page>
  )
}

export default Evenements
