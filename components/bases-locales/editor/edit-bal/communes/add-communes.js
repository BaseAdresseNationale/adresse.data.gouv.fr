import React from 'react'
import PropTypes from 'prop-types'
import {remove} from 'lodash'
import FaClose from 'react-icons/lib/fa/close'

import Button from '../../../../button'
import Notification from '../../../../notification'
import SelectableItemList from '../../../../selectable-item-list'

import SearchCommune from '../../../init-base/search-communes'

import theme from '../../../../../styles/theme'

class AddCommune extends React.Component {
  state = {
    communes: [],
    error: null
  }

  static propTypes = {
    communesFile: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  addCommune = commune => {
    const {communesFile} = this.props

    this.setState(state => {
      const communes = [...state.communes]
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
      const communes = [...state.communes]
      remove(communes, commune => commune.code === item.key)

      return {
        communes
      }
    })
  }

  handleMode = event => {
    event.preventDefault()

    this.setState(state => {
      return {
        addMode: !state.addMode
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
    const {close} = this.props

    return (
      <div className='form'>
        <div className='header'>
          <div className='search'><SearchCommune handleSelect={this.addCommune} /></div>
          <div className='close' onClick={close}><FaClose size={24} /></div>
        </div>

        {error && <Notification style={{marginTop: '1em'}} type='error' message={error.message} />}

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

        <style jsx>{`
        .form {
          display: flex;
          flex-direction: column;
          margin: 1em 0;
          padding: 2em 1em;
          box-shadow: 0 1px 4px ${theme.boxShadow};
        }

        .form input {
          margin-right: 1em;
        }

        .header {
          display: flex;
          align-items: center;
        }

        .search {
          width: 100%;
        }

        .close {
          padding: 1em;
          border-radius: 4px;
        }

        .close:hover {
          padding: 0.9em;
          margin: 0.1em;
          cursor: pointer;
          background-color: whitesmoke;
        }

        .button {
          margin: 1em 0;
        }
      `}</style>
      </div>
    )
  }
}

export default AddCommune
