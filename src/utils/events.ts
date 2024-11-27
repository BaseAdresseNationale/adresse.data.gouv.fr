import { EventType } from '@/types/events.types'
import { fr } from '@codegouvfr/react-dsfr'

export function mapEvents(events: EventType[], typeFilter?: string) {
  let allEvents = events.sort((a, b) => {
    const dateA = new Date(a.date)
    const [hourA, minuteA] = a.startHour.split(':')
    dateA.setHours(parseInt(hourA), parseInt(minuteA))

    const dateB = new Date(b.date)
    const [hourB, minuteB] = b.startHour.split(':')
    dateB.setHours(parseInt(hourB), parseInt(minuteB))

    return dateA.getTime() - dateB.getTime()
  })

  if (typeFilter) {
    allEvents = allEvents.filter(event => event.type.includes(typeFilter))
  }

  const allTags = allEvents.reduce((acc, event) => {
    if (event.tags) {
      event.tags.forEach(tag => acc.add(tag))
      return acc
    }
    return acc
  }
  , new Set<string>())

  const tagToColor = Array.from(allTags).reduce((acc, tag, index) => {
    const colorKeys = Object.keys(fr.colors.decisions.background.alt)
    const currentKey = colorKeys[(index + 1) % colorKeys.length] // First color is ugly

    acc[tag] = {
      color: (fr.colors.decisions.text.actionHigh as any)[currentKey].default,
      background: (fr.colors.decisions.background.alt as any)[currentKey].active,
    }
    return acc
  }, {} as Record<string, { color: string, background: string }>)

  return { allEvents, tagToColor }
}

export function getUpcomingAndPassedEvents(allEvents: EventType[]) {
  const upcomingEvents = allEvents.filter(({ date, endHour }) => {
    const [hour, minute] = endHour.split(':')
    const eventDate = new Date(date)
    eventDate.setHours(parseInt(hour), parseInt(minute))

    return eventDate.getTime() >= Date.now()
  }) as EventType[]

  const pastEvents = allEvents.filter(({ date, endHour }) => {
    const [hour, minute] = endHour.split(':')
    const eventDate = new Date(date)
    eventDate.setHours(parseInt(hour), parseInt(minute))

    return eventDate.getTime() < Date.now()
  }) as EventType[]

  return { upcomingEvents, pastEvents }
}
