import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function RowIssues({errors, warnings, field}) {
  return (
    <div className='abnormalities'>
      <h3>Anomalie{(errors.length + warnings.length) > 1 ? 's' : ''} :</h3>
      <div className='error-list'>
        {warnings.map(err => (
          <div key={err} className={`issue warning ${field && field.warnings && (field.warnings.includes(err)) ? 'select' : ''}`}>
            {err}
          </div>
        ))}
        {errors.map(err => (
          <div key={err} className={`issue error ${field && field.errors && (field.errors.includes(err)) ? 'select' : ''}`}>
            {err}
          </div>
        ))}
      </div>
      <style jsx>{`
      .abnormalities {
        display: flex;
        flex-direction: column;
        padding: 1em;
        margin: 1em 0;
      }

      .issue {
        padding: 0.5em;
        margin: 0.5em 0;
        border-radius: 3px;
      }

      .error {
        background: ${theme.errorBg};
      }

      .warning {
        background: ${theme.warningBg};
      }

      .issue.select {
        color: ${theme.colors.white};
      }

      .error.select {
        background: ${theme.errorBorder};
      }

      .warning.select {
        background: ${theme.warningBorder};
      }
      `}</style>
    </div>
  )
}

RowIssues.propTypes = {
  errors: PropTypes.array.isRequired,
  warnings: PropTypes.array.isRequired,
  field: PropTypes.object
}

RowIssues.defaultProps = {
  field: null
}

export default RowIssues
