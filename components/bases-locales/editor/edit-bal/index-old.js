import React from 'react'
import PropTypes from 'prop-types'
import {forEach, remove, filter} from 'lodash'

import BAL from '../../../../lib/bal/api'

import Context from './context'

// import PositionsMap from './positions-map'
import Communes from './communes'
import PopUp from './pop-up'

export const FormContext = React.createContext()

// Change types
//   'created',
//   'deleted',
//   'edited: ',
//          'renamed',
//          'reposition',
//          'extra' // When metadata like "source" is changed

const getName = item => {
  return item.nom || item.nomVoie || item.numeroComplet
}

const getType = item => {
  if (item.voies) {
    return 'commune'
  }

  if (item.numeros) {
    return 'voie'
  }

  return 'numero'
}

const getChilds = item => {
  return item.voies || item.numeros || null
}

class EditBal extends React.Component {
  static propTypes = {
    tree: PropTypes.object
  }

  static defaultProps = {
    tree: null
  }

  constructor(props) {
    super(props)
    console.log('​EditBal -> constructor -> props.tree', props.tree)

    this.state = {
      selected: null,
      warning: null
      // Positions: {
      //   type: 'FeatureCollection',
      //   features: props.tree ? getFeaturesFromCommunes(props.tree.communes) : []
      // }
    }

    this.bal = new BAL(props.tree)
  }

  // ADD
  addCommune = commune => {
    this.setState(() => {
      this.bal.createCommune(commune.code, commune)

      return {
        selected: null
      }
    })
  }

  addVoie = voie => {
    this.setState(state => {
      const {selected} = state
      this.bal.createVoie(selected.code, voie)

      return {
        selected
      }
    })
  }

  addNumero = numero => {
    this.setState(state => {
      const {selected} = state
      this.bal.createNumero(selected.idVoie, numero)

      return {
        selected
      }
    })
  }

  // CONTEXT
  setContext = item => {
    this.setState(state => {
      if (!item) {
        return {
          selected: null
        }
      }

      const type = getType(item)
      // Let features = null
      let commune = null
      let voie = null
      let previousContext = null

      switch (type) {
        case 'commune':
          // Features = getFeaturesFromCommune(item)
          commune = item
          break
        case 'voie':
          // Features = getFeaturesFromVoie(item)
          previousContext = state.context.commune
          voie = item
          break
        case 'numero':
          previousContext = state.context.voie
          break
        default:
          // Features = [getFeature(item)]
          break
      }

      // Const positions = {
      //   type: 'FeatureCollection',
      //   features
      // }

      return {
        context: {
          item,
          commune: state.context ? state.context.commune : commune,
          voie: state.context ? state.context.voie : voie,
          type,
          name: getName(item),
          childs: getChilds(item),
          // Positions,
          previousContext
        }
      }
    })
  }

  selectNumero = numeroId => {
    const {communes} = this.state
    const numero = getNumero(communes, numeroId)

    this.setContext(numero)
  }

  // DELETE
  deleteItem = item => {
    this.setState(state => {
      const childs = item.voies || item.numeros || []
      let warning = null

      if (childs.length > 0 && state.warning === null) {
        warning = {
          item,
          name: getName(item),
          childs: getType(item) === 'commune' ? `${item.voies.length} voies` : `${item.numeros.length} numéros`
        }
      } else {
        item.deleted = true
        if (item.created) {
          remove(state.communes, item)
        }
      }

      return {
        communes: state.communes,
        warning
      }
    })
  }

  cancelDelete = () => {
    this.setState({warning: null})
  }

  // RENAME
  renameItem = (item, newName) => {
    this.setState(state => {
      item.edited = 'renamed'
      item.newName = newName

      return {
        communes: state.communes
      }
    })
  }

  // ASSIGN
  handleAssign = item => {
    console.log(item)
  }

  // CHANGES
  cancelChanges = item => {
    this.setState(state => {
      if (item.created) {
        remove(state.communes, item)
      } else {
        item.edited = false
        item.newName = null
        item.deleted = false
      }

      return {
        warning: null,
        communes: state.communes
      }
    })
  }

  previousContext = () => {
    const {previousContext} = this.state.context
    this.setContext(previousContext)
  }

  render() {
    const {selected, warning, positions} = this.state
    const {tree} = this.props
    const changes = tree ? this.bal.getChanges() : null
    const itemActions = {
      changeContext: this.setContext,
      assignItem: this.handleAssign,
      deleteItem: this.deleteItem,
      renameItem: this.renameItem,
      cancelChanges: this.cancelChanges,
      previousContext: this.previousContext
    }

    return (
      <div>
        {/* {positions && (
          <div className='map'>
            <PositionsMap
              positions={positions}
              context={context ? context.positions : null}
              selectNumero={this.selectNumero}
            />
          </div>
        )} */}

        {warning && (
          <PopUp
            {...warning}
            accept={this.deleteItem}
            close={this.cancelDelete}
          />
        )}

        {selected ? (
          <FormContext.Provider value={itemActions}>
            <Context
              context={selected}
              communes={communes}
              changes={tree ? changes : null}
            />
          </FormContext.Provider>
        ) : (
          <Communes
            communes={communes}
            add={this.addCommune}
            itemActions={itemActions}
          />
        )}

        <style jsx>{`
          .map {
            width: 100%;
            height: 500px;
          }
        `}</style>
      </div>
    )
  }
}

export default EditBal
