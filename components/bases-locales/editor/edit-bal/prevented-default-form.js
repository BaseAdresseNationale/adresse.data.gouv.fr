import React from 'react'
import PropTypes from 'prop-types'

class PreventedDefaultForm extends React.Component {
  state = { }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  }

  componentDidMount() {
    // Evergreen event listener || IE8 event listener
    const addEvent = this.form.addEventListener || this.form.attachEvent
    addEvent('keypress', this.handleKeyPress, false)
  }

  componentWillUnmount() {
    const removeEvent = this.form.removeEventListener || this.form.detachEvent
    removeEvent('keypress', this.handleKeyPress)
  }

  handleKeyPress = event => {
    const {onSubmit} = this.props

    // [Enter]
    if (event.keyCode === 13) {
      event.preventDefault()
      onSubmit()
    }
  }

  formPreventDefault = e => {
    const {onSubmit} = this.props
    e.preventDefault()

    onSubmit()
  }

  render() {
    const {children} = this.props

    return (
      <form
        ref={form => {
          this.form = form
        }}
        onSubmit={this.formPreventDefault}
      >
        {children}
      </form>
    )
  }
}

export default PreventedDefaultForm
