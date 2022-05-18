/* eslint-disable unicorn/filename-case */
import PropTypes from 'prop-types'
import {Home} from 'react-feather'

import {getCommune} from '@/lib/api-ban'
import {getRevisions} from '@/lib/api-depot'
import {getMairie} from '@/lib/api-etablissements-public'
import withErrors from '@/components/hoc/with-errors'

import Page from '@/layouts/main'
import Head from '@/components/head'
import CommuneInfos from '@/components/commune/commune-infos'
import BALState from '@/components/commune/bal-state'
import Historique from '@/components/commune/historique'
import BalQuality from '@/components/commune/bal-quality'

function Commune({communeInfos, mairieInfos, revisions, codeCommune, currentRevision, typeCompositionAdresses}) {
  const hasRevision = Boolean(currentRevision)

  return (
    <Page id='page' title={`Informations sur la commune de ${communeInfos.nomCommune}`}>
      <Head title={`Informations sur la commune de ${communeInfos.nomCommune}`} icon={<Home size={56} />} />

      <CommuneInfos communeInfos={communeInfos} />
      <BALState
        communeInfos={communeInfos}
        mairieInfos={mairieInfos}
        revision={currentRevision}
        codeCommune={codeCommune}
        typeComposition={typeCompositionAdresses}
        hasMigratedBAL={hasRevision}
      />
      {typeCompositionAdresses !== 'assemblage' && (
        <>
          <BalQuality
            currentRevision={currentRevision}
            hasQualityAdresses={hasRevision}
          />
          <Historique
            revisions={revisions}
            communeName={communeInfos.nomCommune}
            hasHistoryAdresses={hasRevision}
          />
        </>
      )}
    </Page>
  )
}

Commune.getInitialProps = async ({query}) => {
  const {codeCommune} = query

  const commune = await getCommune(codeCommune)
  const mairie = await getMairie(codeCommune)
  const revisions = await getRevisions(codeCommune)

  const currentRevision = revisions.find(revision => revision.current)
  const typeCompositionAdresses = commune.typeComposition === 'assemblage' ? 'assemblage' : 'bal'

  return {
    codeCommune,
    communeInfos: commune,
    mairieInfos: mairie.features[0]?.properties,
    revisions,
    currentRevision,
    typeCompositionAdresses
  }
}

Commune.propTypes = {
  communeInfos: PropTypes.object.isRequired,
  mairieInfos: PropTypes.object,
  codeCommune: PropTypes.string.isRequired,
  typeCompositionAdresses: PropTypes.string.isRequired,
  currentRevision: PropTypes.object,
  revisions: PropTypes.array,
}

Commune.defaultType = {
  revision: [],
  currentRevision: null,
  mairieInfos: null
}

export default withErrors(Commune)
