import React from 'react'
import PropTypes from 'prop-types'
import {take, sortBy} from 'lodash'
import {AlertTriangle, X} from 'react-feather'

import theme from '@/styles/theme'

import Notification from '../../../notification'

import Row from './row'
import IssueRows from './issue-rows'

const ROWS_LIMIT = 100

class Summary extends React.Component {
  state = {
    selectedIssue: null,
    rowsToDisplay: []
  }

  static propTypes = {
    rows: PropTypes.array.isRequired,
    issuesSummary: PropTypes.shape({
      errors: PropTypes.array.isRequired,
      warnings: PropTypes.array.isRequired
    }).isRequired,
    unknownFields: PropTypes.array
  }

  static defaultProps = {
    unknownFields: []
  }

  selectIssue = selectedIssue => {
    const {rows} = this.props

    if (selectedIssue === this.state.selectedIssue) {
      this.setState({
        selectedIssue: null,
        rowsToDisplay: []
      })
    } else {
      const filteredRows = rows.filter(row => selectedIssue.rows.includes(row._line))
      this.setState({
        selectedIssue,
        rowsToDisplay: take(filteredRows, ROWS_LIMIT)
      })
    }
  }

  render() {
    const {selectedIssue, rowsToDisplay} = this.state
    const {rows, issuesSummary, unknownFields} = this.props
    const {errors, warnings} = issuesSummary
    const sortedErrors = sortBy(errors, error => error.rows.length)
    const sortedWarnings = sortBy(warnings, warning => warning.rows.length)

    return (
      <div>

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
                  onClick={this.selectIssue}
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
                  onClick={this.selectIssue}
                />
              ))}
            </div>
          </>
        )}

        {selectedIssue && (
          <div className='selected-issue'>
            <h3>Ligne{selectedIssue.rows.length > 1 ? 's' : ''} avec l’anomalie :</h3>
            <h4>{selectedIssue.message}</h4>

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
        )}

        <style jsx>{`
            .selected-issue {
              background-color: #f8f8f8;
              padding: 0 .5em;
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
}

export default Summary
