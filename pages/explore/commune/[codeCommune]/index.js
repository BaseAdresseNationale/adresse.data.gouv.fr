import React from 'react'
import PropTypes from 'prop-types'
import {getCommune} from '../../../../lib/api-geo'
import {getCommune as getCommuneExplore} from '../../../../lib/explore/api'

import Page from '../../../../layouts/main'
import Section from '../../../../components/section'
import withErrors from '../../../../components/hoc/with-errors'

import Header from '../../../../components/explorer/header'
import Commune from '../../../../components/explorer/commune'
import VoiesCommune from '../../../../components/explorer/commune/voies-commune'

const contourToFeatureCollection = commune => {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: commune.contour,
      id: commune.code,
      properties: {}
    }]
  }
}

const CommunePage = ({commune, voiesInfos}) => {
  const {voies} = voiesInfos

  return (
    <Page title={commune.nom} description={`Consulter les voies de ${commune.nom}`}>
      <Header />

      <Section>
        <Commune commune={commune} voiesInfos={voiesInfos} />
        <VoiesCommune voies={voies} commune={commune} style={{height: '300px'}} />
      </Section>
    </Page>
  )
}

CommunePage.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    contour: PropTypes.object.isRequired
  }).isRequired,
  voiesInfos: PropTypes.shape({
    voies: PropTypes.array.isRequired
  }).isRequired
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
  const commune = await getCommune(codeCommune, fields)
  const voiesInfos = await getCommuneExplore(codeCommune)

  commune.contour = contourToFeatureCollection(commune)

  return {
    commune,
    voiesInfos
  }
}

export default withErrors(CommunePage)
