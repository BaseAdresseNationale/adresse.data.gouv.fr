import React from 'react'
import PropTypes from 'prop-types'

import {_get} from '../../../lib/fetch'

import Page from '../../../layouts/main'
import withErrors from '../../../components/hoc/with-errors'

import Dataset from '../../../components/bases-locales/bases-adresse-locales/dataset'

class DatasetPage extends React.Component {
  render() {
    const {dataset, summary} = this.props
    const description = `${dataset.title} - ${dataset.organization.name}`

    return (
      <Page title={dataset.title} description={description}>
        <Dataset dataset={dataset} summary={summary} />
      </Page>
    )
  }
}

DatasetPage.propTypes = {
  dataset: PropTypes.shape({
    title: PropTypes.string.isRequired,
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  summary: PropTypes.object.isRequired
}

DatasetPage.getInitialProps = async ({query}) => {
  const summary = await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}/data/summary`)

  return {
    summary,
    dataset: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}`)
  }
}

export default withErrors(DatasetPage)
