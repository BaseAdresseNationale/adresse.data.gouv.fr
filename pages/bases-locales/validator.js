import React from 'react'
import FaTable from 'react-icons/lib/fa/table'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Validator from '../../components/bases-locales/validator'

const title = 'Le validateur BAL'

export default () => (
  <Page>
    <Head title={title} icon={<FaTable />} />
    <Validator />
  </Page>
)
