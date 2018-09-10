import React from 'react'
import PropTypes from 'prop-types'

class FromPreventDefault extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  }

  formPreventDefaultKey = e => {
    const {submit} = this.props

    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  formPreventDefault = e => {
    const {submit} = this.props

    e.preventDefault()
    e.stopPropagation()

    submit()
  }

  render() {
    const {children} = this.props

    return (
      <form onKeyDown={this.formPreventDefaultKey} onSubmit={this.formPreventDefault}>
        {children}
      </form>
    )
  }
}

export default FromPreventDefault
