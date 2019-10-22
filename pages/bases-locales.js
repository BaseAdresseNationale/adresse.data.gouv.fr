import React from 'react'
import PropTypes from 'prop-types'
import FaDatabase from 'react-icons/lib/fa/database'
import Page from '../layouts/main'

import {getDatasets, getStats} from '../lib/bal/api'
import withErrors from '../components/hoc/with-errors'

import Head from '../components/head'
import BasesLocales from '../components/bases-locales'

const title = 'Bases locales'
const description = 'Bases de données Adresse de périmètre local, éditées sous la responsabilité des collectivités locales.'

class BasesLocalesPage extends React.Component {
  render() {
    const {datasets, stats} = this.props

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<FaDatabase />} />
        <BasesLocales datasets={datasets} stats={stats} />
      </Page>
    )
  }

  static propTypes = {
    datasets: PropTypes.array.isRequired,
    stats: PropTypes.object.isRequired
  }
}

BasesLocalesPage.getInitialProps = async () => {
  return {
    datasets: await getDatasets(),
    stats: await getStats()
  }
}

export default withErrors(BasesLocalesPage)
