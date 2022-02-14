import Page from '@/layouts/main'
import Head from '@/components/head'
import dynamic from 'next/dynamic'
import {Calendar} from 'react-feather'

import events from '../events.json'

import Section from '@/components/section'
import SectionText from '@/components/section-text'
const Event = dynamic(import('@/components/evenement/event'), {ssr: false}) // eslint-disable-line node/no-unsupported-features/es-syntax

function Evenements() {
  const today = new Date().setHours(0, 0, 0, 0)
  const passedEvents = events.filter(event => new Date(event.date).setHours(0, 0, 0, 0) < today)
  const futureEvents = events.filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today)

  return (
    <Page>
      <Head title='À déterminer' icon={<Calendar size={56} />} />

      <Section title='Évènements à venir'>
        <SectionText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </SectionText>

        <div className='events-container'>
          {futureEvents.map(event => <Event key={event.titre} event={event} />)}
        </div>
      </Section>

      <Section title='Évènements passés' background='grey'>
        <SectionText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </SectionText>

        <div className='events-container'>
          {passedEvents.map(event => <Event key={event.titre} event={event} background='grey' />)}
        </div>
      </Section>

      <style jsx>{`
        .events-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 1em;
        }
      `}</style>
    </Page>
  )
}

export default Evenements
