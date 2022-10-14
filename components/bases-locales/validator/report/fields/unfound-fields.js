import PropTypes from 'prop-types'

import theme from '@/styles/theme'
import ValidatorSectionTitle from '../../validator-section-title'

function UnfoundFields({fields}) {
  return (
    <div className='unfound-container'>
      {fields.length > 0 && (
        <>
          <ValidatorSectionTitle>Champs non trouvés</ValidatorSectionTitle>
          <table>
            <tbody>
              <tr>
                <th>Nom du champ</th>
                <th>Version de la spécification</th>
              </tr>
              {fields.map(field => {
                return (
                  <tr key={field.schemaName} className='warning'>
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
        .unfound-container {
          margin-top: 1em;
        }

        table {
          width: 100%;
        }

        th, td {
          padding: 0.5em;
        }

        .warning {
          background-color: ${theme.warningBg};
        }
    `}</style>
    </div>
  )
}

UnfoundFields.propTypes = {
  fields: PropTypes.array.isRequired
}

export default UnfoundFields
