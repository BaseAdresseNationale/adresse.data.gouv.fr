/* eslint-disable unicorn/filename-case */
import PropTypes from 'prop-types'
import {Home} from 'react-feather'

import {getCommune, getRevisions, getCurrentRevision} from '@/lib/api-ban'
import {getMairie} from '@/lib/api-etablissements-public'
import withErrors from '@/components/hoc/with-errors'

import Page from '@/layouts/main'
import Head from '@/components/head'
import CommuneInfos from '@/components/bases-locales/commune/commune-infos'
import BALState from '@/components/bases-locales/commune/bal-state'
import Historique from '@/components/bases-locales/commune/historique'
import BalQuality from '@/components/bases-locales/commune/bal-quality'

function Commune({communeInfos, mairieInfos, revisions, codeCommune, currentRevision}) {
  return (
    <Page id='page' title={`Informations sur la commune de ${communeInfos.nomCommune}`}>
      <Head title={`Informations sur la commune de ${communeInfos.nomCommune}`} icon={<Home size={56} />} />

      <CommuneInfos communeInfos={communeInfos} />
      <BALState
        nbNumeros={communeInfos.nbNumeros}
        communeName={communeInfos.nomCommune}
        nbNumerosCertifies={communeInfos.nbNumerosCertifies}
        mairieInfos={mairieInfos}
        revision={currentRevision}
        codeCommune={codeCommune}
      />
      <BalQuality currentRevision={currentRevision} communeName={communeInfos.nomCommune} codeCommune={codeCommune} />
      <Historique revisions={revisions} communeName={communeInfos.nomCommune} />
    </Page>
  )
}

Commune.getInitialProps = async ({query}) => {
  const {codeCommune} = query

  const commune = await getCommune(codeCommune)
  const mairie = await getMairie(codeCommune)
  const revisions = await getRevisions(codeCommune)
  let currentRevision

  try {
    currentRevision = await getCurrentRevision(codeCommune)
  } catch {
    currentRevision = null
  }

  return {
    codeCommune,
    communeInfos: commune,
    mairieInfos: mairie.features[0].properties,
    revisions,
    currentRevision
  }
}

Commune.propTypes = {
  communeInfos: PropTypes.object.isRequired,
  mairieInfos: PropTypes.object.isRequired,
  codeCommune: PropTypes.string.isRequired,
  currentRevision: PropTypes.object,
  revisions: PropTypes.array,
}

Commune.defaultType = {
  revision: [],
  currentRevision: null
}

export default withErrors(Commune)
