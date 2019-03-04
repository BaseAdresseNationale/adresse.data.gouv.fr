import React from 'react'
import PropTypes from 'prop-types'
import {remove} from 'lodash'

import {extractCommunes} from '../../../lib/bal/api'

import Button from '../../button'
import Notification from '../../notification'
import Loader from '../../loader'
import SelectableItemList from '../../selectable-item-list'

import SearchCommunes from './search-communes'

class InitBase extends React.Component {
  state = {
    communes: [],
    loading: false
  }

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired
  }

  addCommune = commune => {
    this.setState(state => {
      const communes = [...state.communes]
      let err = null

      if (communes.find(current => current.code === commune.code)) {
        err = new Error('Commune has already been added')
      } else {
        communes.push(commune)
      }

      return {
        communes,
        error: err,
        csv: null,
        filename: null
      }
    })
  }

  removeCommune = communeCode => {
    this.setState(state => {
      const communes = [...state.communes]
      remove(communes, current => current.code === communeCode)

      return {
        communes,
        csv: null,
        filename: null
      }
    })
  }

  handleGenerate = () => {
    this.setState(state => {
      this.generate(state.communes)
      return {
        csv: null,
        filename: null,
        loading: true
      }
    })
  }

  generate = async communes => {
    const {handleSubmit} = this.props
    let csv = null
    let error = null

    try {
      csv = await extractCommunes(communes)
    } catch (err) {
      error = err
    }

    this.setState({
      error,
      loading: false
    })

    handleSubmit(csv)
  }

  render() {
    const {communes, loading, error} = this.state

    return (
      <div>
        <h3>Ajoutez autant de communes que vous souhaitez</h3>
        <p><em>Il est possible de préciser le code département lorsque la commune a beaucoup d’homonymes. Exemple : Saint-Just 18</em></p>
        <SearchCommunes handleSelect={this.addCommune} />

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
              buttonIcon='-'
              action={item => this.removeCommune(item.key)}
            />
          </div>
        }

        <div className='centered'>
          {communes.length > 0 && (
            <Button onClick={this.handleGenerate}>
              {loading ?
                <span>Génération en cours… <Loader size='small' /></span> :
                'Créer la Base Adresse Locale'
              }
            </Button>
          )}
        </div>

        {error && <Notification style={{marginTop: '1em'}} type='error' message={error.message} />}

        <style jsx>{`
          .centered {
            text-align: center;
          }

          span {
            display: flex;
            align-items: center;
          }
          `}</style>
      </div>
    )
  }
}

export default InitBase
