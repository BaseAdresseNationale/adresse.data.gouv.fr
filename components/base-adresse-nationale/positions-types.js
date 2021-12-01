import PropTypes from 'prop-types'
import {uniqueId} from 'lodash'

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

function PositionsTypes({positions}) {
  return (
    <div className='positions'>
      <div className='title'>Types de positions : </div>
      {positions.map(p => (
        <span key={uniqueId('_position')} className='position' style={{backgroundColor: positionsColors[p.positionType].color}}>
          {positionsColors[p.positionType].name}
        </span>
      ))}
      <style jsx>{`
        .title {
          margin: 5px 0;
        }

        .positions {
          font-style: italic;
          font-size: 17px;
          margin: .5em 0 1em 0;
        }

        .position {
          color: #FFF;
          padding: 2px 10px;
          margin: 2px 4px;
          border-radius: 4px;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

PositionsTypes.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default PositionsTypes
