import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

const RowErrors = ({errors, warnings, field}) => (
  <div className='abnormalities'>
    <h3>Anomalie{(errors.length + warnings.length) > 1 ? 's' : ''} :</h3>
    <div className='error-list'>
      {warnings.map(err => (
        <div key={err} className={`issue warning ${field && (field.warnings.includes(err)) ? 'select' : ''}`}>
          {err}
        </div>
      ))}
      {errors.map(err => (
        <div key={err} className={`issue error ${field && (field.warnings.includes(err)) ? 'select' : ''}`}>
          {err}
        </div>
      ))}
    </div>
    <style jsx>{`
      .abnormalities {
        display: flex;
        flex-flow: wrap;
        align-items: center;
        justify-content: space-around;
        margin: 1em 0;
      }

      .issue {
        padding: 0.5em;
        margin: 0.5em 0;
        border-radius: 3px;
      }

      .error {
        background-color: ${theme.errorBg};
      }

      .warning {
        background-color: ${theme.warningBg};
      }

      .issue.select {
        color: ${theme.colors.white};
      }

      .error.select {
        background-color: ${theme.errorBorder};
      }

      .warning.select {
        background-color: ${theme.warningBorder};
      }
      `}</style>
  </div>
)

RowErrors.propTypes = {
  errors: PropTypes.array.isRequired,
  warnings: PropTypes.array.isRequired,
  field: PropTypes.object
}

RowErrors.defaultProps = {
  field: null
}

export default RowErrors
