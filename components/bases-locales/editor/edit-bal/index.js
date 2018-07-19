import React from 'react'
import PropTypes from 'prop-types'
import {forEach, remove, filter} from 'lodash'

import Context from './context'

import PositionsMap from './positions-map'
import Communes from './communes'
import PopUp from './pop-up'

export const ItemContext = React.createContext()

// Change types
//   'created',
//   'deleted',
//   'edited: ',
//          'renamed',
//          'reposition',
//          'extra' // When metadata like "source" is changed

const createCommune = commune => {
  return {
    ...commune,
    voies: [],
    source: [],
    dateMAJ: null,
    created: true
  }
}

const createVoie = voieName => {
  return {
    nomVoie: voieName,
    idVoie: 'id', // TODO FANTOIR
    numeros: [],
    source: [],
    dateMAJ: null,
    created: true
  }
}

const createNumero = (commune, voie, numero) => {
  const codeCommune = commune.code
  const {idVoie} = voie

  return {
    numero,
    id: `${codeCommune}-${idVoie}-${numero}`,
    numeroComplet: numero,
    positions: [],
    source: [],
    suffixe: null,
    dateMAJ: null,
    created: true
  }
}

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

const getFeature = numero => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: numero.positions[0].coords
    },
    properties: {
      id: numero.id,
      numero: numero.numero,
      source: numero.source
    }
  }
}

const getFeaturesFromVoie = voie => {
  const features = []

  if (voie.numeros) {
    forEach(voie.numeros, numero => {
      features.push(getFeature(numero))
    })
  }

  return features
}

const getFeaturesFromCommune = commune => {
  const features = []

  if (commune.voies) {
    forEach(commune.voies, voie => {
      const voieFeatures = getFeaturesFromVoie(voie)

      forEach(voieFeatures, feature => {
        features.push(feature)
      })
    })
  }

  return features
}

const getFeaturesFromCommunes = communes => {
  const features = []

  forEach(communes, commune => {
    const communeFeatures = getFeaturesFromCommune(commune)

    forEach(communeFeatures, feature => {
      features.push(feature)
    })
  })

  return features
}

const hasChanges = item => {
  return item.created || item.deleted || item.edited
}

const getChanges = communes => {
  const changes = {communes: {}, voies: {}, numeros: {}}

  changes.communes = filter(communes, commune => hasChanges(commune))

  forEach(communes, commune => {
    if (commune.voies) {
      forEach(commune.voies, voie => {
        if (hasChanges(voie)) {
          changes.voies.push(voie)
        }

        if (voie.numeros) {
          forEach(voie.numeros, numero => {
            if (hasChanges(numero)) {
              changes.numeros.push(numero)
            }
          })
        }
      })
    }
  })

  return changes
}

const getNumero = (communes, numeroId) => {
  communes.forEach(commune => {
    if (commune.voies) {
      commune.voies.forEach(voie => {
        if (voie && voie.numeros) {
          const find = voie.numeros.find(numero => numero.id === numeroId)

          if (find) {
            return find
          }
        }
      })
    }
  })

  return null
}

class EditBal extends React.Component {
  static propTypes = {
    csv: PropTypes.shape({
      communes: PropTypes.object.isRequired
    })
  }

  static defaultProps = {
    csv: null
  }

  constructor(props) {
    super(props)
    this.state = {
      context: null,
      warning: null,
      communes: props.csv ? props.csv.communes : []
      // positions: {
      //   type: 'FeatureCollection',
      //   features: props.csv ? getFeaturesFromCommunes(props.csv.communes) : []
      // }
    }
  }

  // ADD
  addCommune = newCommune => {
    this.setState(state => {
      const commune = createCommune(newCommune)
      state.communes.push(commune)

      return {
        communes: state.communes
      }
    })
  }

  addVoie = newVoie => {
    this.setState(state => {
      const {commune} = state.context
      const voie = createVoie(newVoie)

      commune.voies.push(voie)

      return {
        communes: state.communes,
        notAssigned: state.notAssigned
      }
    })
  }

  addNumeros = newNumeros => {
    this.setState(state => {
      newNumeros.forEach(newNumero => {
        const {commune, voie} = state.context
        const numero = createNumero(commune, voie, newNumero)

        voie.numeros.push(numero)

        return {
          communes: state.communes
        }
      })
    })
  }

  // CONTEXT
  setContext = item => {
    this.setState(state => {
      if (!item) {
        return {
          context: null
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
    const {context, warning, positions, communes} = this.state
    const {csv} = this.props
    const changes = communes ? getChanges(communes) : []
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

        {context ? (
          <ItemContext.Provider value={itemActions}>
            <Context
              context={context}
              communes={communes}
              changes={csv ? changes : null}
            />
          </ItemContext.Provider>
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

// // FLAT
// const communes = [
//   {voies: [
//     numeros: [

//     ]
//   ]}
// ]

// // INDEX
// const items = {
//   communes: [{id: '123'}],
//   voies: [{communeId: '123', id: '345'}],
//   numeros: [{communeId: '123', voieId: '345', id: '678'}]
// }
