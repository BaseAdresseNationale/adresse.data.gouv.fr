import React from 'react'
import PropTypes from 'prop-types'
import {Database} from 'react-feather'

import Page from '@/layouts/main'

import {getStats} from '@/lib/api-ban'
import withErrors from '@/components/hoc/with-errors'

import Head from '@/components/head'
import BasesLocales from '@/components/bases-locales'

const title = 'Bases Adresses Locales'
const description = 'Bases de données Adresse de périmètre local, éditées sous la responsabilité des collectivités locales.'

class BasesAdressesLocalesPage extends React.Component {
  static propTypes = {
    stats: PropTypes.object.isRequired
  }

  render() {
    const {stats} = this.props

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<Database size={56} alt aria-hidden='true' />} />
        <BasesLocales stats={stats} />
      </Page>
    )
  }
}

BasesAdressesLocalesPage.getInitialProps = async () => {
  return {
    stats: await getStats()
  }
}

export default withErrors(BasesAdressesLocalesPage)
