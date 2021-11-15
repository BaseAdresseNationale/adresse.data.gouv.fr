import React from 'react'
import PropTypes from 'prop-types'
import {Database} from 'react-feather'

import Page from '@/layouts/main'

import {getDatasets} from '@/lib/bal/api'
import withErrors from '@/components/hoc/with-errors'

import Head from '@/components/head'
import BasesLocales from '@/components/bases-locales'

const title = 'Bases Adresses Locales'
const description = 'Bases de données Adresse de périmètre local, éditées sous la responsabilité des collectivités locales.'

class BasesAdressesLocalesPage extends React.Component {
  static propTypes = {
    datasets: PropTypes.array.isRequired
  }

  render() {
    const {datasets} = this.props

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<Database size={56} />} />
        <BasesLocales datasets={datasets} />
      </Page>
    )
  }
}

BasesAdressesLocalesPage.getInitialProps = async () => {
  return {
    datasets: await getDatasets()
  }
}

export default withErrors(BasesAdressesLocalesPage)
