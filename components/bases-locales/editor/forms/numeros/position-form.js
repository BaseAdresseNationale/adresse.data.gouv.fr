import React from 'react'
import PropTypes from 'prop-types'

import SelectableItemList from '../../../../selectable-item-list'

import TextInput from '../../edit-bal/text-input'

import theme from '../../../../../styles/theme'

// TODO Ajouter de vrai types
const TYPES = [
  {text: 'Entrée', value: 'entrée'},
  {text: 'Boite', value: 'boite'},
  {text: 'Local', value: 'local'}
]

class PositionForm extends React.Component {
  state = {
    selectedType: null,
    sources: [],
    error: null
  }

  static propTypes = {
    position: PropTypes.object.isRequired
  }

  addSource = source => {
    this.setState(state => {
      const {sources} = state
      let error

      if (sources.includes(source)) {
        error = 'Cette source a déjà été ajoutée.'
      } else {
        sources.push(source)
      }

      return {
        sources,
        error
      }
    })
  }

  removeSource = source => {
    this.setState(state => {
      const {sources} = state

      return {
        sources: sources.filter(s => s !== source)
      }
    })
  }

  setType = type => {
    this.setState({selectedType: type})
  }

  handleSubmit = event => {
    const {selectedType, sources} = this.state
    const {position} = this.props

    event.preventDefault()

    onsubmit(position, {type: selectedType, sources})
  }

  render() {
    const {sources, selectedType, error} = this.state

    return (
      <div className='form'>

        <label>Type</label>
        <select defaultValue={selectedType}>
          {TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.text}
            </option>
          ))}
        </select>

        <label>Sources</label>
        <TextInput handleSubmit={this.addSource} />
        {error && (
          <div className='error'>{error}</div>
        )}

        <SelectableItemList
          list={sources.map(source => {
            return {
              key: source,
              value: source
            }
          })}
          buttonIcon='-'
          action={item => this.removeSource(item.value)}
        />

        <style jsx>{`
          .form {
            display: flex;
            flex-direction: column;
            margin: 1em 0;
            padding: 1em;
            width: 300px;
            border: 1px solid ${theme.border};
            border-radius: 4px;
          }

          label {
            margin: 0.5em 0;
          }

          .error {
            color: ${theme.colors.red};
          }
        `}</style>
      </div>
    )
  }
}

export default PositionForm
