import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import CreateNumero from './create-numero'

class EmptyVoiesList extends React.Component {
  state = {
    numeroComplet: '',
    error: null
  }

  static propTypes = {
    addNumero: PropTypes.func.isRequired
  }

  handleInput = input => {
    this.setState({
      numeroComplet: input,
      error: null
    })
  }

  addNumero = async () => {
    const {numeroComplet} = this.state
    const {addNumero} = this.props

    try {
      await addNumero({numeroComplet})
    } catch (err) {
      this.setState({
        error: err
      })
    }
  }

  render() {
    const {numeroComplet, error} = this.state

    return (
      <div>
        <div className='no-voie'>
          <div>
            <h4>Aucun numéro</h4>
            <p>Entrez le numéro complet que vous souhaitez ajouter à la voie.</p>
          </div>

          <CreateNumero
            input={numeroComplet}
            handleInput={this.handleInput}
            handleSubmit={this.addNumero}
            error={error}
          />
        </div>

        <style jsx>{`
          .no-voie {
            display: flex;
            flex-direction: column;
            border: 2px dashed ${theme.border};
            padding: 1em;
          }
      `}</style>
      </div>
    )
  }
}

export default EmptyVoiesList
