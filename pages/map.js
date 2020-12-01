import React, {useState, useEffect} from 'react'

import Page from '@/layouts/main'

import Map from '@/components/map'

const title = 'Carte interactive'
const description = 'Cherchez des adresses et lieux-dits.'

const MapPage = () => {
  const [hash, setHash] = useState({z: null, center: null})

  useEffect(() => {
    const {hash} = window.location

    if (hash) {
      const [z, lat, lng] = hash.slice(1, hash.lenght).split('/')
      setHash({zoom: z, center: [lng, lat]})
    }
  }, [])

  return (
    <Page title={title} description={description} hasFooter={false}>
      <Map defaultCenter={hash.center} defaultZoom={hash.zoom} />
    </Page>
  )
}

export default MapPage
