import theme from '@/styles/theme'
import Page from '@/layouts/main'
import Hero from '@/components/hero'
import Section from '@/components/section'
import ButtonLink from '@/components/button-link'
import Temoignages from '@/components/temoignages'
import HomepageTools from '../components/homepage-tools'
import SocialMedia from '@/components/social-media'

function Home() {
  return (
    <Page>
      <Hero
        title='Le site national des adresses'
        tagline='Référencer l’intégralité des adresses du territoire et les rendre utilisables par tous.' />

      <Section background='dark'>
        <div className='pitch'>
          <p>
            Pour que les <strong>services d’urgence</strong> arrivent au bon endroit, pour vous permettre de réaliser une analyse <strong>cartographique</strong> en quelques clics ou encore pour que les opérateurs <strong>publics et privés</strong> coordonnent mieux leurs chantiers, les adresses sont un véritable enjeu de <strong>souveraineté</strong> pour la France.
          </p>
          <ButtonLink href='/donnees-nationales'>Découvrir la BAN et accèder aux données</ButtonLink>

          <style jsx>{`
            .pitch {
              color: ${theme.colors.grey};
              text-align: center;
              font-size: 1.2em;
              line-height: 1.2em;
            }

            .pitch strong {
              color: ${theme.colors.white}
            }

            .pitch a {
              color: ${theme.colors.white};
              font-style: italic;
            }

            .pitch p {
              margin-bottom: 4em;
              margin-left: auto;
              margin-right: auto;
              padding-left: 1em;
              max-width: 1000px;
              text-align: start;
              border-left: solid 3px ${theme.colors.white};
            }
          `}</style>
        </div>
      </Section>

      <Section title='Les communes certifient leurs adresses dans la Base Adresse Nationale'>
        <div className='tools-section'>
          <p>Grâce à la diffusion de leur Base Adresse Adresse Locale</p>
          <HomepageTools />

          <style jsx>{`
            .tools-section {
              text-align: center;
            }
         `}</style>
        </div>
      </Section>

      <Section title='Témoignages sur les Bases Adresses Locales' background='grey'>
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

      <Section title='Suivez et participez à l’actualité de la communauté adresse.data.gouv'>
        <SocialMedia />
      </Section>
    </Page>
  )
}

export default Home
