import Section from '@/components/Section'
import { getBalEvents } from '@/lib/api-bal-admin'
import banEvents from '@/data/ban-events.json'
import CardWrapper from '@/components/CardWrapper'
import EventCard from '@/components/Events/EventCard'
import { EventType } from '@/types/events.types'
import { getUpcomingAndPassedEvents, mapEvents } from '@/utils/events'

export default async function EvenementsPage() {
  const balEvents = await getBalEvents()

  const { allEvents, tagToColor } = mapEvents([...balEvents, ...(banEvents as EventType[])])
  const { upcomingEvents, pastEvents } = getUpcomingAndPassedEvents(allEvents)

  return (
    <>
      <Section title="Prochains évènements">
        <CardWrapper>
          {upcomingEvents.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              tagToColor={tagToColor}
            />
          ))}
        </CardWrapper>
      </Section>
      <Section title="Évènements passés">
        <CardWrapper>
          {pastEvents.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              tagToColor={tagToColor}
              isPassed
            />
          ))}
        </CardWrapper>
      </Section>
    </>
  )
}
