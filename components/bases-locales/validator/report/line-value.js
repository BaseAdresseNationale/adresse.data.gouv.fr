import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

class LineValue extends React.Component {
  handleMouseOver = () => {
    const {value, handleHover} = this.props

    handleHover(value)
  }

  handleMouseOut = () => {
    const {handleHover} = this.props

    handleHover(null)
  }

  render() {
    const {value, unknownField} = this.props
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
          <td className={`${unknownField ? 'unknown' : 'valid'}`}>
            {rawValue}
          </td>
        )}

        <style jsx>{`
          td {
            padding: 0.5em;
          }

          td.error {
            background-color: ${theme.errorBg};
          }

          td.warning {
            background-color: ${theme.warningBg};
          }

          td.error:hover {
            cursor: pointer;
            background-color: ${theme.errorBorder};
            color: ${theme.colors.white};
          }

          td.warning:hover {
            cursor: pointer;
            background-color: ${theme.warningBorder};
            color: ${theme.colors.white};
          }

          td.valid {
            background-color: ${theme.successBg};
          }

          td.unknown {
            background-color: ${theme.backgroundGrey};
          }
        `}</style>
      </Fragment>
    )
  }
}

LineValue.propTypes = {
  value: PropTypes.shape({
    rawValue: PropTypes.string,
    errors: PropTypes.array,
    warnings: PropTypes.array
  }).isRequired,
  unknownField: PropTypes.bool.isRequired,
  handleHover: PropTypes.func.isRequired
}

export default LineValue
