import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function LineValue({value, errors, handleHover, hasUnknowFields}) {
  const hasErrors = errors && errors.length > 0

  return (
    <>
      {hasErrors ? (
        <td
          className={errors[0].level === 'E' ? 'error' : 'warning'}
          onMouseOver={() => handleHover(errors)}
          onMouseOut={() => handleHover(null)}
        >
          {value}
        </td>
      ) : (
        <td className={`${hasUnknowFields ? 'unknown' : 'valid'}`}>
          {value}
        </td>
      )}

      <style jsx>{`
        td {
          padding: 0.5em;
        }

        td.error {
          background: ${theme.errorBg};
        }

        td.warning {
          background: ${theme.warningBg};
        }

        td.error:hover {
          cursor: pointer;
          background: ${theme.errorBorder};
          color: ${theme.colors.white};
        }

        td.warning:hover {
          cursor: pointer;
          background: ${theme.warningBorder};
          color: ${theme.colors.white};
        }

        td.valid {
          background: ${theme.successBg};
        }

        td.unknown {
          background: ${theme.backgroundGrey};
        }
      `}</style>
    </>
  )
}

LineValue.propTypes = {
  value: PropTypes.string,
  errors: PropTypes.array,
  handleHover: PropTypes.func.isRequired,
  hasUnknowFields: PropTypes.bool.isRequired
}

export default LineValue
