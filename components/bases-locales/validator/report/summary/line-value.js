import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {getValidationErrorSeverity} from '@etalab/bal'

import theme from '@/styles/theme'

function LineValue({value, handleHover, profile}) {
  const {rawValue, errors} = value
  const hasErrors = errors && errors.length > 0

  return (
    <Fragment key={rawValue}>
      {hasErrors ? (
        <td
          className={getValidationErrorSeverity(errors[0], profile) === 'E' ? 'error' : 'warning'}
          onMouseOver={() => handleHover(value)}
          onMouseOut={() => handleHover(null)}
        >
          {rawValue}
        </td>
      ) : (
        <td className='valid'>
          {rawValue}
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
    </Fragment>
  )
}

LineValue.propTypes = {
  value: PropTypes.shape({
    rawValue: PropTypes.string,
    errors: PropTypes.array,
    warnings: PropTypes.array
  }).isRequired,
  profile: PropTypes.string.isRequired
}

export default LineValue
