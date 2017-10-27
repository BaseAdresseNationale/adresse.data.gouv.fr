import React from 'react'
import dynamic from 'next/dynamic'
import Page from '../layouts/main'

const LeafletMap = dynamic(import('../components/map'), { ssr: false })

class Map extends React.Component {
  render() {
    return <Page><LeafletMap /></Page>
  }
}

export default Map
