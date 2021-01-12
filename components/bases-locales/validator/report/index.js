import React from 'react'
import PropTypes from 'prop-types'

import CsvMeta from './csv-meta'
import Fields from './fields'
import Summary from './summary'

import {Check, X} from 'react-feather'
import theme from '@/styles/theme'

function Report({report}) {
  const {fileValidation, rows, fields, originalFields, notFoundFields, profilesValidation, uniqueErrors} = report
  const rowsWithIssues = rows.filter(row => row._errors && row._errors.length > 0)
  const rowsWithIssuesCount = rowsWithIssues.length
  const errors = []

  uniqueErrors.map(e => {
    const rowsWithErrors = []
    rows.map(r => {
      if (r._errors.includes(e)) {
        rowsWithErrors.push(r._line)
      }

      return null
    })
    errors.push({message: e, rows: rowsWithErrors})
    return null
  })

  const issuesSummary = {errors}

  return (
    <div>
      <div className='report-container'>
        {fileValidation &&
          <div>
            <h3>Validation de la structure du fichier</h3>
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
        />
      </div>

      <div className='report-container'>
        <h4>Validation par profile</h4>
        <table>
          <tbody>
            <tr>
              <th>Nom</th>
              <th>Profile</th>
              <th>Valide</th>
            </tr>
            {Object.keys(profilesValidation).map(key => (
              <tr key={key} className={profilesValidation[key].isValid ? 'background-green' : 'background-red'}>
                <td>{profilesValidation[key].name}</td>
                <td>{profilesValidation[key].code}</td>
                <td>{profilesValidation[key].isValid ? <Check size={25} /> : <X size={25} />}</td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      <div className='report-container'>
        <h3>Validation des données</h3>
        <Summary
          rows={rowsWithIssues}
          issuesSummary={issuesSummary}
          rowsWithIssuesCount={rowsWithIssuesCount}
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

        .flex-container {
          display: flex;
          margin: auto;
        }

        .flex-container:hover {
          cursor: pointer;
          background-color: #f8f8f8;
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

        .valid {
          color: ${theme.successBorder};
        }

        .background-green {
          background-color: ${theme.successBg};
        }

        .background-red {
          background-color: ${theme.errorBg};
        }

        h3 {
          padding: 0 .5em;
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
    fileValidation: PropTypes.shape({
      encoding: PropTypes.object.isRequired,
      delimiter: PropTypes.object.isRequired,
      linebreak: PropTypes.object.isRequired
    }),
    uniqueErrors: PropTypes.array.isRequired
  }).isRequired
}

export default Report
