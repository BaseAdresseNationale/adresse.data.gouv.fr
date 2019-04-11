import React from 'react'
import PropTypes from 'prop-types'

import {getCommune, getDataset} from '../../../../lib/bal/api'

import Page from '../../../../layouts/main'
import withErrors from '../../../../components/hoc/with-errors'

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
    dataset: await getDataset(id),
    commune: await getCommune(id, codeCommune)
  }
}

export default withErrors(CommunePage)
