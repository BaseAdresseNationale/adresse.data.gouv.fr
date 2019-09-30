import React from 'react'
import FaTerminal from 'react-icons/lib/fa/terminal'
import Page from '../layouts/main'

import Head from '../components/head'
import Section from '../components/section'

const title = 'API'
const description = 'Avec l’API d’adresse.data.gouv.fr, embarquez directement les données ouvertes dans votre application.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaTerminal />} />

    <Section>
      <h3>Information</h3>
        La documentation de l’API Adresse a été déplacée. <a href='https://geo.api.gouv.fr/adresse'>Cliquez-ici</a> pour accéder à la nouvelle page.
    </Section>
  </Page>
)
