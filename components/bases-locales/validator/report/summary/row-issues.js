import PropTypes from 'prop-types'
import {getLabel} from '@ban-team/validateur-bal'
import theme from '@/styles/theme'

function RowIssues({errors, hoveredFieldErrors}) {
  return (
    <div className='abnormalities'>
      <h4>Alerte{(errors.length) > 1 ? 's' : ''} :</h4>
      <div className='error-list'>
        {errors.map(error => {
          const {code, level} = error
          const color = level === 'E' ? 'error' : (level === 'W' ? 'warning' : 'information')
          return (
            <div key={code} className={`issue ${color} ${hoveredFieldErrors && (hoveredFieldErrors.includes(error)) ? 'select' : ''}`}>
              {getLabel(code)}
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

      .information {
        background: ${theme.infoBg};
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

      .information.select {
        background: ${theme.infoBorder};
      }
      `}</style>
    </div>
  )
}

RowIssues.propTypes = {
  errors: PropTypes.array.isRequired,
  hoveredFieldErrors: PropTypes.array
}

RowIssues.defaultProps = {
  hoveredFieldErrors: null
}

export default RowIssues
