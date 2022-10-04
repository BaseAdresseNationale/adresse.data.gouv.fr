import PropTypes from 'prop-types'
import {uniqueId} from 'lodash'

import CoordinatesCopy from './numero/coordinates-copy'

export const positionsColors = {
  entrée: {name: 'Entrée', color: '#00CED1'},
  'délivrance postale': {name: 'Délivrance postale', color: '#9370DB'},
  bâtiment: {name: 'Bâtiment', color: '#CD5C5C'},
  'cage d’escalier': {name: 'Cage d’escalier', color: '#20B2AA'},
  logement: {name: 'Logement', color: '#C71585'},
  parcelle: {name: 'Parcelle', color: '#00BFFF'},
  segment: {name: 'Segment', color: '#6B8E23'},
  'service technique': {name: 'Service technique', color: '#9932CC'},
  inconnue: {name: 'Inconnu', color: '#FF6347'}
}

function PositionsTypes({positions, isMobile, isSafariBrowser, setCopyError, setIsCopySucceded, setIsCopyAvailable}) {
  return (
    <div className='positions'>
      <div className='title'>Types de positions : </div>
      <div>
        {positions.map(p => (
          <div key={uniqueId()} className='array-positions'>
            <span className='position' style={{backgroundColor: positionsColors[p?.positionType]?.color || '#FF6347'}}>
              {positionsColors[p.positionType]?.name || 'Inconnu'}
            </span>
            <CoordinatesCopy
              isMobile={isMobile}
              isSafariBrowser={isSafariBrowser}
              coordinates={{lat: p.position.coordinates[1], lon: p.position.coordinates[0]}}
              setCopyError={setCopyError}
              setIsCopySucceded={setIsCopySucceded}
              setIsCopyAvailable={setIsCopyAvailable}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        .title {
          margin: 5px 0;
        }

        .positions {
          font-style: italic;
          font-size: 17px;
          margin: .5em 0 1em 0;
          width: 100%;
        }

        .position {
          color: #FFF;
          padding: 3px 10px;
          margin: auto .5em;
          border-radius: 4px;
          font-weight: 600;
          text-align: center;
          flex: 1;
        }

        .array-positions {
          display: ${isMobile ? 'block' : 'flex'};
          padding: ${isMobile ? '.5em 0' : '.5em'};
        }
      `}</style>
    </div>
  )
}

PositionsTypes.defaultProps = {
  isMobile: false
}

PositionsTypes.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.shape({
    position: PropTypes.object.isRequired,
    positionType: PropTypes.string.isRequired
  })).isRequired,
  setCopyError: PropTypes.func.isRequired,
  setIsCopySucceded: PropTypes.func.isRequired,
  setIsCopyAvailable: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  isSafariBrowser: PropTypes.bool.isRequired
}

export default PositionsTypes
