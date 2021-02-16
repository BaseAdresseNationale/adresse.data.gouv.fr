import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {take} from 'lodash'
import {X, Check, AlertTriangle} from 'react-feather'
import {getLabel} from '@etalab/bal'

import theme from '@/styles/theme'

import Notification from '../../../../notification'

import Row from './row'
import IssueRows from './issue-rows'

const ROWS_LIMIT = 50

function Summary({rows, fields}) {
  const [selectedIssue, setSelectedIssue] = useState(null)

  const rowsWithIssuesCount = rows.filter(row => row.errors && row.errors.length > 0).length
  const errorsGroups = {}
  const warningsGroups = {}

  rows.forEach(row => {
    row.errors.forEach(({code, level}) => {
      if (level === 'W') {
        if (!warningsGroups[code]) {
          warningsGroups[code] = []
        }

        warningsGroups[code].push(row)
      }

      if (level === 'E') {
        if (!errorsGroups[code]) {
          errorsGroups[code] = []
        }

        errorsGroups[code].push(row)
      }
    })
  })

  const errorsCount = Object.keys(errorsGroups).length
  const warningsCount = Object.keys(warningsGroups).length

  const unknowFields = []

  fields.forEach(field => {
    if (!field.schemaName) {
      unknowFields.push(field.name)
    }
  })

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

      {errorsCount > 0 && (
        <div className='issues-container'>
          <h4>
            {errorsCount} Erreur{errorsCount > 1 ? 's' : ''}
            <div className='summary-icon error'><X style={{verticalAlign: 'bottom'}} /></div>
          </h4>
          <div className='list'>
            {Object.keys(errorsGroups).map(error => (
              <IssueRows
                key={error}
                issue={error}
                rows={errorsGroups[error]}
                isOnAllLines={errorsGroups[error].length === rows.length}
                type='error'
                isSelected={error === selectedIssue}
                onClick={() => setSelectedIssue({code: error, rows: errorsGroups[error]})}
              />
            ))}
          </div>
        </div>
      )}

      {warningsCount > 0 && (
        <div className='issues-container'>
          <h4>
            {warningsCount} Avertissement{warningsCount > 1 ? 's' : ''}
            <div className='summary-icon warning'><AlertTriangle style={{verticalAlign: 'bottom'}} /></div>
          </h4>
          <div className='list'>
            {Object.keys(warningsGroups).map(warning => (
              <IssueRows
                key={warning}
                issue={warning}
                rows={warningsGroups[warning]}
                type='warning'
                isOnAllLines={warningsGroups[warning].length === rows.length}
                isSelected={warning === selectedIssue}
                onClick={() => setSelectedIssue({code: warning, rows: warningsGroups[warning]})}
              />
            ))}
          </div>
        </div>
      )}

      {selectedIssue && (
        <div className='selected-issue'>
          <div className='dialog'>
            <div className='flex-container'>
              <div>
                <h3>Ligne{selectedIssue.rows.length > 1 ? 's' : ''} avec l’anomalie :</h3>
                <h4>{getLabel(selectedIssue.code)}</h4>
              </div>
              <X size={40} style={{cursor: 'pointer'}} onClick={() => setSelectedIssue(null)} />
            </div>
            <div className='scroll'>

              {selectedIssue.rows.length > ROWS_LIMIT && (
                <Notification message={`Seules les ${ROWS_LIMIT} premières lignes avec anomalies sont affichées ici`} />
              )}

              {take(selectedIssue.rows, ROWS_LIMIT).map(row => (
                <Row
                  key={`row-${row.line}`}
                  row={row}
                  unknowFields={unknowFields}
                  isForcedShowIssues={selectedIssue.rows.length === 1}
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
          height: 100%;
          max-width: 1400px;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          background: ${theme.colors.white};
        }

        .flex-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .issues-container {
          border-left: 4px solid whitesmoke;
          padding-left: 1em;
        }

        .selected-issue {
          background-color: rgba(0,0,0,0.2);
          padding: 2em;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
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
  fields: PropTypes.array.isRequired
}

export default Summary
