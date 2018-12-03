import React from 'react'
import PropTypes from 'prop-types'

import {API_BAL_URL} from '../../../lib/bal/api'
import {_get} from '../../../lib/fetch'

import Page from '../../../layouts/main'
import withErrors from '../../../components/hoc/with-errors'

import Dataset from '../../../components/bases-locales/bases-adresse-locales/dataset'

class DatasetPage extends React.Component {
  render() {
    const {dataset, summary} = this.props

    return (
      <Page title={dataset.title} description={dataset.title}>
        <Dataset dataset={dataset} summary={summary} />
      </Page>
    )
  }
}

DatasetPage.propTypes = {
  dataset: PropTypes.object.isRequired,
  summary: PropTypes.object.isRequired
}

DatasetPage.getInitialProps = async ({query}) => {
  return {
    summary: await _get(`${API_BAL_URL}/datasets/${query.id}/data/summary`),
    dataset: await _get(`${API_BAL_URL}/datasets/${query.id}`)
  }
}

export default withErrors(DatasetPage)
