import React from 'react'
import PropTypes from 'prop-types'
import {Database} from 'react-feather'

import {getDatasets} from '@/lib/bal/api'

import Page from '@/layouts/main'
import Head from '@/components/head'
import withErrors from '@/components/hoc/with-errors'

import BasesAdresseLocales from '@/components/bases-locales/bases-adresse-locales'

const title = 'Bases adresse locales'
const description = 'Liste des bases adresse locales'

class Datasets extends React.Component {
  static propTypes = {
    datasets: PropTypes.array.isRequired
  }

  render() {
    const {datasets} = this.props

    return (
      <Page title={title} description={description}>
        <Head title={title} icon={<Database size={56} />} />
        <BasesAdresseLocales datasets={datasets} />
      </Page>
    )
  }
}

Datasets.getInitialProps = async () => {
  return {
    datasets: await getDatasets({noContour: true})
  }
}

export default (withErrors(Datasets))
