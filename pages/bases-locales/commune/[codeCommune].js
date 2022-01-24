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
import BALDownload from '@/components/bases-locales/commune/bal-download'
import Historique from '@/components/bases-locales/commune/historique'

function Commune({communeInfos, mairieContact, revisions, codeCommune, currentRevision}) {
  return (
    <Page id='page' title={`Informations sur la commune de ${communeInfos.nomCommune}`}>
      <Head title={`Informations sur la commune de ${communeInfos.nomCommune}`} icon={<Home size={56} />} />

      <CommuneInfos communeInfos={communeInfos} />
      <BALState
        nbNumeros={communeInfos.nbNumeros}
        communeName={communeInfos.nomCommune}
        nbNumerosCertifies={communeInfos.nbNumerosCertifies}
        mairieContact={mairieContact}
        revision={currentRevision}
        codeCommune={codeCommune}
      />
      <BALDownload communeName={communeInfos.nomCommune} codeCommune={codeCommune} isFileAvailable={Boolean(currentRevision)} />
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
  const {telephone, email} = mairie.features[0].properties

  try {
    currentRevision = await getCurrentRevision(codeCommune)
  } catch {
    currentRevision = null
  }

  return {
    codeCommune,
    communeInfos: commune,
    mairieContact: {telephone, email},
    revisions,
    currentRevision
  }
}

Commune.propTypes = {
  communeInfos: PropTypes.object.isRequired,
  mairieContact: PropTypes.object.isRequired,
  codeCommune: PropTypes.string.isRequired,
  currentRevision: PropTypes.object,
  revisions: PropTypes.array,
}

Commune.defaultType = {
  revision: [],
  currentRevision: null
}

export default withErrors(Commune)
