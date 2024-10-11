'use client'

import { EventType } from '@/types/events.types'
import { StyledEventCard } from './EventCard.styles'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { getFullDate } from '@/utils/date'
import { useState } from 'react'

interface EventCardProps {
  event: EventType
  tagToColor: Record<string, { color: string, background: string }>
  isPassed?: boolean
}

export default function EventCard({ event, isPassed, tagToColor }: EventCardProps) {
  const { tags, title, description, startHour, endHour, date, address, isOnlineOnly, isSubscriptionClosed, href } = event

  const hasLargeDescription = description.length > 200
  const [showAllDescription, setShowAllDescription] = useState(!hasLargeDescription)
  const actualDescription = showAllDescription ? description : description.slice(0, 200) + '...'

  const getAdressToString = (adress: EventType['address']) => {
    if (!adress) return ''
    return `${adress.nom}, ${adress.numero} ${adress.voie}, ${adress.codePostal} ${adress.commune}`
  }

  return (
    <StyledEventCard $isPassed={isPassed}>
      <div className="badge-wrapper">
        <>{tags.map(tag => <Badge style={{ backgroundColor: tagToColor[tag].background, color: tagToColor[tag].color, marginRight: 4 }} key={tag} small>{tag}</Badge>)}</>
      </div>
      <div className="event-details">
        <span className="fr-icon-calendar-2-fill" aria-hidden="true" />
        <span>{getFullDate(new Date(date))}</span>
        {' | '}
        <span>{startHour} - {endHour}</span>
        {isOnlineOnly ? <span> | En ligne</span> : address ? <span> | {getAdressToString(address)}</span> : null}
      </div>
      <h3>{title}</h3>
      <p>
        {actualDescription}
      </p>
      {hasLargeDescription && (
        <button className="show-btn fr-link" onClick={() => setShowAllDescription(!showAllDescription)}>
          {showAllDescription ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
      {!isSubscriptionClosed && !isPassed && (
        <a className="fr-btn" href={href} target="_blank" rel="noreferrer">
          S&apos;inscrire
        </a>
      )}
    </StyledEventCard>
  )
}
