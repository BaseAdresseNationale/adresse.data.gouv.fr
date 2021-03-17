import React from 'react'
import Link from 'next/link'
import theme from '@/styles/theme'

import Page from '@/layouts/main'
import Hero from '@/components/hero'
import Section from '@/components/section'
import ButtonLink from '@/components/button-link'
import DocDownload from '@/components/doc-download'
import Temoignages from '@/components/temoignages'
import Infolettre from '@/components/infolettre'
import Partners from '@/components/bases-locales/charte/partners'

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
              margin-left: auto;
              margin-right: auto;
              max-width: 1000px;
          }
        `}</style>
        </div>
      </Section>

      <Section title='Adoptez la Charte de la Base Adresse Locale et rejoignez les organismes partenaires'>
        <div className='charte-section' >
          <p>Administrée par <b>la DINUM</b>, <b>la Base Adresse Nationale</b> privilégie le format <Link href='/bases-locales'>Base Adresse Locale</Link>.</p>
          <p><b>Une Charte</b> encourage le partage des bonnes pratiques, permet aux <b>organismes</b> qui promeuvent activement <b>le format Base Adresse Locale</b> d’être identifiés et aux communes de se repérer.
          </p>
          <div className='centered'>
            <ButtonLink size='large' href='/bases-locales/charte'>
              Découvrir la charte
            </ButtonLink>
          </div>
          <div className='partners'>
            <h3>Nos partenaires</h3>
            <Partners isDetailed={false} />
          </div>

          <style jsx>{`
            .charte-section {
              margin-top: 3em;
              text-align: center;
            }

            .organismes-container {
              margin-top: 4em;
            }

            .partners {
              margin-top: 4em;
            }

            .centered {
              margin: 40px auto;
              display: flex;
              justify-content: center;
            }
            `}
          </style>
        </div>
      </Section>

      <Section background='grey' title='La fibre arrive dans la commune' subtitle='Communes et opérateurs, vous pouvez gagner du temps'>
        <DocDownload
          src='/images/previews/obligations-adresse-preview.png'
          alt='miniature du document obligations-adresse'
          link='https://adresse.data.gouv.fr/data/docs/communes-operateurs-obligations-adresse.pdf'
        >
          <p>
            Avant de vous lancer dans une opération d’adressage et d’engager les finances de la commune, prenez connaissance des actions nécessaires et suffisantes.
          </p>
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
      <Infolettre />
    </Page>
  )
}

export default Home
