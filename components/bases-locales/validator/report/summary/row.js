import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Line from './line'
import RowIssues from './row-issues'
import {ChevronDown, ChevronUp} from 'react-feather'

function Row({row, isForcedShowIssues, isWarning, profile, unknowFields}) {
  const [showIssues, setShowIssues] = useState(false)
  const [field, setField] = useState()
  const issuesCount = row._errors.length

  const handleError = useCallback(() => {
    setShowIssues(!showIssues)
    setField(null)
  }, [showIssues])

  return (
    <div>
      <div className='line' onClick={handleError}>
        <div>
          <div className='col'>
            <b>Ligne {row._line}</b> {row.cle_interop && row.cle_interop.rawValue && `[${row.cle_interop.rawValue}]`}
          </div>
          <div>
            {issuesCount === 1 ? (
              <div className={isWarning ? 'warning' : 'error'}>
                {showIssues ? 'Masquer' : 'Afficher'} l’anomalie
              </div>
            ) : (
              <div className={isWarning ? 'warning' : 'error'}>
                {showIssues ? 'Masquer' : 'Afficher'} les {issuesCount} anomalies
              </div>
            )}
          </div>
        </div>

        {showIssues ? (
          <ChevronUp style={{verticalAlign: 'middle', color: '#222'}} />
        ) : (
          <ChevronDown style={{verticalAlign: 'middle', color: '#222'}} />
        )}
      </div>

      {showIssues &&
        <div className='issue'>
          <Line
            line={row}
            profile={profile}
            onHover={setField}
            unknowFields={unknowFields}
          />

          {(issuesCount > 0 || isForcedShowIssues) && (
            <RowIssues errors={row._errors} field={field} profile={profile} />
          )}
        </div>}

      <style jsx>{`
        .issue {
          padding: 1em;
        }

        .line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1em;
          background-color: ${showIssues ? '#f8f8f8' : ''}
        }

        .line > div {
          display: flex;
          align-items: center;
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
  unknowFields: PropTypes.array.isRequired,
  profile: PropTypes.string.isRequired
}

Row.defaultProps = {
  isForcedShowIssues: false
}

export default Row
