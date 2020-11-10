import React from 'react'

import theme from '../styles/theme'

import Ribbon from '../components/ribbon'

import Page from '../layouts/main'
import Hero from '../components/hero'
import Section from '../components/section'
import Button from '../components/button'
import DocDownload from '../components/doc-download'

export default () => (
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

    <Section background='grey'>
      <form
        action='https://gouv.us15.list-manage.com/subscribe/post?u=f4e80584578b65fde5aadffb6&amp;id=d33ef3dd55'
        method='post'
        name='mc-embedded-subscribe-form'
        target='_blank'
        noValidate
      >
        <h2>Pour être informé des nouveautés, inscrivez-vous à notre newsletter :</h2>
        <input type='email' title='email' name='EMAIL' placeholder='Votre adresse email' aria-label='email' />

        <Button type='submit' name='subscribe' style={{
          width: '100%',
          textTransform: 'uppercase'
        }}
        >
          Inscription
        </Button>
      </form>

      <style jsx>{`
        form {
          max-width: 640px;
          margin: auto;
        }

        h2 {
          margin: 0 auto 2em;
          max-width: 640px;
          font-size: 1.3em;
          font-style: italic;
          text-align: center;
        }

        input {
          box-sizing: border-box;
          display: block;
          width: 100%;
          border: none;
          outline: none;
          padding: 16px 20px;
          font: inherit;
          line-height: 1.6;
          font-size: 1.3em;
          border-radius: 2px;
          margin-bottom: 1em;
        }
      `}</style>
    </Section>
  </Page>
)
