import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

class LineValue extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      rawValue: PropTypes.string,
      errors: PropTypes.array,
      warnings: PropTypes.array
    }).isRequired,
    hasUnknownField: PropTypes.bool.isRequired,
    handleHover: PropTypes.func.isRequired
  }

  handleMouseOver = () => {
    const {value, handleHover} = this.props

    handleHover(value)
  }

  handleMouseOut = () => {
    const {handleHover} = this.props

    handleHover(null)
  }

  render() {
    const {value, hasUnknownField} = this.props
    const {rawValue, errors, warnings} = value
    const hasErrors = errors && errors.length > 0
    const hasWarnings = warnings && warnings.length > 0
    const hasIssues = hasErrors || hasWarnings
    const issuesType = hasErrors ? 'error' : 'warning'

    return (
      <Fragment key={rawValue}>
        {hasIssues ? (
          <td className={issuesType} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
            {rawValue}
          </td>
        ) : (
          <td className={`${hasUnknownField ? 'unknown' : 'valid'}`}>
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
}

export default LineValue
