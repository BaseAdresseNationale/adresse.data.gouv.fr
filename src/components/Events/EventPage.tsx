'use client'

import Section from '@/components/Section'
import CardWrapper from '@/components/CardWrapper'
import EventCard from '@/components/Events/EventCard'
import { EventType } from '@/types/events.types'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { useState } from 'react'
import ParticipantForm from '@/components/Events/ParticipantForm'

const Modal = createModal({
  id: 'register-event-modal',
  isOpenedByDefault: false,
})

interface EventPageProps {
  upcomingEvents: EventType[]
  lastMonthPastEvents: EventType[]
  tagToColor: Record<string, { color: string, background: string }>
}

export default function EventPage({ upcomingEvents, lastMonthPastEvents, tagToColor }: EventPageProps) {
  const [eventIdRegister, setEventIdRegister] = useState('')

  const handleRegister = (eventId: string) => {
    setEventIdRegister(eventId)
    Modal.open()
  }

  const handleCloseModal = () => {
    setEventIdRegister('')
    Modal.close()
  }

  return (
    <>
      <Section title="Prochains évènements">
        <CardWrapper>
          {upcomingEvents.length > 0
            ? upcomingEvents.map((event, index) => (
              <EventCard
                key={index}
                event={event}
                tagToColor={tagToColor}
                onRegister={() => handleRegister(event.id)}
              />
            ))
            : <p>Aucun évènement à venir</p>}
        </CardWrapper>
      </Section>
      <Section title="Évènements passés">
        <CardWrapper>
          {lastMonthPastEvents.length > 0
            ? lastMonthPastEvents.map((event, index) => (
              <EventCard
                key={index}
                event={event}
                tagToColor={tagToColor}
                isPassed
              />
            ))
            : <p>Aucun évènement n&apos;a eu lieu le mois dernier</p>}
        </CardWrapper>
      </Section>
      <Modal.Component title="Formulaire inscription évènement">
        <ParticipantForm onClose={handleCloseModal} eventId={eventIdRegister} />
      </Modal.Component>
    </>
  )
}
