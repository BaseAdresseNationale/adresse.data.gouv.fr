import {useState} from 'react'
import PropTypes from 'prop-types'
import {Check} from 'react-feather'

import IssueDialog from './issue-dialog'
import IssuesSumup from './issues-sumup'

function Summary({rows, fields}) {
  const [selectedIssue, setSelectedIssue] = useState(null)

  const rowsWithIssuesCount = rows.filter(row => row.errors && row.errors.length > 0).length
  const errorsGroups = {}
  const warningsGroups = {}
  const infosGroups = {}

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

      if (level === 'I') {
        if (!infosGroups[code]) {
          infosGroups[code] = []
        }

        infosGroups[code].push(row)
      }
    })
  })

  const errorsCount = Object.keys(errorsGroups).length
  const warningsCount = Object.keys(warningsGroups).length
  const infosCount = Object.keys(infosGroups).length

  const unknowFields = []

  fields.forEach(field => {
    if (!field.schemaName) {
      unknowFields.push(field.name)
    }
  })

  return (
    <div>
      {rowsWithIssuesCount === 0 ? (
        <h4>Aucune ligne comprenant des alertes n’a été trouvée <span className='valid'><Check /></span></h4>
      ) : (
        <div>
          {rowsWithIssuesCount > 1 ? (
            <h4>{rowsWithIssuesCount} lignes comprenant des alertes</h4>
          ) : (
            <h4>{rowsWithIssuesCount} ligne comprenant des alertes</h4>
          )}
        </div>
      )}

      {errorsCount > 0 && (
        <IssuesSumup
          issues={errorsGroups}
          issueType='error'
          totalRowsCount={rows.length}
          handleSelect={setSelectedIssue}
        />
      )}

      {warningsCount > 0 && (
        <IssuesSumup
          issues={warningsGroups}
          issueType='warning'
          totalRowsCount={rows.length}
          handleSelect={setSelectedIssue}
        />
      )}

      {infosCount > 0 && (
        <IssuesSumup
          issues={infosGroups}
          issueType='information'
          totalRowsCount={rows.length}
          handleSelect={setSelectedIssue}
        />
      )}

      {selectedIssue && (
        <IssueDialog
          issue={selectedIssue}
          unknowFields={unknowFields}
          handleClose={() => setSelectedIssue(null)}
        />
      )}

      <style jsx>{`
        h4 {
          display: flex;
          margin: 1em 0;
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
