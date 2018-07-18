import React from 'react'
import FaTable from 'react-icons/lib/fa/table'
import Page from '../layouts/main'

import Head from '../components/head'
import Csv from '../components/csv/csv'

const title = 'Géocoder un fichier CSV'
const description = 'adresse.data.gouv.fr met en place des outils pour une prise en main rapide des données adresses ouvertes.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaTable />}>
      <strong>adresse.data.gouv.fr</strong> met en place des outils pour une prise en main rapide des données adresses ouvertes.
    </Head>
    <Csv />
  </Page>
)
