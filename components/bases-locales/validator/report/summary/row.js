import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Line from './line'
import RowIssues from './row-issues'
import {ChevronDown, ChevronUp} from 'react-feather'

function Row({row, isForcedShowIssues, unknowFields}) {
  const [showIssues, setShowIssues] = useState(false)
  const [hoveredFieldErrors, setHoveredFieldErrors] = useState()
  const issuesCount = row.errors.length
  const issueLevel = row.errors.map(({level}) => level).includes('E') ? 'error' : 'warning'

  const handleError = useCallback(() => {
    setShowIssues(!showIssues)
    setHoveredFieldErrors(null)
  }, [showIssues])

  return (
    <div>
      <div className='line' onClick={handleError}>
        <div>
          <div className='col'>
            <b>Ligne {row.line}</b>
          </div>
          <div>
            {issuesCount === 1 ? (
              <div className={issueLevel}>
                {showIssues ? 'Masquer' : 'Afficher'} l’anomalie
              </div>
            ) : (
              <div className={issueLevel}>
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
            line={row.rawValues}
            errors={row.errors}
            onHover={setHoveredFieldErrors}
            unknowFields={unknowFields}
          />

          {(issuesCount > 0 || isForcedShowIssues) && (
            <RowIssues errors={row.errors} hoveredFieldErrors={hoveredFieldErrors} />
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
      `}</style>
    </div>
  )
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  isForcedShowIssues: PropTypes.bool,
  unknowFields: PropTypes.array.isRequired
}

Row.defaultProps = {
  isForcedShowIssues: false
}

export default Row
