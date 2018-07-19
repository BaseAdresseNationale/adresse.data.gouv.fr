import React from 'react'
import PropTypes from 'prop-types'
import {startCase, remove} from 'lodash'

import Communes from './communes'
import Voies from './voies'

const extractCommunes = csv => {
  return csv.communes.map(commune => {
    return {
      ...commune,
      removed: false,
      created: false,
      edited: null
    }
  }).sort((a, b) => a.nom.localeCompare(b.nom))
}

const extractVoies = communes => {
  return [].concat([], ...communes.map(commune => {
    return commune.voies.map(voie => {
      return {
        ...voie,
        codeCommune: commune.code,
        nom: voie.nomVoie,
        removed: false,
        created: false,
        edited: null
      }
    })
  }))
}

const formatName = name => {
  name.replace('_', ' ')
  const lower = name.toLowerCase()
  return startCase(lower)
}

class EditBal extends React.Component {
  state = {
    communes: null,
    voies: null,
    selectedCommune: null
  }

  static propTypes = {
    csv: PropTypes.shape({
      communes: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    const {csv} = this.props
    const communes = extractCommunes(csv)
    const voies = extractVoies(communes)

    this.setState({
      communes,
      voies
    })
  }

  addCommunes = newCommunes => {
    this.setState(state => {
      const {communes} = state

      newCommunes.map(commune =>
        communes.push({
          nom: commune.nom,
          code: commune.code,
          dateMAJ: null,
          voies: [],
          numerosCount: 0,
          voiesCount: 0,
          source: [],
          removed: false,
          created: true,
          edited: null
        })
      )

      communes.sort((a, b) => a.nom.localeCompare(b.nom))

      return {
        communes
      }
    })
  }

  addVoies = newVoies => {
    this.setState(state => {
      const {voies, selectedCommune} = state
      newVoies.map(voie =>
        voies.push({
          nom: voie.nom,
          code: voie.code,
          codeCommune: selectedCommune.code,
          dateMAJ: null,
          numeros: [],
          numerosCount: 0,
          source: [],
          removed: false,
          created: true,
          edited: null
        })
      )

      voies.sort((a, b) => a.nom.localeCompare(b.nom))

      return {
        voies
      }
    })
  }

  renameItem = (item, newName) => {
    this.setState(state => {
      item.edited = newName

      return state
    })
  }

  removeItem = (cat, item) => {
    this.setState(state => {
      if (item.created) {
        remove(state[cat], item)
      } else {
        item.removed = !item.removed
      }

      return state
    })
  }

  fixItem = item => {
    const newName = formatName(item.nom)

    if (newName !== item.nom) {
      this.renameItem(item, newName)
    }
  }

  selectItem = (cat, item) => {
    this.setState(state => {
      state[cat] = item
      return state
    })
  }

  render() {
    const {communes, voies, selectedCommune} = this.state

    if (!communes && !voies) {
      return <div>Chargement…</div>
    }

    return (
      <div>
        {selectedCommune ? (
          <Voies
            commune={selectedCommune}
            voies={voies.filter(voie => voie.codeCommune === selectedCommune.code)}
            add={this.addVoies}
            rename={this.renameItem}
            remove={this.removeItem}
            select={this.selectItem}
          />
        ) : (
          <Communes
            communes={communes}
            add={this.addCommunes}
            remove={this.removeItem}
            select={this.selectItem}
          />
        )}
      </div>
    )
  }
}

export default EditBal
