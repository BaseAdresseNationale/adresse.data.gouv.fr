import PropTypes from 'prop-types'
import {ZoomIn} from 'react-feather'
import {getLabel} from '@etalab/bal'

import theme from '@/styles/theme'

function IssueRows({issue, rows, isOnAllLines, onClick, type}) {
  const rowsCount = rows.length
  if (rowsCount === 0) {
    return null
  }

  return (
    <div className='issue' onClick={onClick}>
      <div>
        <b>{
          isOnAllLines ?
            'Toutes les lignes' :
            (rowsCount === 1 ?
              `La ligne ${rows[0].line}` :
              `${rowsCount} lignes`)
        }</b> {rowsCount === 1 ? 'comporte' : 'comportent'} l’anomalie :

        <span className='colored'> {getLabel(issue)}</span>
      </div>

      <div><ZoomIn style={{margin: '0 .5em', verticalAlign: 'middle'}} /></div>

      <style jsx>{`
        .issue {
          padding: 0.4em 0;
          display: flex;
          justify-content: space-between;
        }

        .colored {
          color: ${type === 'error' ? theme.errorBorder : theme.warningBorder};
        }

        .issue:hover {
          cursor: pointer;
          background-color: #f8f8f8;
        }
        `}</style>
    </div>
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
  type: PropTypes.oneOf(['error', 'warning']).isRequired,
  onClick: PropTypes.func.isRequired
}

export default IssueRows
