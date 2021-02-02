import React from 'react'
import Link from 'next/link'

import theme from '@/styles/theme'

import Ribbon from '@/components/ribbon'

import Page from '@/layouts/main'
import Hero from '@/components/hero'
import Section from '@/components/section'
import DocDownload from '@/components/doc-download'
import Infolettre from '@/components/infolettre'

function Home() {
  return (
    <Page>
      <Ribbon />
      <Hero
        title='Le site national des adresses'
        tagline='Référencer l’intégralité des adresses du territoire et les rendre utilisables par tous.' />

      <Section background='dark'>
        <div className='pitch'>
          <p>
            Pour que les <strong>services d’urgence</strong> arrivent au bon endroit, pour vous permettre de réaliser une analyse <strong>cartographique</strong> en quelques clics ou encore pour que les opérateurs <strong>publics et privés</strong> coordonnent mieux leurs chantiers, les adresses sont un véritable enjeu de <strong>souveraineté</strong> pour la France.
          </p>
          <p style={{marginTop: '3em'}}>
            Administrée par <strong>la DINUM</strong>, <strong>la Base Adresse Nationale</strong> privilégie le format <Link href='/bases-locales'>Base Adresse Locale</Link>. <Link href='/bases-locales/charte'>Une Charte</Link> encourage le partage des bonnes pratiques, permet aux <strong>organismes</strong> qui promeuvent activement <strong>le format Base Adresse Locale</strong> d’être identifiés et aux communes de se repérer.
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

      <Section title='La fibre arrive dans la commune' subtitle='Communes et opérateurs, vous pouvez gagner du temps'>
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
      <Infolettre />
    </Page>
  )
}

export default Home
