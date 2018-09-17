import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import CreateVoie from './create-voie'

class EmptyVoiesList extends React.Component {
  state = {
    nomVoie: '',
    error: null
  }

  static propTypes = {
    addVoie: PropTypes.func.isRequired
  }

  handleInput = input => {
    this.setState({
      nomVoie: input,
      error: null
    })
  }

  addVoie = async () => {
    const {nomVoie} = this.state
    const {addVoie} = this.props

    try {
      await addVoie({nomVoie})
    } catch (err) {
      this.setState({
        error: err
      })
    }
  }

  render() {
    const {nomVoie, error} = this.state

    return (
      <div>
        <div className='no-voie'>
          <div>
            <h4>Aucune voie</h4>
            <p>Entrez le nom de la voie que vous souhaitez ajouter à la commune.</p>
          </div>

          <CreateVoie
            input={nomVoie}
            handleInput={this.handleInput}
            handleSubmit={this.addVoie}
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
