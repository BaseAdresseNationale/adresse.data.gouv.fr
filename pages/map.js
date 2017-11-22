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

const Map = () => (
  <Page showFooter={false}>
    <MapSearch />
  </Page>
)

export default Map
