import {useState} from 'react'
import PropTypes from 'prop-types'
import {Check} from 'react-feather'

import IssueDialog from './issue-dialog'
import IssuesSumup from './issues-sumup'
import ValidatorSectionTitle from '../../validator-section-title'

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
      <ValidatorSectionTitle>Validation des données</ValidatorSectionTitle>
      {rowsWithIssuesCount === 0 ? (
        <h3>
          Aucune ligne comprenant des alertes n’a été trouvée
          <Check alt='' aria-hidden='true' />
        </h3>
      ) : (
        <div>
          {rowsWithIssuesCount > 1 ? (
            <h3>{rowsWithIssuesCount} lignes comprenant des alertes</h3>
          ) : (
            <h3>{rowsWithIssuesCount} ligne comprenant des alertes</h3>
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
        h3 {
          display: flex;
          gap: 10px;
          margin: 1em 0;
          font-size: 16px;
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
