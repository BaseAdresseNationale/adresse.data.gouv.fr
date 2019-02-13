import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'

import theme from '../../styles/theme'

import {getName} from '../../lib/bal/item'

import Button from '../button'

import SwitchInput from '../explorer/table-list/filters/switch-input'
import PreventedDefaultForm from '../bases-locales/editor/edit-bal/prevented-default-form'

class CreateVoieMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      voie: props.voie,
      voieInput: '',
      toponyme: false,
      error: null
    }
  }

  static propTypes = {
    voies: PropTypes.array,
    voie: PropTypes.object,
    coordinates: PropTypes.array.isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired
    }).isRequired,
    close: PropTypes.func.isRequired
  }

  static defaultProps = {
    voies: null,
    voie: null
  }

  handleInput = e => {
    this.setState({
      input: e.target.value,
      error: null
    })
  }

  handleVoieInput = e => {
    this.setState({
      voieInput: e.target.value,
      error: null
    })
  }

  onSelectVoie = idVoie => {
    const {voies} = this.props
    const voie = voies.find(voie => voie.idVoie === idVoie)

    this.setState({
      voie,
      error: null
    })
  }

  toggleToponyme = () => {
    this.setState(state => {
      return {
        toponyme: !state.toponyme,
        error: null
      }
    })
  }

  handleSubmit = async () => {
    const {toponyme} = this.state
    const {coordinates, actions, close} = this.props
    const position = {
      _id: '',
      coords: coordinates,
      dateMAJ: null,
      source: [],
      type: 'entrée'
    }
    const item = toponyme ? this.createToponyme(position) : this.createNumero(position)

    try {
      await actions.addItem(item)
      close()
    } catch (error) {
      this.setState({error})
    }
  }

  createToponyme = position => {
    const {input} = this.state
    return {
      nomVoie: input,
      position
    }
  }

  createNumero = position => {
    const {input, voie} = this.state

    return {
      numero: input,
      numeroComplet: input,
      codeVoie: voie ? voie.codeVoie : null,
      positions: [position]
    }
  }

  render() {
    const {input, toponyme, voie, voieInput, error} = this.state
    const {voies} = this.props

    const menu = {
      zIndex: 999,
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2px 0',
      fontSize: '90%',
      position: 'absolute',
      top: '120px',
      left: '10px',
      maxHeight: '90%',
      overflow: 'scroll'
    }

    return (
      <div className='form'>
        <div className='title'>Nouvelle adresse</div>
        <PreventedDefaultForm onSubmit={this.handleSubmit} style={{display: 'grid', gridRowGap: '0.5em'}}>
          <input
            ref={input => {
              this.nameInput = input
            }}
            type='text'
            placeholder='Adresse'
            value={input}
            onChange={this.handleInput}
          />

          {error && <div className='error'>{error.message}</div>}

          {!toponyme && (
            <Autocomplete
              menuStyle={menu}
              getItemValue={voie => voie.idVoie}
              items={voies.filter(voie => getName(voie).startsWith(voieInput))}
              inputProps={{placeholder: 'Voie'}}
              renderItem={(voie, isHighlighted) => (
                <div
                  key={voie.idVoie}
                  className='menu-item'
                  style={{background: isHighlighted ? theme.colors.lighterGrey : '#fff'}}
                >
                  {getName(voie)}
                </div>
              )}
              value={voie ? voie.nomVoie : voieInput}
              onChange={this.handleVoieInput}
              onSelect={this.onSelectVoie}
              selectOnBlur
            />
          )}

          <SwitchInput
            handleChange={this.toggleToponyme}
            label='Toponyme'
            isChecked={toponyme} />

          {input.length > 0 && (
            <Button onClick={this.handleSubmit}>Enregistrer</Button>
          )}
        </PreventedDefaultForm>

        <style jsx>{`
          .title {
            margin: 0.5em 0;
          }

          .menu-item {
            padding: 1em;
          }
          .error {
            color: ${theme.colors.red};
          }
          `}</style>
      </div>
    )
  }
}

export default CreateVoieMenu
