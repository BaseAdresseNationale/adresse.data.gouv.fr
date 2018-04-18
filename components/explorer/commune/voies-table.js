import React from 'react'
import PropTypes from 'prop-types'

import {list} from '../../../lib/table'

import TableList from '../table-list'

class VoiesTable extends React.Component {
  constructor(props) {
    super(props)
    this.selectVoie = this.selectVoie.bind(this)
  }

  selectVoie(item) {
    const {voies, onSelect} = this.props
    const voie = voies.find(voie => voie.idVoie === item.key)

    onSelect(voie)
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
      },
      {title: 'Source'},
      {title: 'Destination'}
    ]

    const genItems = voies => {
      return voies.map(voie => {
        return {
          key: voie.idVoie,
          values: [
            voie.nomVoie,
            voie.numeros,
            list(voie.sources),
            list(voie.destination)
          ]
        }
      })
    }

    return (
      <div>
        <TableList
          title='Adresses de la voie'
          subtitle={`${voies.length} voies répertoriées`}
          list={voies}
          headers={headers}
          genItems={genItems}
          initialSort={headers[0]}
          handleSelect={this.selectVoie} />
      </div>
    )
  }
}

VoiesTable.propTypes = {
  voies: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default VoiesTable
