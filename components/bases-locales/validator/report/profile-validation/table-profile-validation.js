import PropTypes from 'prop-types'
import theme from '@/styles/theme'
import {getLabel} from '@ban-team/validateur-bal'

function TableProfileValidation({profilErrors}) {
  return (
    <>
      <table>
        <tbody>
          {profilErrors.map(pe => {
            return (
              <tr key={pe.code} className={pe.level === 'E' ? 'error' : 'warning'}>
                <td>{getLabel(pe.code)}</td>
                <td>{pe.level === 'E' ? 'Erreur' : 'Alert'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <style jsx>{`
        table {
          width: 100%;
        }
        th, td {
          padding: 0.5em;
        }
        .warning {
          background-color: ${theme.warningBg};
        }
        .error {
          background-color: ${theme.errorBg};
        }
    `}</style>
    </>
  )
}

TableProfileValidation.propTypes = {
  profilErrors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired
    })
  ),
}

export default TableProfileValidation
