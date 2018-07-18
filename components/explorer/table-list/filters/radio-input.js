import React from 'react'
import PropTypes from 'prop-types'

class RadioInput extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    toggleInput: PropTypes.func.isRequired,
    style: PropTypes.object,
    checked: PropTypes.bool
  }

  static defaultProps = {
    style: null,
    checked: false
  }

  handleChange = event => {
    const {toggleInput} = this.props

    toggleInput(event.target.value)
  }

  render() {
    const {value, checked, style} = this.props

    return (
      <div style={style} className='input'>
        <input type='radio' id={`radio-${value}`} value={value} checked={checked} onClick={this.handleChange} />
        <label className='label-inline'>{value}</label>
      </div>
    )
  }
}

export default RadioInput
