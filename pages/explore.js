import React from 'react'
import Page from '../layouts/main'

import Explorer from '../components/explorer'

const title = 'Consulter'
const description = 'Consulter les adresses'

const Explore = () => {
  return (
    <Page title={title} description={description}>
      <Explorer />
    </Page>
  )
}

export default Explore
