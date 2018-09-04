import React from 'react'
import PropTypes from 'prop-types'

import FaPencil from 'react-icons/lib/fa/pencil'
import FaClose from 'react-icons/lib/fa/close'
import FaTrash from 'react-icons/lib/fa/trash'
import FaCheck from 'react-icons/lib/fa/check'

import Button from '../../../../button'

const ACTIONS_TYPES = {
  edit: {IconComponent: FaPencil, backgroundColor: 'blue'},
  cancel: {IconComponent: FaClose, backgroundColor: 'red'},
  delete: {IconComponent: FaTrash, backgroundColor: 'red'},
  valid: {IconComponent: FaCheck, backgroundColor: 'green'}
}

class Action extends React.PureComponent {
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

    const {IconComponent, backgroundColor} = ACTIONS_TYPES[type]

    return (
      <Button
        style={{margin: '0 0.2em'}}
        size='small'
        color={backgroundColor}
        onClick={this.handleClick}
      >
        <IconComponent />
      </Button>
    )
  }
}

export default Action
