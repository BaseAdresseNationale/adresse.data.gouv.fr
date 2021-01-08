import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function FoundFields({fields}) {
  return (
    <table>
      <tbody>
        <tr>
          <th>Nom du champ dans le fichier</th>
          <th>Nom du champ dans la spécification</th>
          <th>Version de la spécification</th>
        </tr>
        {fields.map(field => (
          <tr key={field.name} className={field.exactMatch ? 'background-green' : (field.exactMatch === false ? 'background-red' : '')}>
            <td>{field.name}</td>
            <td>{field.schemaName}</td>
            <td>{field.version}</td>
          </tr>
        ))}
      </tbody>
      <style jsx>{`
      .background-green {
        background-color: ${theme.successBg};
      }

      .background-red {
        background-color: ${theme.warningBg};
      }

      table {
        width: 100%;
      }

      th, td {
        padding: 0.5em;
      }

      `}</style>
    </table>
  )
}

FoundFields.propTypes = {
  fields: PropTypes.array
}

FoundFields.defaultProps = {
  fields: []
}

export default FoundFields
