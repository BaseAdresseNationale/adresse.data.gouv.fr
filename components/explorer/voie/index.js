import React from 'react'
import PropTypes from 'prop-types'
import Router, {withRouter} from 'next/router'

import Section from '../../section'

import Head from './head'
import Infos from './infos'
import MapContainer from './map-container'
import AddressesTable from './addresses-table'

const Voie = ({commune, voie, numero, router}) => {
  const handleSelect = numero => {
    const {codeCommune, codeVoie} = router.query
    const href = `/explore/commune/voie?codeCommune=${codeCommune}&codeVoie=${codeVoie}${numero ? `&numero=${numero}` : ''}`
    const as = `/explore/commune/${codeCommune}/voie/${codeVoie}${numero ? `/numero/${numero}` : ''}`

    Router.push(href, as)
  }

  return (
    <Section>
      <Head commune={commune} nomVoie={voie.nomVoie} />
      <Infos voie={voie} />
      <MapContainer
        voie={voie}
        addresses={voie.numeros}
        numero={numero}
        onSelect={handleSelect} />
      <AddressesTable
        addresses={voie.numeros}
        numero={numero}
        onSelect={handleSelect} />
    </Section>
  )
}

Voie.propTypes = {
  commune: PropTypes.object,
  voie: PropTypes.shape({
    nomVoie: PropTypes.string.isRequired,
    codeCommune: PropTypes.string.isRequired,
    nomCommune: PropTypes.string.isRequired,
    numeros: PropTypes.array.isRequired
  }),
  numero: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }).isRequired
}

Voie.defaultProps = {
  commune: null,
  voie: null,
  numero: null
}

export default (withRouter(Voie))
