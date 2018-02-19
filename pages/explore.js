import React from 'react'
import dynamic from 'next/dynamic'
import Page from '../layouts/main'

const MapSearch = dynamic(import('../components/map/map-search'), {
  ssr: false,
  loading: () => (
    <div style={{textAlign: 'center', paddingTop: 20}}>
      Chargement…
    </div>
  )
})

const title = 'Carte interactive'
const description = 'Cherchez des adresses et lieux-dits, zoomez et déplacez la carte pour faire un géocodage inversé…'

const Explore = () => (
  <Page title={title} description={description} showFooter={false}>
    <MapSearch />
  </Page>
)

export default Explore
