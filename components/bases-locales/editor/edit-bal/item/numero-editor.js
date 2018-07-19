import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

class VoieEditor extends React.Component {
  static propTypes = {
    input: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    handleInput: PropTypes.func.isRequired,
    error: PropTypes.string
  }

  static defaultProps = {
    error: null
  }

  handleChange = event => {
    const {handleInput} = this.props
    handleInput(event.target.value)
  }

  render() {
    const {input, placeholder, error} = this.props

    return (
      <div>
        <div>
          <label>Numéro</label>
          <input type='text' placeholder={placeholder} value={input} onChange={this.handleChange} />
        </div>

        {error && (
          <div className='error'>{error}</div>
        )}

        <style jsx>{`
          .error {
            color: ${theme.colors.red};
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default VoieEditor
