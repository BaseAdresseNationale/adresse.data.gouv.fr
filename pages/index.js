import React from 'react'

import theme from '../styles/theme'

import Page from '../layouts/main'
import Hero from '../components/hero'
import OpenLicenceRibbon from '../components/open-licence-ribbon'
import Section from '../components/section'
import Button from '../components/button'

export default () => (
  <Page>
    <OpenLicenceRibbon />

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
            margin-top: -2em;
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

    <Section background='grey'>
      <form action='https://gouv.us15.list-manage.com/subscribe/post?u=f4e80584578b65fde5aadffb6&amp;id=d33ef3dd55' method='post' name='mc-embedded-subscribe-form' target='_blank' noValidate>
        <h2>Pour être informé des nouveautés, inscrivez-vous à notre newsletter :</h2>
        <input type='email' name='EMAIL' placeholder='Votre adresse email' />

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
