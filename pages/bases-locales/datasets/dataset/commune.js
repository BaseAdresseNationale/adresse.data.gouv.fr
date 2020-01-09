import React from 'react'
import PropTypes from 'prop-types'

import {getCommune, getDataset} from '../../../../lib/bal/api'

import Page from '../../../../layouts/main'
import withErrors from '../../../../components/hoc/with-errors'

import Commune from '../../../../components/bases-locales/bases-adresse-locales/dataset/commune'
import VoiesCommuneBases from '../../../../components/bases-locales/bases-adresse-locales/dataset/commune/voies-commune-bases'
import Section from '../../../../components/section'

class CommunePage extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    dataset: PropTypes.object.isRequired
  }

  render() {
    const {dataset, commune} = this.props
    const description = `${commune.nom} - ${commune.code}`
    return (
      <Page title={`Commune de ${commune.nom}`} description={description}>
        <Section>
          <Commune dataset={dataset} commune={commune} />
          <VoiesCommuneBases query={dataset} commune={commune} />
        </Section>
      </Page>
    )
  }
}

CommunePage.getInitialProps = async ({query}) => {
  const {id, codeCommune} = query

  return {
    dataset: await getDataset(id),
    commune: await getCommune(id, codeCommune)
  }
}

export default withErrors(CommunePage)
