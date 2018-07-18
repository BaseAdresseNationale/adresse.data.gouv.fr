import React from 'react'
import dynamic from 'next/dynamic'

import Page from '../layouts/main'
import withWebGl from '../components/hoc/with-web-gl'

import Loader from '../components/loader'

const Map = dynamic(import('../components/map'), {
  ssr: false,
  loading: () => (
    <div className='centered'>
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

const title = 'Carte interactive'
const description = 'Cherchez des adresses et lieux-dits.'

const MapPage = () => (
  <Page title={title} description={description} showFooter={false} >
    <Map />
  </Page>
)

export default withWebGl(MapPage)
