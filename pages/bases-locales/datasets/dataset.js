import React from 'react'
import PropTypes from 'prop-types'

import {getSummary, getDataset} from '@/lib/bal/api'

import Page from '@/layouts/main'
import withErrors from '@/components/hoc/with-errors'

import Dataset from '@/components/bases-locales/bases-adresse-locales/dataset'

class DatasetPage extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired
  }

  render() {
    const {dataset, summary} = this.props

    return (
      <Page title={dataset.title} description={dataset.title}>
        <Dataset dataset={dataset} summary={summary} />
      </Page>
    )
  }
}

DatasetPage.getInitialProps = async ({query}) => {
  return {
    summary: await getSummary(query.id),
    dataset: await getDataset(query.id)
  }
}

export default withErrors(DatasetPage)
