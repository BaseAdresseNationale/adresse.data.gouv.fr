import React from 'react'
import PropTypes from 'prop-types'

import {today} from '../../lib/bal/model'
import {getNumeroPositions} from '../../lib/bal/item'

import Button from '../button'

import SelectPositionType from '../bases-locales/editor/edit-bal/context/voie/select-position-type'

class CreatePositionMenu extends React.Component {
  state = {
    type: 'entrée'
  }

  static propTypes = {
    numero: PropTypes.object.isRequired,
    coordinates: PropTypes.array.isRequired,
    actions: PropTypes.shape({
      updateNumero: PropTypes.func.isRequired
    }).isRequired,
    close: PropTypes.func.isRequired
  }

  handleType = type => {
    this.setState({type})
  }

  handleSubmit = async () => {
    const {type} = this.state
    const {numero, coordinates, actions, close} = this.props
    const positions = [...getNumeroPositions(numero)]

    positions.push({
      _id: `${numero.id}-${positions.length}`,
      coords: coordinates,
      type,
      source: [],
      dateMAJ: today()
    })

    await actions.updateNumero(numero, {positions})

    close()
  }

  render() {
    const {type} = this.state

    return (
      <div className='form'>
        <div className='title'>Nouvelle position</div>
        <SelectPositionType type={type} onSubmit={this.handleType} />
        <Button onClick={this.handleSubmit}>Enregistrer</Button>

        <style jsx>{`
          .form {
            display: flex;
            justify-content: center;
            flex-direction: column;
          }
          .title {
            margin: 0.5em 0;
          }
          `}</style>
      </div>
    )
  }
}

export default CreatePositionMenu
