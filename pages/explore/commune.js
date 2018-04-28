import React from 'react'
import PropTypes from 'prop-types'
import {_get} from '../../lib/fetch'

import Page from '../../layouts/main'
import Section from '../../components/section'
import withErrors from '../../components/hoc/with-errors'

import SearchCommune from '../../components/explorer/search-commune'
import Commune from '../../components/explorer/commune'
import VoiesCommune from '../../components/explorer/commune/voies-commune'

class CommunePage extends React.Component {
  state = {
    communeVoiesPromise: null
  }

  componentDidMount() {
    const {codeCommune} = this.props
    this.buildVoiesPromise(codeCommune)
  }

  componentWillReceiveProps(nextProps) {
    const {codeCommune} = this.props

    if (nextProps.codeCommune !== codeCommune) {
      this.buildVoiesPromise(nextProps.codeCommune)
    }
  }

  buildVoiesPromise(codeCommune) {
    this.setState(() => ({
      communeVoiesPromise: _get(`https://sandbox.geo.api.gouv.fr/explore/${codeCommune}`)
    }))
  }

  render() {
    const {communeVoiesPromise} = this.state
    const {commune} = this.props
    const description = `Consulter les voies de ${commune.nom}`

    return (
      <Page title={commune.nom} description={description}>
        <SearchCommune />

        <Section>
          <Commune {...commune} />
          <VoiesCommune promise={communeVoiesPromise} />
        </Section>
      </Page>
    )
  }
}

CommunePage.propTypes = {
  commune: PropTypes.object.isRequired,
  codeCommune: PropTypes.string.isRequired
}

const MLP = {
  75101: '75056',
  75102: '75056',
  75103: '75056',
  75104: '75056',
  75105: '75056',
  75106: '75056',
  75107: '75056',
  75108: '75056',
  75109: '75056',
  75110: '75056',
  75111: '75056',
  75112: '75056',
  75113: '75056',
  75114: '75056',
  75115: '75056',
  75116: '75056',
  75117: '75056',
  75118: '75056',
  75119: '75056',
  75120: '75056',

  69381: '69123',
  69382: '69123',
  69383: '69123',
  69384: '69123',
  69385: '69123',
  69386: '69123',
  69387: '69123',
  69388: '69123',
  69389: '69123',

  13201: '13055',
  13202: '13055',
  13203: '13055',
  13204: '13055',
  13205: '13055',
  13206: '13055',
  13207: '13055',
  13208: '13055',
  13209: '13055',
  13210: '13055',
  13211: '13055',
  13212: '13055',
  13213: '13055',
  13214: '13055',
  13215: '13055',
  13216: '13055'
}

CommunePage.getInitialProps = async ({query}) => {
  const fields = 'fields=code,nom,codesPostaux,surface,population,centre,contour,departement,region'
  const codeCommune = query.codeCommune in MLP ? MLP[query.codeCommune] : query.codeCommune
  return {
    codeCommune: query.codeCommune,
    commune: await _get(`https://geo.api.gouv.fr/communes/${codeCommune}?${fields}`)
  }
}

export default (withErrors(CommunePage))
