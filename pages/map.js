import React from 'react'
import Page from '../layouts/main'

let LeafletMap

class Map extends React.Component {
  componentDidMount() {
    LeafletMap = require('../components/map').default
    this.forceUpdate()
  }

  render() {
    if (LeafletMap) {
      return <Page><LeafletMap /></Page>
    }
    return <Page />
  }
}

export default Map
