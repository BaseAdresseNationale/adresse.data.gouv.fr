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

function Explorer({address, isMobile, isSafariBrowser}) {
  if (!address) {
    return <SearchMessage />
  }

  const Address = ADDRESSTYPES[address.type] || Numero
  const isCOM = address.commune ? (
    address.commune.region.code === address.commune.departement.code
  ) : (
    address.region.code === address.departement.code
  ) // Quick fix to check if the address is a COM or not. Will be change at this issue resolution => https://github.com/etalab/api-geo/issues/154

  return (
    <div className='explorer-container'>
      <Address {...address} isMobile={isMobile} isSafariBrowser={isSafariBrowser} isCOM={isCOM} />

      <style jsx>{`
        .explorer-container {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  )
}

Explorer.defaultProps = {
  address: null,
  isMobile: false,
  isSafariBrowser: false
}

Explorer.propTypes = {
  address: PropTypes.shape({
    type: PropTypes.oneOf(['commune', 'voie', 'lieu-dit', 'numero']),
    voies: PropTypes.array,
    nbVoies: PropTypes.number,
    commune: PropTypes.object,
    departement: PropTypes.object,
    region: PropTypes.object
  }),
  isMobile: PropTypes.bool,
  isSafariBrowser: PropTypes.bool
}

export default Explorer
