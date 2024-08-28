import CardWrapper from '@/components/CardWrapper'
import EventCard from '@/components/Events/EventCard'
import Section from '@/components/Section'
import SectionTilesList from '@/components/SectionTilesList'
import { getBalEvents } from '@/lib/api-bal-admin'
import { getUpcomingAndPassedEvents, mapEvents } from '@/utils/events'

const videoFormations = [
  {
    title: 'Épisode 1 : Introduction',
    picto: '/img/picto-fr/video.svg',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/toyKNe4rKyVD7mUovsWLKd',
      target: '_blank',
    },
    tags: ['Base adresse locale'],
  },
  {
    title: 'Épisode 2 : Création',
    picto: '/img/picto-fr/video.svg',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/aNEtMh7fJCzsAPoGkwvFSg',
      target: '_blank',
    },
    tags: ['Base adresse locale'],
  },
  {
    title: 'Épisode 3 : Voies',
    picto: '/img/picto-fr/video.svg',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/rgksUPigy8KWnmx8WFELDN',
      target: '_blank',
    },
    tags: ['Base adresse locale'],
  },
  {
    title: 'Épisode 4 : Numéros',
    picto: '/img/picto-fr/video.svg',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/un73nNp4kQofNkhT38D6YQ',
      target: '_blank',
    },
    tags: ['Base adresse locale'],
  },
  {
    title: 'Épisode 5 : Lieux-dits',
    picto: '/img/picto-fr/video.svg',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/ttnYNTcXtcubCHQX8kHdGt',
      target: '_blank',
    },
    tags: ['Base adresse locale'],
  },
  {
    title: 'Épisode 6 : Publication',
    picto: '/img/picto-fr/video.svg',
    link: {
      href: 'https://peertube.adresse.data.gouv.fr/w/4uU6AHpTe7coPyhskBSANB',
      target: '_blank',
    },
    tags: ['Base adresse locale'],
  },
]

export default async function FormationEnLignePage() {
  const balEvents = await getBalEvents()

  const { allEvents, tagToColor } = mapEvents(balEvents, 'formation')
  const { upcomingEvents } = getUpcomingAndPassedEvents(allEvents)

  return (
    <>
      <Section title="Prochains évènements">
        <CardWrapper>
          {upcomingEvents.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              tagToColor={tagToColor}
            />
          ))}
        </CardWrapper>
      </Section>
      <SectionTilesList title="Vidéos des formations" data={videoFormations} />
    </>
  )
}
