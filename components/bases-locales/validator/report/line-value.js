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
    const {rawValue, errors} = value

    return (
      <Fragment key={rawValue}>
        {errors && errors.length > 0 ? (
          <td className='error' onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
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
            background: ${theme.errorBg};
          }

          td.error:hover {
            cursor: pointer;
            background: ${theme.errorBorder};
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

LineValue.propTypes = {
  value: PropTypes.shape({
    rawValue: PropTypes.string,
    errors: PropTypes.array
  }).isRequired,
  unknownField: PropTypes.bool.isRequired,
  handleHover: PropTypes.func.isRequired
}

export default LineValue
