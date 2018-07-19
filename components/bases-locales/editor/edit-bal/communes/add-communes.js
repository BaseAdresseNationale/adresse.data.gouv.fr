import React from 'react'
import PropTypes from 'prop-types'
import {remove} from 'lodash'

import Button from '../../../../button'
import Notification from '../../../../notification'
import SelectableItemList from '../../../../selectable-item-list'

import SearchCommune from '../../../init-base/search-communes'

class AddCommune extends React.Component {
  state = {
    communes: [],
    error: null
  }

  static propTypes = {
    communesFile: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  addCommune = commune => {
    const {communesFile} = this.props

    this.setState(state => {
      const {communes} = state
      let err = null

      if (communes.find(current => current.code === commune.code)) {
        err = new Error('Commune has already been added')
      } else if (communesFile.find(current => current.nom.toLowerCase() === commune.nom.toLowerCase())) {
        err = new Error('Commune has already been added')
      } else {
        communes.push(commune)
      }

      return {
        communes,
        error: err
      }
    })
  }

  removeCommune = item => {
    this.setState(state => {
      const {communes} = state
      remove(communes, commune => commune.code === item.key)

      return {
        communes
      }
    })
  }

  handleSave = event => {
    const {communes} = this.state
    const {onSubmit} = this.props

    event.preventDefault()

    onSubmit(communes)
  }

  render() {
    const {communes, error} = this.state

    return (
      <div>
        <SearchCommune handleSelect={this.addCommune} />

        {error && (
          <Notification style={{marginTop: '1em'}} type='error' message={error.message} />
        )}

        {communes.length > 0 &&
          <div>
            <h3>Communes sélectionnées</h3>
            <SelectableItemList
              list={communes.map(commune => {
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

export default AddCommune
