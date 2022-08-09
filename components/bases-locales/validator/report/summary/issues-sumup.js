import PropTypes from 'prop-types'
import {X, AlertTriangle, Info} from 'react-feather'
import {flattenDeep, groupBy} from 'lodash'

import theme from '@/styles/theme'

import IssueRows from './issue-rows'

function IssuesSumup({issues, issueType, totalRowsCount, handleSelect}) {
  const issuesRows = Object.keys(issues).map(issue => {
    return issues[issue]
  })

  const issuesFlatten = flattenDeep(issuesRows)
  const issuesRowsCount = issuesFlatten.length
  const issuesGroupedByLine = groupBy(issuesFlatten, 'line')
  const issuesCount = Object.keys(issuesGroupedByLine).length
  const percentageIssues = Math.floor((issuesCount * 100) / totalRowsCount)

  return (
    <div className='issues-container'>
      <h4>
        {issuesRowsCount} {issueType === 'error' ? 'Erreur' : (issueType === 'warning' ? 'Avertissement' : 'Information')}{issuesRowsCount > 1 ? 's' : ''}
        &nbsp;({issuesCount} ligne{issuesCount > 1 ? 's' : ''}) {percentageIssues}%
        <div className={`summary-icon ${issueType}`}>
          {issueType === 'error' ? (
            <X style={{verticalAlign: 'bottom'}} alt aria-hidden='true' />
          ) : (
            issueType === 'warning' ? (
              <AlertTriangle style={{verticalAlign: 'bottom'}} alt aria-hidden='true' />
            ) : (
              <Info style={{verticalAlign: 'bottom'}} alt aria-hidden='true' />
            )
          )}
        </div>
      </h4>
      <div className='list'>
        {Object.keys(issues).map(issue => (
          <IssueRows
            key={issue}
            issue={issue}
            rows={issues[issue]}
            isOnAllLines={issues[issue].length === totalRowsCount}
            type={issueType}
            onClick={() => handleSelect({code: issue, type: issueType, rows: issues[issue]})}
          />
        ))}
      </div>

      <style jsx>{`
        .issues-container {
          border-left: 4px solid whitesmoke;
          padding-left: 1em;
        }

        h4 {
          display: flex;
          margin: 1em 0;
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

IssuesSumup.propTypes = {
  issues: PropTypes.object.isRequired,
  issueType: PropTypes.oneOf(['error', 'warning', 'information']).isRequired,
  totalRowsCount: PropTypes.number.isRequired,
  handleSelect: PropTypes.func.isRequired
}

export default IssuesSumup
