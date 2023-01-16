import PropTypes from 'prop-types'
import {uniqueId} from 'lodash'

import CoordinatesCopy from './numero/coordinates-copy'
import TargetLockIcon from '@/components/icons/target-lock'
import Button from '../button'

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
            <span className='position' size='small' style={{color: positionsColors[p?.positionType]?.color || '#FF6347'}}>
              {positionsColors[p.positionType]?.name || 'Inconnu'}
            </span>

            <a href={`#18/${p.position.coordinates[1]}/${p.position.coordinates[0]}`}>
              <Button color='secondary' size='small' style={{padding: '.5em'}} label='Centrer sur la position' >
                Centrer sur la carte<TargetLockIcon style={{verticalAlign: 'middle'}} alt aria-hidden='true' />
              </Button>
            </a>
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
          padding: 3px;
          font-weight: 600;
          text-align: center;
          flex: 1;
        }

        .array-positions {
          display: flex;
          padding: ${isMobile ? '.5em 0.25em' : '.25em'};
          gap: 0.5ch;
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
