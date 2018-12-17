import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

class CommuneForm extends React.Component {
  state = { }

  static propTypes = {
    commune: PropTypes.shape({
      deleted: PropTypes.bool
    }).isRequired,
    deleteCommune: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error)
  }

  static defaultProps = {
    error: null
  }

  render() {
    const {commune, deleteCommune, cancel, error} = this.props

    return (
      <div>
        <div className='form'>
          {commune.deleted ? (
            <Button onClick={cancel}>Annuler la suppression</Button>
          ) : (
            <Button color='red' onClick={deleteCommune}>Supprimer la commune</Button>
          )}
        </div>

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

export default CommuneForm
