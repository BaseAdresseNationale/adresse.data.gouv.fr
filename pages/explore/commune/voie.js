import React from 'react'
import PropTypes from 'prop-types'

import Page from '../../../layouts/main'

import {getVoie, getNumero} from '../../../lib/explore/api'

import withErrors from '../../../components/hoc/with-errors'

import SearchCommune from '../../../components/explorer/search-commune'
import Voie from '../../../components/explorer/voie'

class VoieError extends Error {
  constructor(message) {
    super(message)
    this.name = 'VoieError'
    this.code = 404
  }
}

class VoiePage extends React.Component {
  render() {
    const {voie, selected} = this.props
    const description = 'Consulter les adresses'

    return (
      <Page title={voie.nomVoie} description={description}>
        <SearchCommune />
        <Voie voie={voie} selected={selected} />
      </Page>
    )
  }
}

VoiePage.propTypes = {
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    idVoie: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    nomVoie: PropTypes.string.isRequired,
    codeCommune: PropTypes.string.isRequired,
    nomCommune: PropTypes.string.isRequired,
    sources: PropTypes.array.isRequired,
    entries: PropTypes.array.isRequired,
    destination: PropTypes.array.isRequired,
    active: PropTypes.bool.isRequired,
    numeros: PropTypes.array.isRequired
  }),
  selected: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    numero: PropTypes.string.isRequired,
    idVoie: PropTypes.string.isRequired,
    codePostal: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    pseudoNumero: PropTypes.bool,
    destination: PropTypes.array,
    parcelles: PropTypes.array,
    active: PropTypes.bool.isRequired,
    sources: PropTypes.array.isRequired,
    entries: PropTypes.array.isRequired,
    libelleAcheminement: PropTypes.string,
    distanceMaxPositions: PropTypes.number,
    centrePositions: PropTypes.object
  })
}

VoiePage.defaultProps = {
  voie: null,
  selected: null
}

VoiePage.getInitialProps = async ({query}) => {
  const {codeCommune, codeVoie} = query
  const promises = [
    getVoie(codeCommune, codeVoie)
  ]

  if (query.numero) {
    promises.push(getNumero(codeCommune, codeVoie, query.numero))
  }

  const [voie, selected] = await Promise.all(promises)

  if (!voie) {
    throw new VoieError('La voie demandée n’a pas pu être trouvée')
  }

  return {
    voie,
    selected
  }
}

export default withErrors(VoiePage)
