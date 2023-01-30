import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/legacy/image'

import {getStats} from '@/lib/api-ban'
import {getPosts} from '@/lib/blog'

import theme from '@/styles/theme'
import Page from '@/layouts/main'
import Hero from '@/components/hero'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'
import MapBalSection from '@/components/map-bal-section'
import DocDownload from '@/components/doc-download'
import Temoignages from '@/components/temoignages'
import CommuneSearch from '@/components/commune/commune-search'
import EventBanner from '@/components/evenement/event-banner'

function Home({stats, posts}) {
  return (
    <Page>
      <EventBanner />

      <Hero
        title='Le site national des adresses'
        tagline='Référencer l’intégralité des adresses du territoire et les rendre utilisables par tous.'
      />

      <Section background='dark'>
        <div className='pitch'>
          <SectionText color='secondary'>
            <p>
              Pour que les <strong>services d’urgence</strong> arrivent au bon endroit, pour vous permettre de réaliser une analyse <strong>cartographique</strong> en quelques clics ou encore pour que les opérateurs <strong>publics et privés</strong> coordonnent mieux leurs chantiers, les adresses sont un véritable enjeu de <strong>souveraineté</strong> pour la France.
            </p>
          </SectionText>
          <ButtonLink isOutlined color='white' href='/donnees-nationales'>Découvrir la BAN et accéder aux données</ButtonLink>
          <ButtonLink isOutlined color='white' href='/donnees-nationales/reutilisateurs'>Voir qui réutilise la BAN</ButtonLink>
        </div>

        <style jsx>{`
          .pitch {
            margin: -4em 0;
            color: ${theme.colors.grey};
            text-align: center;
          }

          .pitch a {
            font-style: italic;
          }

          .pitch p {
            text-align: start;
          }
        `}</style>
      </Section>

      <Section title='Adoptez la Charte de la Base Adresse Locale et rejoignez les organismes partenaires'>
        <SectionText>
          <p>Administrée par <b>la DINUM</b>, <b>la Base Adresse Nationale</b> privilégie le format <Link href='/bases-locales'>Base Adresse Locale</Link>.</p>
          <p><b>Une Charte</b> encourage le partage des bonnes pratiques, permet aux <b>organismes</b> qui promeuvent activement <b>le format Base Adresse Locale</b> d’être identifiés et aux communes de se repérer.</p>
        </SectionText>

        <div className='centered'>
          <ButtonLink href='/bases-locales/charte'>
            Découvrir la charte
          </ButtonLink>
        </div>

        <style jsx>{`
            .centered {
              margin: 40px auto;
              display: flex;
              justify-content: center;
            }
          `}
        </style>
      </Section>

      {stats && (
        <Section background='color' title='État du déploiement des Bases Adresses Locales'>
          <MapBalSection stats={stats} />
        </Section>
      )}

      <Section title='Obtenez des informations sur les adresses d’une commune' id='rechercher-une-commune'>
        <div className='commune-search-section'>
          <Image src='/images/icons/commune.svg' height={200} width={200} alt='' aria-hidden='true' />
          <SectionText>
            Recherchez une commune afin d’obtenir les <b>informations disponibles sur ses adresses</b>, leur composition, leur degré d’achèvement et de certification, et de <b>télécharger ses fichiers adresses</b>.
          </SectionText>
          <CommuneSearch />

          <style jsx>{`
            .commune-search-section {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          `}</style>
        </div>
      </Section>

      <Section background='grey' title='La fibre arrive dans la commune' subtitle='Communes et opérateurs, vous pouvez gagner du temps'>
        <DocDownload
          src='/images/previews/obligations-adresse-preview.png'
          alt='miniature du document obligations-adresse'
          link='https://adresse.data.gouv.fr/data/docs/communes-operateurs-obligations-adresse-v2.0.pdf'
          label='Télécharger les obligations relatives à l’adresse'
        >
          <SectionText>
            <p>
              Avant de vous lancer dans une opération d’adressage et d’engager les finances de la commune, prenez connaissance des actions nécessaires et suffisantes.
            </p>
          </SectionText>
        </DocDownload>
      </Section>

      {posts && (
        <Section title='Témoignages sur les Bases Adresses Locales'>
          <Temoignages limit={3} posts={posts} />
          <div className='centered'>
            <ButtonLink href='/bases-locales/temoignages'>Lire tous les témoignages</ButtonLink>
          </div>

          <style jsx>{`
            .centered {
              margin-top: 5em;
              display: flex;
              justify-content: center;
            }

            .centered a {
              text-decoration: none;
              color: white;
            }
          `}
          </style>
        </Section>
      )}

      <Section title='Découvrez les évènements autour de l’adresse' background='color'>
        <div className='event-section-container'>
          <div className='event-illustration'>
            <Image src='/images/event-illustration.svg' layout='responsive' height={400} width={400} alt='' aria-hidden='true' />
          </div>
          <SectionText color='secondary'>
            Que vous soyez maire ou élu, agent municipal, géomaticien, producteur ou utilisateur... vous pouvez consulter la page exposant les événements autour de l’adresse et vous inscrire à ceux adaptés à vos besoins.          </SectionText>
          <ButtonLink href='/evenements' isOutlined color='white'>Découvrir les différents évènements</ButtonLink>
        </div>

        <style jsx>{`
          .event-section-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3em;
            margin-top: 3em;
          }

          .event-illustration {
            min-width: 290px;
            max-width: 400px;
          }
        `}</style>
      </Section>
    </Page>
  )
}

export async function getServerSideProps() {
  const stats = await getStats()
  const data = await getPosts({tags: 'temoignage'})

  return {
    props: {
      stats,
      posts: data?.posts || null
    }
  }
}

Home.defaultProps = {
  posts: null
}

Home.propTypes = {
  stats: PropTypes.object.isRequired,
  posts: PropTypes.array
}

export default Home
