/* eslint-disable unicorn/filename-case */
import PropTypes from 'prop-types'
import {Home} from 'react-feather'

import {getCommune} from '@/lib/api-ban'
import withErrors from '@/components/hoc/with-errors'

import Page from '@/layouts/main'
import Head from '@/components/head'
import CommuneInfos from '@/components/bases-locales/commune/commune-infos'

function Commune({communeInfos}) {
  return (
    <Page id='page' title={`Informations sur la commune de ${communeInfos.nomCommune}`}>
      <Head title={`Informations sur la commune de ${communeInfos.nomCommune}`} icon={<Home size={56} />} />

      <CommuneInfos communeInfos={communeInfos} />
    </Page>
  )
}

Commune.getInitialProps = async ({query}) => {
  const {codeCommune} = query
  const commune = await getCommune(codeCommune)

  return {
    communeInfos: commune
  }
}

Commune.propTypes = {
  communeInfos: PropTypes.object.isRequired
}

export default withErrors(Commune)
