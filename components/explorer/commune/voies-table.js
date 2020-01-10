import React from 'react'
import PropTypes from 'prop-types'

import {getTypeByPriority} from '../../../lib/types'

import {tagsList} from '../../../lib/table'

import TableList from '../../table-list'

class VoiesTable extends React.Component {
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
        func: voie => voie.numerosCount
      },
      {title: 'Source'}
    ]

    const genItems = voies => {
      return voies.map(voie => {
        return {
          key: voie.idVoie,
          values: [
            voie.nomVoie,
            voie.numerosCount,
            tagsList(getTypeByPriority(voie.sources))
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

export default VoiesTable
