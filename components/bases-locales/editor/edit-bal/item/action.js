import React from 'react'
import PropTypes from 'prop-types'

import FaPencil from 'react-icons/lib/fa/pencil'
import FaClose from 'react-icons/lib/fa/close'
import FaTrash from 'react-icons/lib/fa/trash'
import FaCheck from 'react-icons/lib/fa/check'

import Button from '../../../../button'

const ACTIONS_TYPES = {
  edit: {icon: <FaPencil />, backgroundColor: 'blue'},
  cancel: {icon: <FaClose />, backgroundColor: 'red'},
  delete: {icon: <FaTrash />, backgroundColor: 'red'},
  valid: {icon: <FaCheck />, backgroundColor: 'green'}
}

class Action extends React.Component {
  static propTypes = {
    action: PropTypes.shape({
      type: PropTypes.oneOf(Object.keys(ACTIONS_TYPES)).isRequired,
      func: PropTypes.func.isRequired
    }).isRequired
  }

  handleClick = e => {
    const {func} = this.props.action
    e.preventDefault()
    func()
  }

  render() {
    const {type} = this.props.action

    return (
      <Button
        style={{margin: '0 0.2em'}}
        size='small'
        color={ACTIONS_TYPES[type].backgroundColor}
        onClick={this.handleClick}
      >
        {ACTIONS_TYPES[type].icon}
      </Button>
    )
  }
}

export default Action
