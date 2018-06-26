import React from 'react'
import PropTypes from 'prop-types'
import {flowRight} from 'lodash'

import {_get} from '../../../../lib/fetch'

import Page from '../../../../layouts/main'
import withErrors from '../../../../components/hoc/with-errors'
import withWebGl from '../../../../components/hoc/with-web-gl'

import Commune from '../../../../components/bases-locales/bases-adresse-locales/dataset/commune'

class CommunePage extends React.Component {
  render() {
    const {dataset, commune} = this.props
    const description = `${commune.nom} - ${commune.code}`

    return (
      <Page title={`Commune de ${commune.nom}`} description={description}>
        <Commune dataset={dataset} commune={commune} />
      </Page>
    )
  }
}

CommunePage.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  dataset: PropTypes.object.isRequired
}

CommunePage.getInitialProps = async ({query}) => {
  const {id, codeCommune} = query

  return {
    dataset: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${id}`),
    commune: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${id}/data/${codeCommune}`)
  }
}

export default flowRight(
  withErrors,
  withWebGl
)(CommunePage)
