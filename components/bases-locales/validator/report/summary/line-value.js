import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function LineValue({value, handleHover}) {
  const {rawValue, errors} = value
  const hasErrors = errors && errors.length > 0

  return (
    <Fragment key={rawValue}>
      <td className={hasErrors ? 'error' : ''} onMouseOver={() => handleHover(value)} onMouseOut={() => handleHover(null)}>
        {rawValue}
      </td>

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
  handleHover: PropTypes.func.isRequired
}

export default LineValue
