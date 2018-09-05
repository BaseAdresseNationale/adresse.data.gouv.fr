import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

import VoieEditor from './voie-editor'
import NumberoEditor from './numero-editor'
import Item from '.'

class EditableItem extends React.Component {
  state = {
    editing: false,
    newName: '',
    error: null
  }

  static propTypes = {
    item: PropTypes.shape({
      type: PropTypes.oneOf(['commune', 'voie', 'numero']).isRequired
    }).isRequired,
    changeContext: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    assignItem: PropTypes.func.isRequired,
    renameItem: PropTypes.func.isRequired,
    cancelChange: PropTypes.func.isRequired
  }

  handleValid = () => {
    const {newName} = this.state
    const {item, renameItem} = this.props

    renameItem(item, newName)

    this.setState({
      editing: false
    })
  }

  handleEdit = () => {
    this.setState(state => {
      return {
        editing: !state.editing
      }
    })
  }

  handleDelete = () => {
    const {item, deleteItem} = this.props

    deleteItem(item)
  }

  handleCancel = () => {
    const {item, cancelChange} = this.props

    cancelChange(item)
  }

  setNewName = newName => {
    this.setState({newName})
  }

  getActions = () => {
    const {editing} = this.state
    const {item} = this.props
    const actions = []

    if (editing) {
      return [
        {type: 'valid', func: this.handleValid},
        {type: 'cancel', func: this.handleEdit}
      ]
    }

    if (item.deleted) {
      actions.push({type: 'cancel', func: this.handleCancel})
    } else {
      actions.push({type: 'delete', func: this.handleDelete})
    }

    if (item.type !== 'commune') {
      actions.push({type: 'edit', func: this.handleEdit})
    }

    return actions
  }

  render() {
    const {newName, editing, error} = this.state
    const { item, assignItem} = this.props
    const itemActions = this.getActions()

    return (
      <div>
        {editing ? (
          <Item
            {...this.props}
            actions={itemActions}
          >
            <div>
              {item.type === 'voie' ? (
                <VoieEditor
                  item={item}
                  name={newName}
                  rename={this.setNewName}
                  assign={assignItem} />
              ) : (
                <NumberoEditor
                  item={item}
                  name={newName}
                  rename={this.setNewName} />
              )}

              {error && (
                <div className='error'>{error}</div>
              )}
            </div>
          </Item>
        ) : (
          <Item
            {...this.props}
            actions={itemActions}
          />)}

        <style jsx>{`
          .error {
            color: ${theme.colors.red};
            margin-top: 2em;
          }
        `}</style>
      </div>
    )
  }
}

export default EditableItem
