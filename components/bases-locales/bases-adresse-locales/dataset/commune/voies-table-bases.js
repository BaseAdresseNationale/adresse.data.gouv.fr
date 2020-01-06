import React from 'react'
import PropTypes from 'prop-types'

import TableList from './table-list'

class VoiesTableBases extends React.Component {
  static propTypes = {
    voies: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  selectVoie = item => {
    const {voies, onSelect} = this.props

    onSelect(
      voies.find(voie => voie.idVoie === item.key)
    )
  }

  render() {
    const {voies} = this.props
    const headers = [
      {
        title: 'Nom de voie',
        type: 'alphabetical',
        func: voie => voie.nomVoie
      },
      {
        title: 'Nombre d’adresses',
        type: 'numeric',
        func: voie => voie.numeros
      }
    ]

    const genItems = voies => {
      return voies.map(voie => {
        return {
          key: voie.idVoie,
          values: [
            voie.nomVoie,
            voie.numerosCount
          ]
        }
      })
    }

    return (
      <TableList
        title='Voies de la commune'
        subtitle={`${voies.length} voies répertoriées`}
        list={voies}
        headers={headers}
        genItems={genItems}
        initialSort={headers[0]}
        handleSelect={this.selectVoie} />
    )
  }
}

export default VoiesTableBases
