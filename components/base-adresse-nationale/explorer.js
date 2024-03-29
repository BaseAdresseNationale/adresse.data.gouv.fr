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
      <ArrowUp alt='' aria-hidden='true' />
      <h1>Rechercher une adresse</h1>
      <style jsx>{`
        .search-message {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .search-message h1 {
          font-size: large;
          font-weight: bold;
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

  return (
    <div className='explorer-container'>
      <Address {...address} isMobile={isMobile} isSafariBrowser={isSafariBrowser} />

      <style jsx>{`
        .explorer-container {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0 .75em;
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
    nbVoies: PropTypes.number
  }),
  isMobile: PropTypes.bool,
  isSafariBrowser: PropTypes.bool
}

export default Explorer
