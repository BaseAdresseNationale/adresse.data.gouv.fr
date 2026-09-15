import { getBalEvents } from '@/lib/api-bal-admin'
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

  const { allEvents, tagToColor } = mapEvents([...balEvents, ...gristEvents])
  const { upcomingEvents, pastEvents } = getUpcomingAndPassedEvents(allEvents)
  const lastMonthPastEvents = pastEvents.filter((event) => {
    const eventDate = new Date(event.date)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    return eventDate > lastMonth
  })
  return (
    <EventPage upcomingEvents={upcomingEvents} lastMonthPastEvents={lastMonthPastEvents} tagToColor={tagToColor} />
  )
}
