import React from 'react'
import PropTypes from 'prop-types'
import FaDatabase from 'react-icons/lib/fa/database'

import {_get} from '../lib/fetch'

import Page from '../layouts/main'
import Head from '../components/head'
import Section from '../components/section'
import withErrors from '../components/hoc/with-errors'

import BasesAdresseLocales from '../components/bases-adresse-locales'

const title = 'Bases adresse locales'
const description = 'Liste des bases adresse locales'

class BasesAdresseLocalesPage extends React.Component {
  render() {
    const {datasets} = this.props

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<FaDatabase />}>
          {description}
        </Head>
        <Section>
          <BasesAdresseLocales datasets={datasets} />
        </Section>
      </Page>
    )
  }
}

BasesAdresseLocalesPage.propTypes = {
  datasets: PropTypes.array.isRequired
}

BasesAdresseLocalesPage.getInitialProps = async () => {
  return {
    datasets: await _get('https://adresse.data.gouv.fr/api-bal/datasets')
  }
}

export default (withErrors(BasesAdresseLocalesPage))
