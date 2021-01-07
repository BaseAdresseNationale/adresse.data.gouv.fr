import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {take, sortBy} from 'lodash'
import {AlertTriangle, X, Check} from 'react-feather'

import theme from '@/styles/theme'

import Notification from '../../../../notification'

import Row from './row'
import IssueRows from './issue-rows'

const ROWS_LIMIT = 50

function Summary({rows, issuesSummary, unknownFields, rowsWithIssuesCount}) {
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [rowsToDisplay, setRowsToDisplay] = useState()
  const {errors, warnings} = issuesSummary
  const sortedErrors = sortBy(errors, error => error.rows.length)
  const sortedWarnings = sortBy(warnings, warning => warning.rows.length)

  const selectIssue = issue => {
    if (issue === selectedIssue) {
      setSelectedIssue(null)
      setRowsToDisplay([])
    } else {
      const filteredRows = rows.filter(row => issue.rows.includes(row._line))
      setSelectedIssue(issue)
      setRowsToDisplay(take(filteredRows, ROWS_LIMIT))
    }
  }

  return (
    <div>

      {rowsWithIssuesCount === 0 ? (
        <h4>Aucune ligne avec anomalies trouvée <span className='valid'><Check /></span></h4>
      ) : (
        <div>
          {rowsWithIssuesCount > 1 ? (
            <h4>{rowsWithIssuesCount} lignes avec anomalies trouvées</h4>
          ) : (
            <h4>{rowsWithIssuesCount} ligne avec anomalies trouvée</h4>
          )}
        </div>
      )}

      {errors.length > 0 && (
        <>
          <h4>
            {errors.length} Erreur{errors.length > 1 ? 's' : ''}
            <div className='summary-icon error'><X style={{verticalAlign: 'bottom'}} /></div>
          </h4>
          <div className='list'>
            {sortedErrors.map(error => (
              <IssueRows
                key={error.message}
                issue={error}
                rows={rows}
                type='error'
                isSelected={error === selectedIssue}
                onClick={selectIssue}
              />
            ))}
          </div>
        </>
      )}

      {warnings.length > 0 && (
        <>
          <h4>
            {warnings.length} Avertissement{warnings.length > 1 ? 's' : ''}
            <div className='summary-icon warning'><AlertTriangle style={{verticalAlign: 'bottom'}} /></div>
          </h4>

          <div className='list'>
            {sortedWarnings.map(warning => (
              <IssueRows
                key={warning.message}
                issue={warning}
                rows={rows}
                type='warning'
                isSelected={warning === selectedIssue}
                onClick={selectIssue}
              />
            ))}
          </div>
        </>
      )}

      {selectedIssue && (
        <div className='selected-issue'>
          <div className='dialog'>
            <div className='flex-container'>
              <div>
                <h3>Ligne{selectedIssue.rows.length > 1 ? 's' : ''} avec l’anomalie :</h3>
                <h4>{selectedIssue.message}</h4>
              </div>
              <X size={40} style={{cursor: 'pointer'}} onClick={() => setSelectedIssue(null)} />
            </div>
            <div className='scroll'>

              {selectedIssue.rows.length > ROWS_LIMIT && (
                <Notification message={`Seules les ${ROWS_LIMIT} premières lignes avec anomalies sont affichées ici`} />
              )}

              {rowsToDisplay.map(row => (
                <Row
                  key={`row-${row._line}`}
                  row={row}
                  unknownFields={unknownFields}
                  isForcedShowIssues={rowsToDisplay.length === 1}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scroll {
          max-height: 80%;
          overflow: auto;
          padding-top: .5em;
          border-top: 1px solid black;
        }

        .dialog {
          background-color: #fff;
          margin: auto;
          padding: 2em;
          height: 80%;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          background: ${theme.colors.white};
        }

        .flex-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .selected-issue {
          background-color: rgba(0,0,0,0.2);
          padding: 3em;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .error {
          color: ${theme.errorBorder};
        }

        .warning {
          color: ${theme.warningBorder};
        }

        h3, h4 {
          display: flex;
          margin: 1em 0;
        }

        .list {
          display: grid;
          grid-row-gap: 0.5em;
        }

        .summary-icon {
            margin-left: 0.5em;
        }
        `}</style>
    </div>
  )
}

Summary.propTypes = {
  rows: PropTypes.array.isRequired,
  issuesSummary: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    warnings: PropTypes.array.isRequired
  }).isRequired,
  unknownFields: PropTypes.array,
  rowsWithIssuesCount: PropTypes.number.isRequired
}

Summary.defaultProps = {
  unknownFields: []
}

export default Summary
