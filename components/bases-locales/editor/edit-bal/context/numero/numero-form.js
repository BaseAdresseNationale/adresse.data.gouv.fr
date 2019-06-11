import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'

class NumeroForm extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      edited: PropTypes.bool,
      deleted: PropTypes.bool
    }).isRequired,
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
    const {numero} = this.props

    return (
      <div className='buttons'>
        {!numero.deleted && (
          <Button
            color='warning'
            size='small'
            onClick={this.delete}
          >
              Supprimer ce numéro
          </Button>
        )}

        {(numero.edited || numero.deleted) && (
          <Button
            size='small'
            onClick={this.cancel}
          >
              Annuler les changements
          </Button>
        )}

        <style jsx>{`
          .buttons {
            display: flex;
            flex-flow: wrap;
            justify-content: space-between;
            align-items: center;
            margin: 1em;
          }
        `}</style>
      </div>

    )
  }
}

export default NumeroForm
