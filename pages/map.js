import React from 'react'

import Page from '../layouts/main'

import Map from '../components/map'

const title = 'Carte interactive'
const description = 'Cherchez des adresses et lieux-dits.'

const MapPage = () => (
  <Page title={title} description={description} showFooter={false} >
    <Map />
  </Page>
)

export default MapPage
