import React from 'react'
import PropTypes from 'prop-types'
import FaDatabase from 'react-icons/lib/fa/database'

import {_get} from '../../../lib/fetch'

import Page from '../../../layouts/main'
import Head from '../../../components/head'
import Section from '../../../components/section'
import withErrors from '../../../components/hoc/with-errors'

import Dataset from '../../../components/bases-locales/bases-adresse-locales/dataset'

const title = 'Fichier BAL'
const description = 'Fichier d’une base adresse locale'

class DatasetPage extends React.Component {
  render() {
    const {dataset} = this.props

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<FaDatabase />}>
          {description}
        </Head>
        <Section>
          <Dataset dataset={dataset} />
        </Section>
      </Page>
    )
  }
}

DatasetPage.propTypes = {
  dataset: PropTypes.object.isRequired
}

DatasetPage.getInitialProps = async ({query}) => {
  return {
    dataset: await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${query.id}`)
  }
}

export default (withErrors(DatasetPage))
