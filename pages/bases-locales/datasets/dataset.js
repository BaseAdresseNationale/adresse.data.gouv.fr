import React from 'react'
import PropTypes from 'prop-types'

import {_get} from '../../../lib/fetch'

import Page from '../../../layouts/main'
import withErrors from '../../../components/hoc/with-errors'

import Dataset from '../../../components/bases-locales/bases-adresse-locales/dataset'

class DatasetPage extends React.Component {
  render() {
    const {dataset, report} = this.props
    const description = `${dataset.title} - ${dataset.organization.name}`

    return (
      <Page title={dataset.title} description={description}>
        <Dataset dataset={dataset} report={report} />
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
  report: PropTypes.object
}

DatasetPage.defaultProps = {
  report: null
}

DatasetPage.getInitialProps = async ({query}) => {
  return {
    dataset: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}`),
    report: query.report ? await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}/report`) : null
  }
}

export default (withErrors(DatasetPage))
