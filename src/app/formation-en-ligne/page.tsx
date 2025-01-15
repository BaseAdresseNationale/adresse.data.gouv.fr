import CardWrapper from '@/components/CardWrapper'
import EventCard from '@/components/Events/EventCard'
import Section from '@/components/Section'
import VideoMiniature from '@/components/VideoMiniature'
import { getBalEvents } from '@/lib/api-bal-admin'
import { getUpcomingAndPassedEvents, mapEvents } from '@/utils/events'
export const dynamic = 'force-dynamic'

const videoFormations = [
  {
    title: 'Épisode 1 : Introduction',
    image: '/img/formations-en-ligne/e1.png',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/toyKNe4rKyVD7mUovsWLKd',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 2 : Création',
    image: '/img/formations-en-ligne/e2.png',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/aNEtMh7fJCzsAPoGkwvFSg',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 3 : Voies',
    image: '/img/formations-en-ligne/e3.png',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/rgksUPigy8KWnmx8WFELDN',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 4 : Numéros',
    image: '/img/formations-en-ligne/e4.png',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/un73nNp4kQofNkhT38D6YQ',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 5 : Lieux-dits',
    image: '/img/formations-en-ligne/e5.png',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/ttnYNTcXtcubCHQX8kHdGt',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 6 : Publication',
    image: '/img/formations-en-ligne/e6.png',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/4uU6AHpTe7coPyhskBSANB',
      target: '_blank',
    },
  },
  {
    title: 'Épisode 7 : Récupération',
    image: '/img/formations-en-ligne/e7.png',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/fdD1tzvPfktHkkVK8p7h5D',
      target: '_blank',
    },
  },
]

export default async function FormationEnLignePage() {
  const balEvents = await getBalEvents()
  console.log(balEvents)
  const { allEvents, tagToColor } = mapEvents(balEvents, 'formation')
  const { upcomingEvents } = getUpcomingAndPassedEvents(allEvents)

  return (
    <>
      <Section title="Prochaines formations">
        {upcomingEvents.length > 0
          ? (
              <CardWrapper>
                {upcomingEvents.map((event, index) => (
                  <EventCard
                    key={index}
                    event={event}
                    tagToColor={tagToColor}
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
    </>
  )
}
