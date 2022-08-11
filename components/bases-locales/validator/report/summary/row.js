import {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp} from 'react-feather'

import theme from '@/styles/theme'

import Line from './line'
import RowIssues from './row-issues'
import ActionButtonNeutral from '@/components/action-button-neutral'

function Row({row, isForcedShowIssues, unknowFields, issueType}) {
  const [showIssues, setShowIssues] = useState(false)
  const [hoveredFieldErrors, setHoveredFieldErrors] = useState()
  const sanitedIssueType = issueType === 'error' ? 'E' : (issueType === 'warning' ? 'W' : 'I')
  const filteredErrors = row.errors.filter(error => error.level === sanitedIssueType)
  const issuesCount = filteredErrors.length

  const handleError = useCallback(() => {
    setShowIssues(!showIssues)
    setHoveredFieldErrors(null)
  }, [showIssues])

  return (

    <>
      <ActionButtonNeutral isFullSize label={`${showIssues ? 'Masquer' : 'Afficher'} la ligne ${row.line}`}
        onClick={handleError}
      >
        <div className='line'>
          <div>
            <div className='col'>
              <b>Ligne {row.line}</b>
            </div>
            <div>
              {issuesCount === 1 ? (
                <div className={issueType}>
                  {showIssues ? 'Masquer' : 'Afficher'} l’alerte
                </div>
              ) : (
                <div className={issueType}>
                  {showIssues ? 'Masquer' : 'Afficher'} les {issuesCount} alertes
                </div>
              )}
            </div>
          </div>

          {showIssues ? (
            <ChevronUp style={{verticalAlign: 'middle', color: '#222'}} alt />
          ) : (
            <ChevronDown style={{verticalAlign: 'middle', color: '#222'}} alt />
          )}
        </div>
      </ActionButtonNeutral>

      {showIssues &&
        <div className='issue'>
          <Line
            line={row.rawValues}
            errors={filteredErrors}
            onHover={setHoveredFieldErrors}
            unknowFields={unknowFields}
          />

          {(issuesCount > 0 || isForcedShowIssues) && (
            <RowIssues errors={filteredErrors} hoveredFieldErrors={hoveredFieldErrors} />
          )}
        </div>}

      <style jsx>{`
        .issue {
          padding: 1em;
        }

        .line {
          width: 100%;
          border: none;
          background: none;
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
          font-size: 16px;
        }

        .error {
          color: ${theme.errorBorder};
        }

        .warning {
          color: ${theme.warningBorder};
        }

        .information {
          color: ${theme.infoBorder};
        }

        .line:hover {
          cursor: pointer;
          background-color: #f8f8f8;
        }
      `}</style>
    </>
  )
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  isForcedShowIssues: PropTypes.bool,
  unknowFields: PropTypes.array.isRequired,
  issueType: PropTypes.string.isRequired
}

Row.defaultProps = {
  isForcedShowIssues: false
}

export default Row
