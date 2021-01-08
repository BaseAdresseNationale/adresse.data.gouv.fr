import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function UnfoundFields({fields}) {
  return (
    <>
      {fields.length > 0 && (
        <table>
          <h4>Champs non trouvés</h4>
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
      )}
      <style jsx>{`
      .unknown {
        color: ${theme.colors.darkerGrey};
      }

      table {
        width: 100%;
        margin-top: 1em;
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
