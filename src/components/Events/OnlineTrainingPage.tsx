'use client'

import CardWrapper from '@/components/CardWrapper'
import EventCard from '@/components/Events/EventCard'
import Section from '@/components/Section'
import VideoMiniature from '@/components/VideoMiniature'
import { EventType } from '@/types/events.types'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import ParticipantForm from './ParticipantForm'
import { useEffect, useMemo, useState } from 'react'

const Modal = createModal({
  id: 'register-event-modal',
  isOpenedByDefault: false,
})

const videoFormations = [
  {
    title: 'Épisode 1 : Introduction',
    image: '/img/formations-en-ligne/e1.png',
    link: {
      href: 'https://tube.numerique.gouv.fr/w/tsqJcL1c7axB9HrMgebyp8',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 2 : Création',
    image: '/img/formations-en-ligne/e2.png',
    link: {
      href: 'https://tube.numerique.gouv.fr/w/f2b6yiXosmfoKkmyF4YLtE',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 3 : Voies',
    image: '/img/formations-en-ligne/e3.png',
    link: {
      href: 'https://tube.numerique.gouv.fr/w/v2caTXtfYkvg6wUELBvLs2',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 4 : Numéros',
    image: '/img/formations-en-ligne/e4.png',
    link: {
      href: 'https://tube.numerique.gouv.fr/w/ts9chg7zehHXkTrotsjpqr',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 5 : Lieux-dits',
    image: '/img/formations-en-ligne/e5.png',
    link: {
      href: 'https://tube.numerique.gouv.fr/w/7AeS1b84kmwjbL3A19Wphw',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 6 : Publication',
    image: '/img/formations-en-ligne/e6.png',
    link: {
      href: 'https://tube.numerique.gouv.fr/w/oMKnhiVycDTjddCBXZuYMB',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 7 : Récupération',
    image: '/img/formations-en-ligne/e7.png',
    link: {
      href: 'https://tube.numerique.gouv.fr/w/wwf47pyuTNkMqK5GG5RUtP',
      target: '_blank',
    },
  },
]

interface OnlineTrainingPageProps {
  tagToColor: Record<string, { color: string, background: string }>
  upcomingEvents: EventType[]
}

export default function OnlineTrainingPage({ tagToColor, upcomingEvents }: OnlineTrainingPageProps) {
  const [eventIdRegister, setEventIdRegister] = useState('')

  const eventRegister = useMemo(() => upcomingEvents.find(event => event.id === eventIdRegister), [eventIdRegister, upcomingEvents])

  const handleRegister = (eventId: string) => {
    setEventIdRegister(eventId)
    Modal.open()
  }

  const handleCloseModal = () => {
    setEventIdRegister('')
    Modal.close()
  }

  useEffect(() => {
    if (window.location.hash.includes('open-event-modal')) {
      setTimeout(() => {
        const eventId = window.location.hash.split('open-event-modal-')[1]
        handleRegister(eventId)
      }, 0)
    }
  }, [])

  return (
    <>
      <Section>
        <b>L&apos;équipe de la Base Adresse Locale vous propose chaque semaine des formations à l&apos;outil, libre et gratuit, Mes Adresses. Venez découvrir la facilité d&apos;utilisation de notre outil, comprendre les enjeux et les principales règles de l&apos;adressage.</b>
      </Section>
      <Section title="Prochaines formations">
        {upcomingEvents.length > 0
          ? (
              <CardWrapper>
                {upcomingEvents.map((event, index) => (
                  <EventCard
                    key={index}
                    event={event}
                    tagToColor={tagToColor}
                    onRegister={() => handleRegister(event.id)}
                  />
                ))}
              </CardWrapper>
            )
          : <p>Aucune formation prévue pour le moment</p>}
      </Section>
      <Section title="Vidéos des formations" id="videos-formations">
        <CardWrapper isSmallCard>
          {videoFormations.map((video, index) => (
            <VideoMiniature key={index} {...video} />
          ))}
        </CardWrapper>
      </Section>
      <Modal.Component title={`Formulaire d'inscription - ${eventRegister?.title} - le ${new Date(eventRegister?.date || '').toLocaleDateString('fr-FR')} de ${eventRegister?.startHour} à ${eventRegister?.endHour}`}>
        <ParticipantForm onClose={handleCloseModal} eventId={eventIdRegister} />
      </Modal.Component>
    </>
  )
}
