import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

import {getBALStats} from '@/lib/bal/api'
import {numFormater} from '@/lib/format-numbers'

import theme from '@/styles/theme'
import Page from '@/layouts/main'
import Hero from '@/components/hero'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'
import Metric from '@/components/metric'
import DocDownload from '@/components/doc-download'
import Temoignages from '@/components/temoignages'
import SocialMedia from '@/components/social-media'
import Infolettre from '@/components/infolettre'

function Home({stats}) {
  const communesCouvertesPercent = Math.round((stats.bal.nbCommunesCouvertes * 100) / stats.france.nbCommunes)

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
          <ButtonLink href='/donnees-nationales'>Découvrir la BAN et accèder aux données</ButtonLink>
        </div>

        <style jsx>{`
          .pitch {
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

      <Section background='color' title='État du déploiement des Bases Adresses Locales'>
        <div className='deployement-container'>
          <div className='map-illustration'>
            <Image src='/images/france-illustration.svg' layout='responsive' height={400} width={400} />
          </div>
          <div className='metrics-container'>
            <Metric metric={numFormater(stats.bal.populationCouverte)}>de la population couverte</Metric>
            <Metric metric={numFormater(stats.bal.nbAdresses)}> d’adresses issues des BAL</Metric>
            <Metric metric={communesCouvertesPercent} isPercent>de communes couvertes</Metric>
          </div>
          <ButtonLink href='' isOutlined color='white'>Carte de couverture des BAL</ButtonLink>
        </div>
        <style jsx>{`
          .deployement-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3em;
            margin-top: 3em;
          }

          .map-illustration {
            min-width: 290px;
            max-width: 400px;
          }

          .metrics-container {
            width: 100%;
            display: grid;
            justify-content: center;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            padding: 1em;
            gap: 3em;
            text-align: center;
            background: ${theme.colors.white};
            color: ${theme.darkText};
            border-radius: ${theme.borderRadius};
          }
        `}</style>
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
      <Infolettre />
    </Page>
  )
}

Home.getInitialProps = async () => {
  const stats = await getBALStats()
  return {
    stats
  }
}

Home.propTypes = {
  stats: PropTypes.shape({
    france: PropTypes.object.isRequired,
    bal: PropTypes.object.isRequired,
    ban: PropTypes.object.isRequired
  }).isRequired}

export default Home
