import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

import {getStats} from '@/lib/api-ban'

import theme from '@/styles/theme'
import Page from '@/layouts/main'
import Hero from '@/components/hero'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'
import MapBalSection from '@/components/map-bal-section'
import DocDownload from '@/components/doc-download'
import Temoignages from '@/components/temoignages'
import SocialMedia from '@/components/social-media'
import CommuneSearch from '@/components/commune/commune-search'

function Home({stats}) {
  return (
    <Page>
      <Hero
        title='Le site national des adresses'
        tagline='Référencer l’intégralité des adresses du territoire et les rendre utilisables par tous.' />

      <Section background='dark'>
        <div className='pitch'>
          <SectionText color='secondary'>
            <p>
              Pour que les <strong>services d’urgence</strong> arrivent au bon endroit, pour vous permettre de réaliser une analyse <strong>cartographique</strong> en quelques clics ou encore pour que les opérateurs <strong>publics et privés</strong> coordonnent mieux leurs chantiers, les adresses sont un véritable enjeu de <strong>souveraineté</strong> pour la France.
            </p>
          </SectionText>
          <ButtonLink href='/donnees-nationales'>Découvrir la BAN et accéder aux données</ButtonLink>
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

      <Section title='Obtenez des informations sur les adresses d’une commune'>
        <div className='commune-search-section'>
          <Image src='/images/icons/commune.svg' height={200} width={200} />
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
          link='https://adresse.data.gouv.fr/data/docs/communes-operateurs-obligations-adresse.pdf'
        >
          <SectionText>
            <p>
              Avant de vous lancer dans une opération d’adressage et d’engager les finances de la commune, prenez connaissance des actions nécessaires et suffisantes.
            </p>
          </SectionText>
        </DocDownload>
      </Section>

      <Section title='Témoignages sur les Bases Adresses Locales'>
        <Temoignages limit={3} />
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

      <Section title='Suivez et participez à l’actualité de la communauté adresse.data.gouv' background='grey'>
        <SocialMedia />
      </Section>
    </Page>
  )
}

Home.getInitialProps = async () => {
  try {
    return {
      stats: await getStats()
    }
  } catch (error) {
    console.log('Erreur lors de la récupération des stats BAN:', error)
  }

  return {
    stats: null
  }
}

Home.propTypes = {
  stats: PropTypes.object.isRequired
}

export default Home
