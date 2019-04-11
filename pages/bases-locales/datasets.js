import React from 'react'
import PropTypes from 'prop-types'
import FaDatabase from 'react-icons/lib/fa/database'

import {getDatasets} from '../../lib/bal/api'

import Page from '../../layouts/main'
import Head from '../../components/head'
import Section from '../../components/section'
import withErrors from '../../components/hoc/with-errors'

import BasesAdresseLocales from '../../components/bases-locales/bases-adresse-locales'

const title = 'Bases adresse locales'
const description = 'Liste des bases adresse locales'

class Datasets extends React.Component {
  render() {
    const {datasets} = this.props

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<FaDatabase />} />
        <Section>
          <BasesAdresseLocales datasets={datasets} />
        </Section>
      </Page>
    )
  }
}

Datasets.propTypes = {
  datasets: PropTypes.array.isRequired
}

Datasets.getInitialProps = async () => {
  return {
    datasets: await getDatasets()
  }
}

export default (withErrors(Datasets))
