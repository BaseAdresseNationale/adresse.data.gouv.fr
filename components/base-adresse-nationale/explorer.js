import React from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash'

import Commune from './commune'
import VoiesList from './voies-list'

function Explorer({commune, voie, numero}) {
  const {voies, nbVoies} = commune

  if (!commune) {
    return null
  }

  return (
    <div className='explorer-container'>
      <Commune {...commune} isShowDetails={!voie} />
      <VoiesList voies={orderBy(voies, 'nomVoie', 'asc')} nbVoies={nbVoies} selectedVoie={voie} />

      <style jsx>{`
        .explorer-container {
          height: 100%;
          padding: 0.5em;
        }
      `}</style>
    </div>
  )
}

Explorer.defaultProps = {
  commune: null,
  voie: null,
  numero: null
}

Explorer.propTypes = {
  commune: PropTypes.object,
  voie: PropTypes.object,
  numero: PropTypes.object
}

export default Explorer
