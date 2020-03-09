import React from 'react'
import {Mail} from 'react-feather'

import Page from '../layouts/main'

import Head from '../components/head'

const title = 'Contact'
const description = 'Contactez l’équipe de adresse.data.gouv.fr'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<Mail size={56} />} />

  </Page>
)
