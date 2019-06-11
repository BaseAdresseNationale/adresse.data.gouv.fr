import React from 'react'
import PropTypes from 'prop-types'
import FaRefresh from 'react-icons/lib/fa/refresh'
import FaTrash from 'react-icons/lib/fa/trash'

import Button from '../../../../../button'

import Item from '../item'

class EditNumero extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      deleted: PropTypes.bool
    }).isRequired,
    item: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      cancelChange: PropTypes.func.isRequired
    }).isRequired
  }

  delete = async () => {
    const {numero, actions} = this.props
    await actions.deleteItem(numero)
  }

  cancel = async () => {
    const {numero, actions} = this.props
    await actions.cancelChange(numero)
  }

  render() {
    const {numero, item} = this.props

    return (
      <div className='editable-item'>
        <Item {...item} />

        <div className='edit-button'>
          {numero.deleted ? (
            <Button size='small' onClick={this.cancel}>
              <FaRefresh />
            </Button>
          ) : (
            <Button size='small' color='warning' onClick={this.delete}>
              <FaTrash />
            </Button>
          )}
        </div>

        <style jsx>{`
          .editable-item {
            display: flex;
            align-items: center;
          }

          .edit-button {
            margin: 0.5em;
          }
        `}</style>
      </div>
    )
  }
}

export default EditNumero
