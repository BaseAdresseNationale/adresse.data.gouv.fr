import React from 'react'
import PropTypes from 'prop-types'
import {X, AlertTriangle} from 'react-feather'
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
  const percentageIssues = (issuesCount * 100) / totalRowsCount
  const percentageRounded = Number.isInteger(percentageIssues) ? percentageIssues : percentageIssues.toFixed(2)

  return (
    <div className='issues-container'>
      <h4>
        {issuesRowsCount} {issueType === 'error' ? 'Erreur' : 'Avertissement'}{issuesRowsCount > 1 ? 's' : ''}
        &nbsp;({issuesCount} ligne{issuesCount > 1 ? 's' : ''}) {percentageRounded}%
        <div className={`summary-icon ${issueType}`}>
          {issueType === 'error' ? (
            <X style={{verticalAlign: 'bottom'}} />
          ) : (
            <AlertTriangle style={{verticalAlign: 'bottom'}} />
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
            onClick={() => handleSelect({code: issue, rows: issues[issue]})}
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
  issueType: PropTypes.oneOf(['error', 'warning']).isRequired,
  totalRowsCount: PropTypes.number.isRequired,
  handleSelect: PropTypes.func.isRequired
}

export default IssuesSumup
