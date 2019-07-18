import React from 'react'
import PropTypes from 'prop-types'

import Page from '../layouts/main'

import Map from '../components/map'

const title = 'Carte interactive'
const description = 'Cherchez des adresses et lieux-dits.'

const MapPage = ({center, zoom}) => (
  <Page title={title} description={description} showFooter={false} >
    <Map defaultCenter={center} defaultZoom={zoom} />
  </Page>
)

MapPage.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number
}

MapPage.defaultProps = {
  center: null,
  zoom: null
}

MapPage.getInitialProps = ({query}) => {
  const {lat, lng, z} = query

  return {
    center: lng && lat ? [Number(lng), Number(lat)] : null,
    zoom: Number(z)
  }
}

export default MapPage
