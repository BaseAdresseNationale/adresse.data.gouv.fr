import React from 'react'
import PropTypes from 'prop-types'
import {remove} from 'lodash'

import Button from '../../../../button'
import Notification from '../../../../notification'
import SelectableItemList from '../../../../selectable-item-list'

import TextInput from '../text-input'

class AddVoie extends React.Component {
  state = {
    voies: [],
    error: null
  }

  static propTypes = {
    voiesFile: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  addVoie = voieName => {
    const {voiesFile} = this.props

    this.setState(state => {
      const {voies} = state
      let err = null

      if (voies.find(current => current.nom.toLowerCase() === voieName.toLowerCase())) {
        err = new Error('Voie has already been added')
      } else if (voiesFile.find(current => current.nomVoie.toLowerCase() === voieName.toLowerCase())) {
        err = new Error('Voie has already been added')
      } else {
        voies.push({
          nom: voieName,
          code: '0000' // TO-DO code FANTOIR
        })
      }

      return {
        voies,
        error: err
      }
    })
  }

  removeVoie = item => {
    this.setState(state => {
      const {voies} = state
      remove(voies, voie => voie.nom === item.value)

      return {
        voies
      }
    })
  }

  handleSave = () => {
    const {voies} = this.state
    const {onSubmit} = this.props

    onSubmit(voies)
  }

  render() {
    const {voies, error} = this.state

    return (
      <div>
        <div className='header'>
          <TextInput
            placeholder='Avenue Victor Hugo'
            handleSubmit={this.addVoie}
          />
        </div>

        {error && <Notification style={{marginTop: '1em'}} type='error' message={error.message} />}

        {voies.length > 0 &&
          <div>
            <h3>Voies créées</h3>
            <SelectableItemList
              list={voies.map(voie => {
                return {
                  key: voie.nom,
                  value: voie.nom
                }
              })}
              buttonIcon='-'
              action={item => this.removeVoie(item)}
            />
            <Button onClick={this.handleSave}>Enregister</Button>
          </div>
        }

        <style jsx>{`
          .header {
            display: flex;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}

export default AddVoie
