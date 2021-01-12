import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function UnfoundFields({fields}) {
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
              {fields.map(field => (
                <tr key={field.schemaName}>
                  <td>{field.schemaName}</td>
                  <td>{field.schemaVersion}</td>
                </tr>
              ))}
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
        background-color: ${theme.warningBg}
      }

    `}</style>
    </>
  )
}

UnfoundFields.propTypes = {
  fields: PropTypes.array
}

UnfoundFields.defaultProps = {
  fields: []
}

export default UnfoundFields
