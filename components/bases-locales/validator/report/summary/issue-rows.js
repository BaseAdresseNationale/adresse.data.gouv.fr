import React from 'react'
import PropTypes from 'prop-types'
import {ZoomIn} from 'react-feather'
import {getValidationErrorLabel} from '@etalab/bal'

import theme from '@/styles/theme'

function IssueRows({issue, rows, isSelected, onClick, type}) {
  const issuesRows = issue.rows.length

  if (issuesRows === 0) {
    return null
  }

  return (
    <div className='issue' onClick={onClick}>
      <div>
        <b>{
          issuesRows === rows.length ?
            'Toutes les lignes' :
            (issuesRows === 1 ?
              `La ligne ${issue.rows[0]}` :
              `${issuesRows} lignes`)
        }</b> {issuesRows === 1 ? 'comporte' : 'comportent'} l’anomalie :

        <span className='colored'> {getValidationErrorLabel(issue.message)}</span>
      </div>

      <div><ZoomIn style={{margin: '0 .5em', verticalAlign: 'middle'}} /></div>

      <style jsx>{`
        .issue {
          padding: 0.4em 0;
          background-color: ${isSelected ? '#f8f8f8' : ''};
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
  issue: PropTypes.shape({
    message: PropTypes.string.isRequired,
    rows: PropTypes.array.isRequired
  }).isRequired,
  rows: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['error', 'warning']).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

IssueRows.defaultProps = {
  isSelected: false
}

export default IssueRows
