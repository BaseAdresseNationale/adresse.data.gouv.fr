import React from 'react'
import PropTypes from 'prop-types'
import {ArrowUp} from 'react-feather'

import Commune from './commune'
import Voie from './voie'
import Numero from './numero'

const ADDRESSTYPES = {
  commune: Commune,
  voie: Voie,
  'lieu-dit': Voie
}

function SearchMessage() {
  return (
    <div className='search-message'>
      <ArrowUp />
      <h4>Rechercher une adresse</h4>
      <style jsx>{`
        .search-message {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        `}</style>
    </div>
  )
}

function Explorer({address, handleSelect}) {
  if (!address) {
    return <SearchMessage />
  }

  const Address = ADDRESSTYPES[address.type] || Numero

  return (
    <div className='explorer-container'>
      <Address {...address} handleSelect={handleSelect} />

      <style jsx>{`
        .explorer-container {
          height: 100%;
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
}

Explorer.defaultProps = {
  address: null
}

Explorer.propTypes = {
  address: PropTypes.shape({
    type: PropTypes.oneOf(['commune', 'voie', 'numero']),
    voies: PropTypes.array,
    nbVoies: PropTypes.number
  }),
  handleSelect: PropTypes.func.isRequired
}

export default Explorer
