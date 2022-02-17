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
      <Head title='À déterminer' icon={<Calendar size={56} />} />

      <Section title='Évènements à venir'>
        <SectionText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 300px));
          gap: 2em 3em;
          justify-content: center;
        }
      `}</style>
    </Page>
  )
}

export default Evenements
