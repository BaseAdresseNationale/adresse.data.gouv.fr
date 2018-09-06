import React from 'react'
import PropTypes from 'prop-types'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../../../styles/theme'

import Button from '../../../../button'

import Item from '.'

class EditableItem extends React.Component {
  state = {
    displayForm: false
  }

  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string,
      handleClick: PropTypes.func.isRequired
    }).isRequired,
    checked: PropTypes.bool,
    handleCheck: PropTypes.func,
    children: PropTypes.node
  }

  static defaultProps = {
    checked: false,
    handleCheck: null,
    children: null
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        displayForm: !state.displayForm
      }
    })
  }

  handleInputChange = e => {
    const {item, handleCheck} = this.props
    handleCheck(item.id, e.target.checked)
  }

  render() {
    const {displayForm} = this.state
    const {item, checked, handleCheck, children} = this.props

    return (
      <div>
        <div>
          {handleCheck && (
            <input
              name='selected'
              type='checkbox'
              checked={checked}
              onChange={this.handleInputChange}
            />
          )}

          <div className='editable-item'>
            <Item {...item} />
            <div className='edit-button'>
              <Button size='small' onClick={this.toggleForm}>
                {displayForm ? <FaClose /> : <FaPencil />}
              </Button>
            </div>
          </div>

        </div>

        {displayForm && (
          <div className='form'>{children}</div>
        )}

        <style jsx>{`
          .editable-item {
            display: flex;
            align-items: center;
          }

          .edit-button {
            margin: 0.5em;
          }

          .form {
            margin: -58px 0 0.2em;
            padding: 1em;
            padding-top: 70px;
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
          }
        `}</style>
      </div>
    )
  }
}

export default EditableItem
