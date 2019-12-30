import React from 'react'
import PropTypes from 'prop-types'

import Page from '../../../layouts/main'

import {getVoie, getNumero} from '../../../lib/explore/api'

import withErrors from '../../../components/hoc/with-errors'

import Header from '../../../components/explorer/header'
import Voie from '../../../components/explorer/voie'

class VoieError extends Error {
  constructor(message) {
    super(message)
    this.name = 'VoieError'
    this.code = 404
  }
}

const VoiePage = ({commune, voie, numero}) => (
  <Page title={voie.nomVoie} description='Consulter les adresses'>
    <Header />
    <Voie commune={commune} voie={voie} numero={numero} />
  </Page>
)

VoiePage.propTypes = {
  commune: PropTypes.object,
  voie: PropTypes.shape({
    nomVoie: PropTypes.string.isRequired,
    codeCommune: PropTypes.string.isRequired,
    nomCommune: PropTypes.string.isRequired,
    numeros: PropTypes.array.isRequired
  }),
  numero: PropTypes.object
}

VoiePage.defaultProps = {
  commune: null,
  voie: null,
  numero: null
}

VoiePage.getInitialProps = async ({query}) => {
  const {idVoie} = query
  const promises = [
    getVoie(idVoie)
  ]

  if (query.numero) {
    promises.push(getNumero(idVoie, query.numero))
  }

  const [voie, numero] = await Promise.all(promises)

  if (!voie) {
    throw new VoieError('La voie demandée n’a pas pu être trouvée')
  }

  return {
    commune: {
      nom: voie.nomCommune,
      code: voie.codeCommune,
      departement: {
        code: voie.codeDepartement,
        nom: voie.nomDepartement
      }
    },
    voie,
    numero
  }
}

export default withErrors(VoiePage)
