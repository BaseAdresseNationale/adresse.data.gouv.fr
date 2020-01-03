import React from 'react'

import {Sliders} from 'react-feather'
import Page from '../layouts/main'

import Head from '../components/head'
import Tools from '../components/tools'

const title = 'Outils'
const description = 'adresse.data.gouv.fr met en place des outils pour une prise en main rapide des données adresses ouvertes.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<Sliders size={56} />} />
    <Tools />
  </Page>
)
