import React from 'react'
import {FileText} from 'react-feather'
import Page from '../layouts/main'

import Head from '../components/head'
import Csv from '../components/csv/csv'

const title = 'Géocoder un fichier CSV'
const description = 'adresse.data.gouv.fr met en place des outils pour une prise en main rapide des données adresses ouvertes.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FileText size={56} />} />
    <Csv />
  </Page>
)
