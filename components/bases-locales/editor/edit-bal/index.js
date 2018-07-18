import React from 'react'
import PropTypes from 'prop-types'
import {startCase, remove} from 'lodash'

import Communes from './communes'

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

const formatName = name => {
  name.replace('_', ' ')
  const lower = name.toLowerCase()
  return startCase(lower)
}

class EditBal extends React.Component {
  state = {
    communes: null,
    selectedCommune: null
  }

  static propTypes = {
    csv: PropTypes.shape({
      communes: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    const {csv} = this.props
    this.setState({communes: extractCommunes(csv)})
  }

  // Communes
  addCommunes = newCommunes => {
    this.setState(state => {
      const communes = [...state.communes]
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

  renameCommune = (commune, newName) => {
    this.setState(state => {
      commune.edited = newName

      return {
        communes: state.communes
      }
    })
  }

  removeCommune = commune => {
    this.setState(state => {
      if (commune.created) {
        remove(state.communes, commune)
      } else {
        commune.removed = !commune.removed
      }

      return {
        communes: state.communes
      }
    })
  }

  selectCommune = commune => {
    this.setState({selectedCommune: commune})
  }

  magic = commune => {
    const newName = formatName(commune.nom)

    if (newName !== commune.nom) {
      this.renameCommune(commune, newName)
    }
  }

  render() {
    const {communes, selectedCommune} = this.state

    return (
      <div>
        {selectedCommune ?
          <h1>Voies</h1> :
          communes ?
            <Communes
              communes={communes}
              add={this.addCommunes}
              rename={this.renameCommune}
              fix={this.magic}
              remove={this.removeCommune}
              select={this.selectCommune} /> :
            <h1>Numéros</h1>
          }
      </div>
    )
  }
}

export default EditBal
