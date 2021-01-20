import React from 'react'
import PropTypes from 'prop-types'
import {getValidationErrorLabel, getValidationErrorSeverity} from '@etalab/bal'

import theme from '@/styles/theme'

function RowIssues({errors, field, profile}) {
  return (
    <div className='abnormalities'>
      <h4>Anomalie{(errors.length) > 1 ? 's' : ''} :</h4>
      <div className='error-list'>
        {errors.map(err => {
          const color = getValidationErrorSeverity(err, profile) === 'E' ? 'error' : 'warning'
          return (
            <div key={err} className={`issue ${color} ${field && field.errors && (field.errors.includes(err)) ? 'select' : ''}`}>
              {getValidationErrorLabel(err)}
            </div>
          )
        })}
      </div>
      <style jsx>{`
      .abnormalities {
        display: flex;
        flex-direction: column;
        padding: 1em;
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
  profile: PropTypes.string.isRequired,
  field: PropTypes.object
}

RowIssues.defaultProps = {
  field: null
}

export default RowIssues
