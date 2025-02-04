import { getBalEvents } from '@/lib/api-bal-admin'
import banEvents from '@/data/ban-events.json'
import { EventType } from '@/types/events.types'
import { getUpcomingAndPassedEvents, mapEvents } from '@/utils/events'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import EventPage from '@/components/Events/EventPage'

export const dynamic = 'force-dynamic'

const Modal = createModal({
  id: 'register-event-modal',
  isOpenedByDefault: false,
})

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
    <EventPage upcomingEvents={upcomingEvents} lastMonthPastEvents={lastMonthPastEvents} tagToColor={tagToColor} />
  )
}
