import React from 'react'
import dynamic from 'next/dynamic'
import Page from '../layouts/main'

import Loader from '../components/loader'

const MapSearch = dynamic(import('../components/map-search'), {
  ssr: false,
  loading: () => (
    <div className={'centered'}>
      <Loader />
      <p>Chargement…</p>
      <style jsx>{`
          .centered {
             position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}</style>
    </div>
    )
})

const title = 'Recherche d’adresses dans la Base Adresse Nationale'
const description = 'Cherchez des adresses et lieux-dits, zoomez et déplacez la carte pour faire un géocodage inversé.'

const Map = () => (
  <Page title={title} description={description} showFooter={false} >
    <MapSearch />
  </Page>
)

export default Map
