import React, {useState, useMemo} from 'react'
import PropTypes from 'prop-types'

import CsvMeta from './csv-meta'
import Fields from './fields'
import Summary from './summary'

import {Check, X} from 'react-feather'
import theme from '@/styles/theme'

const getIssues = (issuesRows, rows) => {
  const issues = []
  issuesRows.forEach(issue => {
    const rowsWithIssues = []
    rows.forEach(row => {
      if (row._errors.includes(issue)) {
        rowsWithIssues.push(row._line)
      }
    })

    if (rowsWithIssues.length > 0) {
      issues.push({message: issue, rows: rowsWithIssues})
    }
  })

  return issues
}

function Report({report}) {
  const {fileValidation, rows, fields, originalFields, notFoundFields, profilesValidation} = report
  const rowsWithIssues = rows.filter(row => row._errors && row._errors.length > 0)
  const [profile, setProfile] = useState('1.2-etalab')

  const errors = useMemo(() => {
    return getIssues(report.profilesValidation[profile].errors, rows)
  }, [profile, report, rows])

  const warnings = useMemo(() => {
    return getIssues(report.profilesValidation[profile].warnings, rows)
  }, [profile, report, rows])

  const unknowFields = []

  report.fields.forEach(field => {
    if (!field.schemaName) {
      unknowFields.push(field.name)
    }
  })

  return (
    <div>
      <div className='profil-selector'>
        <label>Version de la spécification :</label>
        <select name='profil' defaultValue={profile} onChange={e => setProfile(e.target.value)}>
          {Object.keys(profilesValidation).map(key => (
            <option key={key} value={key}>{profilesValidation[key].name}</option>
          ))}
        </select>
      </div>

      <div className='report-container'>
        <h4>Validation par version de spécification</h4>
        <table>
          <tbody>
            <tr>
              <th>Nom</th>
              <th>Profile</th>
              <th>Valide</th>
            </tr>
            {Object.keys(profilesValidation).map(key => (
              <tr key={key} style={{backgroundColor: profilesValidation[key].isValid ? theme.successBg : theme.errorBg}}>
                <td>{profilesValidation[key].name}</td>
                <td>{profilesValidation[key].code}</td>
                <td>{profilesValidation[key].isValid ? <Check size={25} /> : <X size={25} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='report-container'>
        {fileValidation &&
          <div>
            <h4>Validation de la structure du fichier</h4>
            <div className='items'>
              <CsvMeta
                name='Encodage des caractères'
                value={fileValidation.encoding.value}
                isValid={fileValidation.encoding.isValid}
              />
              <CsvMeta
                name='Délimiteur'
                value={fileValidation.delimiter.value}
                isValid={fileValidation.delimiter.isValid}
              />
              <CsvMeta
                name='Nombre de lignes'
                value={rows.length}
                isValid
              />
              <CsvMeta
                name='Séparateur de ligne'
                value={fileValidation.linebreak.value}
                isValid={fileValidation.linebreak.isValid}
              />
            </div>
          </div>}
      </div>

      <div className='report-container'>
        <Fields
          fields={fields}
          original={originalFields}
          notFound={notFoundFields}
          profile={profile}
          uniqueErrors={report.uniqueErrors}
        />
      </div>

      <div className='report-container'>
        <h4>Validation des données</h4>
        <Summary
          rows={rowsWithIssues}
          profile={profile}
          errors={errors}
          warnings={warnings}
          unknowFields={unknowFields}
          rowsWithIssuesCount={rowsWithIssues.length}
        />
      </div>

      <style jsx>{`
        table {
          width: 100%;
        }

        th, td {
          padding: 0.5em;
          text-align: center;
        }

        .profil-selector {
          display: flex;
          align-items: center;
          margin: 1em;
        }

        select {
          margin-left: 1em;
          background-size: 2em 1em;
        }

        .report-container {
          margin: 2em 0;
          padding: 2em 1em;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          background: ${theme.colors.white};
        }

        .items {
          margin-bottom: 2em;
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(210px,1fr));
          grid-gap: 2em 1em;
        }
      `}</style>
    </div>
  )
}

Report.propTypes = {
  report: PropTypes.shape({
    fields: PropTypes.array.isRequired,
    originalFields: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    notFoundFields: PropTypes.array.isRequired,
    profilesValidation: PropTypes.object.isRequired,
    uniqueErrors: PropTypes.array.isRequired,
    fileValidation: PropTypes.shape({
      encoding: PropTypes.object.isRequired,
      delimiter: PropTypes.object.isRequired,
      linebreak: PropTypes.object.isRequired
    })
  }).isRequired
}

export default Report
