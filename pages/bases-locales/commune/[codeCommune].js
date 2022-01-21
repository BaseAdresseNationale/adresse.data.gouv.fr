/* eslint-disable unicorn/filename-case */
import PropTypes from 'prop-types'
import {Home} from 'react-feather'

import {getCommune, getRevisions} from '@/lib/api-ban'
import {getMairie} from '@/lib/api-etablissements-public'
import withErrors from '@/components/hoc/with-errors'

import Page from '@/layouts/main'
import Head from '@/components/head'
import CommuneInfos from '@/components/bases-locales/commune/commune-infos'
import BALState from '@/components/bases-locales/commune/bal-state'

function Commune({communeInfos, mairieContact, revisions}) {
  const currentRevision = revisions.find(revision => revision.current)

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
      />
    </Page>
  )
}

Commune.getInitialProps = async ({query}) => {
  const {codeCommune} = query

  const commune = await getCommune(codeCommune)

  const mairie = await getMairie(codeCommune)
  const {telephone, email} = mairie.features[0].properties

  const revisions = await getRevisions(codeCommune)
  console.log(revisions)
  return {
    communeInfos: commune,
    mairieContact: {telephone, email},
    revisions
  }
}

Commune.propTypes = {
  communeInfos: PropTypes.object.isRequired,
  mairieContact: PropTypes.object.isRequired,
  revisions: PropTypes.array
}

Commune.defaultType = {
  revision: []
}

export default withErrors(Commune)
