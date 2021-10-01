import React from 'react'
import {Compass, Search} from 'react-feather'

import Page from '@/layouts/main'

import Head from '@/components/head'
import TechnicalDoc from '@/components/api-doc/api-adresse/technical-doc'

import doc from '@/components/api-doc/api-adresse/doc'

import ByAddressName from '@/components/api-doc/api-adresse/examples/by-address-name'
import CurlDoc from '@/components/api-doc/api-adresse/curl-doc'

const title = 'API Adresse'
const description = 'Cherchez des adresses et lieux-dits.'

const examples = [
  {title: 'Recherche par texte', id: 'text', icon: <Search />}
]

function Adresse() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Compass color='white' size={56} />}>
        {description}
      </Head>

      <CurlDoc />

      <TechnicalDoc {...doc} />

      <ByAddressName {...examples[0]} />

    </Page>
  )
}

export default Adresse
