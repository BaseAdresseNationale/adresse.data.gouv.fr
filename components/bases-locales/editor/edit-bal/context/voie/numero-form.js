import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

class NumeroForm extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      deleted: PropTypes.bool
    }).isRequired,
    deleteNumero: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error)
  }

  static defaultProps = {
    error: null
  }

  render() {
    const {numero, deleteNumero, cancel, error} = this.props

    return (
      <div className='form'>
        {numero.deleted ? (
          <Button onClick={cancel}>Annuler la suppression</Button>
        ) : (
          <Button color='red' onClick={deleteNumero}>Supprimer le numéro</Button>
        )}

        {error && (
          <Notification type='error'>
            {error.message}
          </Notification>
        )}

        <style jsx>{`
          .form {
            display: flex;
            justify-content: center;
          }
        `}</style>
      </div>
    )
  }
}

export default NumeroForm
