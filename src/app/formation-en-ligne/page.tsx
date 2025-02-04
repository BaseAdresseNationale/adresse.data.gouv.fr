import OnlineTrainingPage from '@/components/Events/OnlineTrainingPage'
import { getBalEvents } from '@/lib/api-bal-admin'
import { getUpcomingAndPassedEvents, mapEvents } from '@/utils/events'

export const dynamic = 'force-dynamic'

export default async function FormationEnLignePage() {
  const balEvents = await getBalEvents()

  const { allEvents, tagToColor } = mapEvents(balEvents, 'formation')
  const { upcomingEvents } = getUpcomingAndPassedEvents(allEvents)

  return <OnlineTrainingPage tagToColor={tagToColor} upcomingEvents={upcomingEvents} />
}
