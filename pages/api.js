import React from 'react'
import FaTerminal from 'react-icons/lib/fa/terminal'
import Page from '../layouts/main'

import Head from '../components/head'
import Api from '../components/api'

const title = 'API'
const description = 'Avec l’API d’adresse.data.gouv.fr, embarquez directement les données ouvertes dans votre application.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaTerminal />}>
      Avec l’API d’<strong>adresse.data.gouv.fr</strong>, embarquez directement les données ouvertes dans votre application.
    </Head>
    <Api />
  </Page>
)
