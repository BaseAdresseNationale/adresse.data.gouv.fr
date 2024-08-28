import { EventType } from '@/types/events.types'
import { StyledEventCard } from './EventCard.styles'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { getFullDate } from '@/utils/date'

interface EventCardProps {
  event: EventType
  tagToColor: Record<string, { color: string, background: string }>
  isPassed?: boolean
}

export default function EventCard({ event, isPassed, tagToColor }: EventCardProps) {
  const getAdressToString = (adress: EventType['address']) => {
    if (!adress) return ''
    return `${adress.nom}, ${adress.numero} ${adress.voie}, ${adress.codePostal} ${adress.commune}`
  }

  return (
    <StyledEventCard isPassed={isPassed}>
      <div className="badge-wrapper">
        <>{event.tags.map(tag => <Badge style={{ backgroundColor: tagToColor[tag].background, color: tagToColor[tag].color, marginRight: 4 }} key={tag} small>{tag}</Badge>)}</>
      </div>
      <div className="event-details">
        <span className="fr-icon-calendar-2-fill" aria-hidden="true" />
        <span>{getFullDate(new Date(event.date))}</span>
        {' | '}
        <span>{event.startHour} - {event.endHour}</span>
        {event.isOnlineOnly ? <span> | En ligne</span> : event.address ? <span> | {getAdressToString(event.address)}</span> : null}
      </div>
      <h3>{event.title}</h3>
      <p>
        {event.description}
      </p>
      {!event.isSubscriptionClosed && !isPassed && (
        <a className="fr-btn" href={event.href} target="_blank" rel="noreferrer">
          S&apos;inscrire
        </a>
      )}
    </StyledEventCard>
  )
}
