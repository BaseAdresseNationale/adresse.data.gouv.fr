import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import Button from '../../../../button'

import theme from '../../../../../styles/theme'

import VoieForm from './voie-form'

class FormWrapper extends React.Component {
  state = {
    input: '',
    commune: null,
    error: null
  }

  static propTypes = {
    communes: PropTypes.array.isRequired,
    addVoie: PropTypes.func.isRequired
  }

  handleInput = input => {
    this.setState({input})
  }

  setCommune = (commune, create = false) => {
    const {communes} = this.props

    this.setState(() => {
      let err = null

      if (create && communes.find(current => current.id === commune.id)) {
        err = 'Cette commune a déjà été ajoutée.'
      }

      return {
        commune: err ? null : commune,
        error: err
      }
    })
  }

  handleSubmit = () => {
    const {input, commune} = this.state
    const {addVoie} = this.props
    let error = null

    if (input.length === 0) {
      error = 'Indiquer le nom de la voie.'
    }

    if (error) {
      this.setState({error})
    } else {
      addVoie(input, commune)
      this.setState({
        input: '',
        commune: null,
        error: null
      })
    }
  }

  render() {
    const {input, commune, error} = this.state
    const {communes} = this.props

    return (
      <div>
        <VoieForm
          input={input}
          commune={commune}
          communes={communes}
          handleInput={this.handleInput}
          handleCommune={this.setCommune}
        />

        {error && (
          <div className='error'>{error}</div>
        )}

        {input && (
          <Button onClick={this.handleSubmit}>
            <FaPlus /> {input}{commune ? ` - ${commune.nom} (${commune.code})` : ''}
          </Button>
        )}

        <style jsx>{`
          .error {
            color: ${theme.colors.red};
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default FormWrapper
