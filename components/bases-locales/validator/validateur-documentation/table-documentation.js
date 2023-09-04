import PropTypes from 'prop-types'
import React from 'react'
import {getLabel} from '@ban-team/validateur-bal'
import theme from '@/styles/theme'

function TableDocumentation({lines, className}) {
  function getLineLabel(l) {
    try {
      const lineWithCodeRegional = l.replace('@@', 'eus')
      const res = getLabel(lineWithCodeRegional)
      return res
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  return (
    <>
      <table>
        <tbody>
          {Object.keys(lines).map(key => (
            <React.Fragment key={key}>
              <tr key={'header_' + key}>
                <td><strong>{key} {key.includes('@@') && ' (code régional en 3 lettres)'}</strong></td>
              </tr>
              {lines[key].map(l => (
                <tr key={l} className={className}>
                  <td>{l}</td>
                  <td>{getLineLabel(l)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
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

TableDocumentation.propTypes = {
  lines: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired
}

export default TableDocumentation
