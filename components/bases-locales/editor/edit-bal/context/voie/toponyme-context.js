import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'

class ToponymeContext extends React.Component {
  static propTypes = {
    voie: PropTypes.shape({
      position: PropTypes.object.isRequired,
      modified: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      repositionVoie: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  delete = async () => {
    const {voie, actions} = this.props
    await actions.deleteItem(voie, true)
  }

  cancel = async () => {
    const {voie, actions} = this.props
    await actions.cancelChange(voie)
  }

  render() {
    const {voie} = this.props

    return (
      <>
        <div className='buttons'>
          {(voie.edited || voie.deleted) && (
            <Button onClick={this.cancel}>
              Annuler les changements
            </Button>
          )}

          {!voie.deleted && (
            <Button color='red' onClick={this.delete}>
              Supprimer le toponyme
            </Button>
          )}
        </div>

        <style jsx>{`
          .buttons {
            display: flex;
            flex-flow: wrap;
            margin: 1em 0;
          }
        `}</style>
      </>
    )
  }
}

export default ToponymeContext
