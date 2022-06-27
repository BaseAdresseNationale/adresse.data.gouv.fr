import PropTypes from 'prop-types'
import {ZoomIn} from 'react-feather'
import {getLabel} from '@ban-team/validateur-bal'

import theme from '@/styles/theme'

function IssueRows({issue, rows, isOnAllLines, onClick, type}) {
  const rowsCount = rows.length
  if (rowsCount === 0) {
    return null
  }

  const buttonLabel = `Afficher ${isOnAllLines ? 'toutes les lignes comportant l’alerte' : (rowsCount === 1 ? 'l’alerte' : `les ${rowsCount} alertes`)} ${getLabel(issue)}`

  return (
    <button type='button' aria-label={buttonLabel} className='issue' onClick={onClick}>
      <div>
        <b>{
          isOnAllLines ?
            'Toutes les lignes' :
            (rowsCount === 1 ?
              `La ligne ${rows[0].line}` :
              `${rowsCount} lignes`)
        }</b> {rowsCount === 1 ? 'comporte' : 'comportent'} l’alerte :

        <span className='colored'> {getLabel(issue)}</span>
      </div>

      <div><ZoomIn style={{margin: '0 .5em', verticalAlign: 'middle'}} alt='' /></div>

      <style jsx>{`
        .issue {
          padding: 0.4em 0;
          display: flex;
          justify-content: space-between;
          width: 100%;
          border: none;
          background: none;
        }

        .colored {
          color: ${type === 'error' ? theme.errorBorder : (type === 'warning' ? theme.warningBorder : theme.infoBorder)};
        }

        .issue:hover {
          cursor: pointer;
          background-color: #f8f8f8;
        }
        `}</style>
    </button>
  )
}

IssueRows.propTypes = {
  issue: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      line: PropTypes.number.isRequired
    })
  ).isRequired,
  isOnAllLines: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['error', 'warning', 'information']).isRequired,
  onClick: PropTypes.func.isRequired
}

export default IssueRows
