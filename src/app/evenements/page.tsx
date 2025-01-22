import Section from '@/components/Section'
import { getBalEvents } from '@/lib/api-bal-admin'
import banEvents from '@/data/ban-events.json'
import CardWrapper from '@/components/CardWrapper'
import EventCard from '@/components/Events/EventCard'
import { EventType } from '@/types/events.types'
import { getUpcomingAndPassedEvents, mapEvents } from '@/utils/events'

export const dynamic = 'force-dynamic'

export default async function EvenementsPage() {
  const balEvents = await getBalEvents()

  const { allEvents, tagToColor } = mapEvents([...balEvents, ...(banEvents as EventType[])])
  const { upcomingEvents, pastEvents } = getUpcomingAndPassedEvents(allEvents)
  const lastMonthPastEvents = pastEvents.filter((event) => {
    const eventDate = new Date(event.date)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    return eventDate > lastMonth
  })

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
    </>
  )
}
