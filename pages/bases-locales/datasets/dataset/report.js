import React from 'react'
import PropTypes from 'prop-types'

import {getDataset, getReport} from '../../../../lib/bal/api'

import Page from '../../../../layouts/main'
import withErrors from '../../../../components/hoc/with-errors'

import BalReport from '../../../../components/bases-locales/bases-adresse-locales/bal-report'

class ReportPage extends React.Component {
  render() {
    const {dataset, report} = this.props
    const description = dataset.organization ? `${dataset.title} - ${dataset.organization.name}` : dataset.title

    return (
      <Page title={dataset.title} description={description}>
        <BalReport report={report} title={dataset.title} organization={dataset.organization} />
      </Page>
    )
  }

  static propTypes = {
    dataset: PropTypes.shape({
      organization: PropTypes.object,
      title: PropTypes.string.isRequired
    }).isRequired,
    report: PropTypes.object.isRequired
  }
}

ReportPage.getInitialProps = async ({query}) => {
  return {
    report: await getReport(query.id),
    dataset: await getDataset(query.id)
  }
}

export default withErrors(ReportPage)
