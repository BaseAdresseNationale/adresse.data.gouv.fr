import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Line from './line'
import RowIssues from './row-issues'
import {ChevronDown, ChevronUp} from 'react-feather'

function Row({row, isForcedShowIssues, isWarning, profile}) {
  const [showIssues, setShowIssues] = useState()
  const [field, setField] = useState()
  const issuesCount = row._errors.length

  const handleError = useCallback(() => {
    setShowIssues(!showIssues)
    setField(null)
  }, [showIssues])

  return (
    <div>
      <div className='line' onClick={handleError}>
        <div className='col'>
          <b>Ligne {row._line}</b> {row.cle_interop.rawValue && `[${row.cle_interop.rawValue}]`}
        </div>
        <div>
          {issuesCount === 1 ? (
            <span className={isWarning ? 'warning' : 'error'}>
              {showIssues ? 'Masquer' : 'Afficher'} l’anomalie {showIssues ? <ChevronUp style={{verticalAlign: 'middle', color: 'black'}} /> : <ChevronDown style={{verticalAlign: 'middle', color: 'black'}} />}
            </span>
          ) : (
            <span className={isWarning ? 'warning' : 'error'}>
              {showIssues ? 'Masquer' : 'Afficher'} les {issuesCount} anomalies {showIssues ? <ChevronUp style={{verticalAlign: 'middle', color: 'black'}} /> : <ChevronDown style={{verticalAlign: 'middle', color: 'black'}} />}
            </span>
          )}
        </div>
      </div>

      {showIssues &&
        <div className='issue'>
          <Line
            line={row}
            profile={profile}
            onHover={field => setField(field)}
          />

          {(issuesCount > 0 || isForcedShowIssues) && (
            <RowIssues errors={row._errors} field={field} profile={profile} />
          )}
        </div>}

      <style jsx>{`
        .issue {
          background-color: #f8f8f8;
        }

        .line {
          display: flex;
          align-items: center;
          padding: 0 1em;
          background-color: ${showIssues ? '#f8f8f8' : ''}
        }

        .col {
          margin: 0.5em 1em 0.5em 0;
        }

        .error {
          color: ${theme.errorBorder};
        }

        .warning {
          color: ${theme.warningBorder};
        }

        .line:hover {
          cursor: pointer;
          background-color: #f8f8f8;
        }

        .row-container {
          margin: 1em 0;
          padding: 1em;
          box-shadow: 0 1px 4px ${theme.boxShadow};
        }

        span {
          color: ${theme.darkText};
          text-decoration: italic;
        }
      `}</style>
    </div>
  )
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  isForcedShowIssues: PropTypes.bool,
  isWarning: PropTypes.bool.isRequired,
  profile: PropTypes.string.isRequired
}

Row.defaultProps = {
  isForcedShowIssues: false
}

export default Row
