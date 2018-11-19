import React from 'react'
import PropTypes from 'prop-types'
import FaDatabase from 'react-icons/lib/fa/database'
import Page from '../layouts/main'

import {_get} from '../lib/fetch'
import {API_BAL_URL} from '../lib/bal/api'
import withErrors from '../components/hoc/with-errors'

import Head from '../components/head'
import BasesLocales from '../components/bases-locales'

const title = 'Bases locales'
const description = 'Bases de données Adresse de périmètre local, éditées sous la responsabilité des collectivités locales.'

class BasesLocalesPage extends React.Component {
  render() {
    const {datasets} = this.props

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<FaDatabase />} />
        <BasesLocales datasets={datasets} />
      </Page>
    )
  }
}

BasesLocalesPage.propTypes = {
  datasets: PropTypes.array.isRequired
}

BasesLocalesPage.getInitialProps = async () => {
  return {
    datasets: await _get(`${API_BAL_URL}/datasets`)
  }
}

export default withErrors(BasesLocalesPage)
