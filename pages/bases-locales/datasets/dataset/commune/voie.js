import React from 'react'
import PropTypes from 'prop-types'

import {_get} from '../../../../../lib/fetch'

import Page from '../../../../../layouts/main'
import withErrors from '../../../../../components/hoc/with-errors'

import Voie from '../../../../../components/bases-locales/bases-adresse-locales/dataset/commune/voie'

class VoiePage extends React.Component {
  render() {
    const {dataset, commune, voie} = this.props
    const description = `${voie.nomVoie} - ${voie.codeVoie}`

    return (
      <Page title={`Voie ${voie.nomVoie}`} description={description}>
        <Voie dataset={dataset} commune={commune} voie={voie} />
      </Page>
    )
  }
}

VoiePage.propTypes = {
  voie: PropTypes.shape({
    nomVoie: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired
}

VoiePage.getInitialProps = async ({query}) => {
  const {id, codeCommune, codeVoie} = query

  return {
    dataset: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${id}`),
    commune: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${id}/data/${codeCommune}`),
    voie: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${id}/data/${codeCommune}/${codeVoie}`)
  }
}

export default withErrors(VoiePage)
