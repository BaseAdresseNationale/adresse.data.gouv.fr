import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'

import Section from '../../section'

import Head from './head'
import MapContainer from './map-container'
import Infos from './infos'

class Voie extends React.Component {
  render() {
    const {data, router} = this.props
    const {commune, voies, addresses} = data
    const voie = voies.find(voie => voie.codeVoie === router.query.codeVoie)

    return (
      <Section>
        <Head commune={commune} voie={voie} />
        <Infos voie={voie} />
        <MapContainer addresses={addresses} />
      </Section>
    )
  }
}

Voie.propTypes = {
  data: PropTypes.array,
  router: PropTypes.shape({
    query: PropTypes.object.isRequired
  }).isRequired
}

Voie.defaultProps = {
  data: null
}

export default (withRouter(Voie))
