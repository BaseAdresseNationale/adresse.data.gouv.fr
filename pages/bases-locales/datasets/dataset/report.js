import React from 'react'
import PropTypes from 'prop-types'

import {API_BAL_URL} from '../../../../lib/bal/api'
import {_get} from '../../../../lib/fetch'

import Page from '../../../../layouts/main'
import withErrors from '../../../../components/hoc/with-errors'

import BalReport from '../../../../components/bases-locales/bases-adresse-locales/bal-report'

class ReportPage extends React.Component {
  render() {
    const {dataset, report} = this.props
    const description = `${dataset.title} - ${dataset.organization.name}`

    return (
      <Page title={dataset.title} description={description}>
        <BalReport report={report} organization={dataset.organization} />
      </Page>
    )
  }
}

ReportPage.propTypes = {
  dataset: PropTypes.shape({
    organization: PropTypes.object.isRequired
  }).isRequired,
  report: PropTypes.object.isRequired
}

ReportPage.getInitialProps = async ({query}) => {
  return {
    report: await _get(`${API_BAL_URL}/datasets/${query.id}/report`),
    dataset: await _get(`${API_BAL_URL}/datasets/${query.id}`)
  }
}

export default withErrors(ReportPage)
