import React from 'react'

import {Compass} from 'react-feather'
import Page from '@/layouts/main'

import Head from '@/components/head'
import Apis from '@/components/apis'

const title = 'API Documentation'

function ApiPage() {
  return (
    <Page title={title} description='Documentations des APIs'>
      <Head title={title} icon={<Compass color='white' size={56} />} />
      <Apis />
    </Page>
  )
}

export default ApiPage
