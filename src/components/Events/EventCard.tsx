'use client'

import { EventType, EventTypeTypeEnum } from '@/types/events.types'
import { StyledEventCard } from './EventCard.styles'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { getFullDate } from '@/utils/date'
import { useState } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'

interface EventCardProps {
  event: EventType
  tagToColor: Record<string, { color: string, background: string }>
  isPassed?: boolean
  onRegister?: () => void
}

const backgroundColors: Record<string, string> = {
  [EventTypeTypeEnum.FORMATION]: 'rgba(136, 213, 156, 0.1)',
  [EventTypeTypeEnum.FORMATION_LVL2]: 'rgba(136, 213, 156, 0.25)',
}

export default function EventCard({ event, isPassed, tagToColor, onRegister }: EventCardProps) {
  const { tags, title, description, startHour, endHour, date, address, isSubscriptionClosed, type } = event

  const hasLargeDescription = description.length > 100
  const [showAllDescription, setShowAllDescription] = useState(!hasLargeDescription)
  const actualDescription = showAllDescription ? description : description.slice(0, 100) + '...'
  const backgroundColor = backgroundColors[type]

  const getAdressToString = (adress: EventType['address']) => {
    if (!adress) return ''
    return `${adress.nom}, ${adress.numero} ${adress.voie}, ${adress.codePostal} ${adress.commune}`
  }

  return (
    <StyledEventCard $isPassed={isPassed} $backgroundColor={backgroundColor}>
      <div className="badge-wrapper">
        <>{tags.map(tag => <Badge style={{ backgroundColor: tagToColor[tag].background, color: tagToColor[tag].color, marginRight: 4 }} key={tag} small>{tag}</Badge>)}</>
      </div>
      <div className="event-details">
        <span className="fr-icon-calendar-2-fill" aria-hidden="true" />
        <span>{getFullDate(new Date(date))}</span>
        {' | '}
        <span>{startHour} - {endHour}</span>
        {address?.commune ? <span> | {getAdressToString(address)}</span> : null}
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

      {!isSubscriptionClosed && !isPassed && onRegister && (
        <Button
          iconId="fr-icon-questionnaire-line"
          iconPosition="right"
          priority="secondary"
          onClick={onRegister}
          style={{ marginBottom: '1rem' }}
        >
          S&apos;inscrire
        </Button>
      )}
    </StyledEventCard>
  )
}
