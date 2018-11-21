import React from 'react'
import PropTypes from 'prop-types'
import {take, sortBy} from 'lodash'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../../styles/theme'

import Notification from '../../../notification'

import Row from './row'
import IssueRows from './issue-rows'

const ROWS_LIMIT = 100

class Rows extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIssue: null,
      rowsToDisplay: []
    }
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
        <h3>Résumé</h3>

        {errors.length > 0 && (
          <>
            <h4>
              Erreur{errors.count > 1 ? 's' : ''}
              <div className='icon error'><FaClose /></div>
            </h4>
            <div className='list'>
              {sortedErrors.map(error => (
                <IssueRows
                  key={error.message}
                  issue={error}
                  rows={rows}
                  type='error'
                  selected={error === selectedIssue}
                  onClick={this.selectIssue}
                />
              ))}
            </div>
          </>
        )}

        {warnings.length > 0 && (
          <>
            <h4>
              Avertissement{warnings.count > 1 ? 's' : ''}
              <div className='icon warning'><FaExclamationTriangle /></div>
            </h4>

            <div className='list'>
              {sortedWarnings.map(warning => (
                <IssueRows
                  key={warning.message}
                  issue={warning}
                  rows={rows}
                  type='warning'
                  selected={warning === selectedIssue}
                  onClick={this.selectIssue}
                />
              ))}
            </div>
          </>
        )}

        {selectedIssue && (
          <div className='issues-list'>
            <h3>Ligne{selectedIssue.rows.length > 1 ? 's' : ''} avec l’anomalie :</h3>
            <h4>{selectedIssue.message}</h4>

            {selectedIssue.rows.length > ROWS_LIMIT && (
              <Notification type='info'>
                Seules les {ROWS_LIMIT} premières lignes avec anomalies sont affichées ici
              </Notification>
            )}

            {rowsToDisplay.map(row => (
              <Row
                key={`row-${row._line}`}
                row={row}
                unknownFields={unknownFields}
                forceShowIssues={rowsToDisplay.length === 1}
              />
            ))}
          </div>
        )}

        <style jsx>{`
            .error {
              color: ${theme.errorBorder};
            }

            .warning {
              color: ${theme.warningBorder};
            }

            h4 {
              display: flex;
              align-items: center;
            }

            .list {
              display: grid;
              grid-row-gap: 0.5em;
            }

            .issues-list {
              padding: 1em;
              margin: 1em 0;
              box-shadow: 0 1px 4px ${theme.boxShadow};;
            }

            .icon {
              margin-left: 0.5em;
              padding-bottom: 0.1em;
            }
            `}</style>
      </div>
    )
  }
}

export default Rows

