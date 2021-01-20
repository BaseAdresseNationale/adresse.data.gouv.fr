import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'
import {getValidationErrorSeverity} from '@etalab/bal'

function UnfoundFields({fields, uniqueErrors, profile}) {
  return (
    <>
      {fields.length > 0 && (
        <>
          <h4>Champs non trouvés</h4>
          <table>
            <tbody>
              <tr>
                <th>Nom du champ</th>
                <th>Version de la spécification</th>
              </tr>
              {fields.map(field => {
                return (
                  <tr
                    key={field.schemaName}
                    className={uniqueErrors.includes(`field.${field.schemaName}.missing`) && getValidationErrorSeverity(`field.${field.schemaName}.missing`, profile) === 'E' ? 'error' : 'warning'}
                  >
                    <td>{field.schemaName}</td>
                    <td>{field.schemaVersion}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}
      <style jsx>{`
      h4 {
        margin-top: 1em;
      }

      table {
        width: 100%;
      }

      th {
        padding: 0.5em;
      }

      td {
        padding: 0.5em;
      }

      .error {
        background-color: ${theme.errorBg};
      }

      .warning {
        background-color: ${theme.warningBg};
      }

    `}</style>
    </>
  )
}

UnfoundFields.propTypes = {
  fields: PropTypes.array.isRequired,
  uniqueErrors: PropTypes.array.isRequired,
  profile: PropTypes.string.isRequired
}

export default UnfoundFields
