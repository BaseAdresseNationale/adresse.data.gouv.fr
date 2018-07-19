import React from 'react'
import PropTypes from 'prop-types'
import {remove} from 'lodash'

import Button from '../../../../button'
import Notification from '../../../../notification'
import SelectableItemList from '../../../../selectable-item-list'

import FormWrapper from './form-wrapper'

class Voie extends React.Component {
  state = {
    newVoies: [],
    error: null
  }

  static propTypes = {
    communes: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired
  }

  addVoie = (voieName, commune) => {
    if (voieName.length === 0) {
      return
    }

    this.setState(state => {
      const {newVoies} = state
      let err = null

      if (newVoies.find(newVoie => newVoie.nomVoie.toLowerCase() === voieName.toLowerCase())) {
        err = new Error('Voie has already been added')
      } else if (commune && commune.voies && commune.voies.find(voie => voie.nomVoie.toLowerCase() === voieName.toLowerCase())) {
        err = new Error('Voie has already been added')
      } else {
        newVoies.push({
          parent: commune,
          nomVoie: voieName,
          codeVoie: `V000` // TO-DO code FANTOIR
        })
      }

      return {
        newVoies,
        error: err
      }
    })
  }

  removeVoie = item => {
    this.setState(state => {
      const {newVoies} = state
      remove(newVoies, voie => voie.nomVoie === item.value)

      return {
        newVoies
      }
    })
  }

  handleSave = () => {
    const {newVoies} = this.state
    const {add} = this.props

    add(newVoies)
  }

  render() {
    const {communes} = this.props
    const {newVoies, error} = this.state

    return (
      <div>
        <FormWrapper
          communes={communes}
          addVoie={this.addVoie}
        />

        {error && (
          <Notification style={{marginTop: '1em'}} type='error' message={error.message} />
        )}

        {newVoies.length > 0 &&
          <div>
            <h3>Voies créées</h3>
            <SelectableItemList
              list={newVoies.map(voie => {
                return {
                  key: voie.nomVoie,
                  value: `${voie.nomVoie}${voie.parent ? ` - ${voie.parent.nom}` : ''}`
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

export default Voie
