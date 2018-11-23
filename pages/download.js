import React from 'react'
import DownloadIcon from 'react-icons/lib/fa/download'
import Page from '../layouts/main'

import Head from '../components/head'
import Download from '../components/download'

const title = 'Données brutes'
const description = 'adresse.data.gouv.fr met en place des outils pour une prise en main rapide des données adresses ouvertes.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<DownloadIcon />} />
    <Download />
  </Page>
)
