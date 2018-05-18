import React from 'react'
import PropTypes from 'prop-types'
import FaCogs from 'react-icons/lib/fa/cogs'

import {_get} from '../../lib/fetch'

import Page from '../../layouts/main'
import Head from '../../components/head'
import Section from '../../components/section'
import withErrors from '../../components/hoc/with-errors'

import BalDataset from '../../components/bal/bal-dataset'

class DatasetPage extends React.Component {
  render() {
    const {dataset, report} = this.props
    const title = dataset.title
    const description = 'Rapport d’analyse du fichier'

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<FaCogs />}>
          {description}
        </Head>
        <Section>
          <BalDataset report={report} />
        </Section>
      </Page>
    )
  }
}

DatasetPage.propTypes = {
  dataset: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired,
  report: PropTypes.object.isRequired
}

DatasetPage.getInitialProps = async ({query}) => {
  return {
    dataset: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}`),
    report: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}/report`)
  }
}

export default (withErrors(DatasetPage))
