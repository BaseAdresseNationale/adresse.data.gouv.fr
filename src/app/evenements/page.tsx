import { getBalEvents } from '@/lib/api-bal-admin'
import { EventRecord } from '@/types/events.types'
import { getUpcomingAndPassedEvents, mapEvents } from '@/utils/events'
import EventPage from '@/components/Events/EventPage'
import pageTitle from '@/utils/pageTitle'
import { fetchAndProcessEventsGristData } from '@/lib/api-grist'

export const metadata = pageTitle('Évènements')

export const dynamic = 'force-dynamic'

export default async function EvenementsPage() {
  const [balEvents, gristEvents] = await Promise.all([
    getBalEvents(),
    fetchAndProcessEventsGristData(),
  ])

  const events: EventRecord[] = [...balEvents, ...gristEvents]
  const { allEvents, tagToColor } = mapEvents(events)
  const { upcomingEvents, pastEvents } = getUpcomingAndPassedEvents(allEvents)
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const lastMonthPastEvents = pastEvents
    .filter(event => new Date(event.date) > lastMonth)
    .reverse()
  return (
    <EventPage upcomingEvents={upcomingEvents} lastMonthPastEvents={lastMonthPastEvents} tagToColor={tagToColor} />
  )
}
