import React from 'react'
import PropTypes from 'prop-types'
import {flowRight} from 'lodash'

import {_get} from '../../../lib/fetch'

import Page from '../../../layouts/main'
import withErrors from '../../../components/hoc/with-errors'
import withWebGl from '../../../components/hoc/with-web-gl'

import Dataset from '../../../components/bases-locales/bases-adresse-locales/dataset'

class DatasetPage extends React.Component {
  render() {
    const {dataset, communes, report} = this.props
    const description = `${dataset.title} - ${dataset.organization.name}`

    return (
      <Page title={dataset.title} description={description}>
        <Dataset dataset={dataset} communes={communes} report={report} />
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
  communes: PropTypes.array.isRequired,
  report: PropTypes.object
}

DatasetPage.defaultProps = {
  report: null
}

DatasetPage.getInitialProps = async ({query}) => {
  const summary = await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}/data/summary`)

  return {
    dataset: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}`),
    communes: summary.communes,
    report: query.report ? await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}/report`) : null
  }
}

export default flowRight(
  withErrors,
  withWebGl
)(DatasetPage)
