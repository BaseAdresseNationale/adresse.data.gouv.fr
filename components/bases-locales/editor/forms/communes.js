import React from 'react'
import PropTypes from 'prop-types'
import {remove} from 'lodash'

import Button from '../../../button'
import Notification from '../../../notification'
import SelectableItemList from '../../../selectable-item-list'

import SearchCommune from '../../init-base/search-communes'

class Communes extends React.Component {
  state = {
    newCommunes: [],
    error: null
  }

  static propTypes = {
    communes: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired
  }

  addCommune = commune => {
    const {communes} = this.props

    this.setState(state => {
      const {newCommunes} = state
      let err = null

      if (newCommunes.find(current => current.code === commune.code)) {
        err = new Error('Commune has already been added')
      } else if (communes.find(current => current.nom.toLowerCase() === commune.nom.toLowerCase())) {
        err = new Error('Commune has already been added')
      } else {
        newCommunes.push(commune)
      }

      return {
        newCommunes,
        error: err
      }
    })
  }

  removeCommune = item => {
    this.setState(state => {
      const {newCommunes} = state
      remove(newCommunes, commune => commune.code === item.key)

      return {
        newCommunes
      }
    })
  }

  handleSave = event => {
    const {newCommunes} = this.state
    const {add} = this.props

    event.preventDefault()

    add(newCommunes)
  }

  render() {
    const {newCommunes, error} = this.state

    return (
      <div>
        <SearchCommune handleSelect={this.addCommune} />

        {error && (
          <Notification style={{marginTop: '1em'}} type='error' message={error.message} />
        )}

        {newCommunes.length > 0 &&
          <div>
            <h3>Communes sélectionnées</h3>
            <SelectableItemList
              list={newCommunes.map(commune => {
                return {
                  key: commune.code,
                  value: commune.nom
                }
              })}
              action={this.removeCommune}
              buttonIcon='-'
            />
            <Button onClick={this.handleSave}>Enregister</Button>
          </div>
        }
      </div>
    )
  }
}

export default Communes
