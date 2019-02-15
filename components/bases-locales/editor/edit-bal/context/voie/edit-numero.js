import React from 'react'
import PropTypes from 'prop-types'
import FaRefresh from 'react-icons/lib/fa/refresh'
import FaTrash from 'react-icons/lib/fa/trash'

import theme from '../../../../../../styles/theme'

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
      <div>
        <div>
          <div className='editable-item'>
            <Item {...item} />

            <div className='edit-button'>
              {numero.deleted ? (
                <Button size='small' onClick={this.cancel}>
                  <FaRefresh />
                </Button>
              ) : (
                <Button size='small' color='red' onClick={this.delete}>
                  <FaTrash />
                </Button>
              )}
            </div>
          </div>

        </div>

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

export default EditNumero
