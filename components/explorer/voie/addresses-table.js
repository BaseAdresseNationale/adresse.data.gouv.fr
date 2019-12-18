import React from 'react'
import PropTypes from 'prop-types'

import {tagsList} from '../../../lib/table'
import {getTypeByPriority} from '../../../lib/types'

import TableList from '../table-list'

class AddressesTable extends React.Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    numero: PropTypes.shape({
      numero: PropTypes.string.isRequired,
      position: PropTypes.object.isRequired,
      sources: PropTypes.array.isRequired
    }),
    onSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    numero: null
  }

  selectAddress = item => {
    const {onSelect} = this.props

    onSelect(item.values[0])
  }

  render() {
    const {addresses, numero} = this.props
    const headers = [
      {title: 'Numéro'},
      {title: 'Sources'},
      {title: 'Destination'}
    ]
    const genItems = addresses => {
      return addresses.map(address => {
        const destination = address.destination ? address.destination : []

        return {
          key: address.id,
          values: [
            address.numero,
            tagsList(getTypeByPriority(address.sources)),
            tagsList(getTypeByPriority(destination))
          ]
        }
      })
    }

    return (
      <div className='voies'>
        <TableList
          title='Adresses de la voie'
          subtitle={`${addresses.length} adresses répertoriées`}
          list={addresses}
          headers={headers}
          genItems={genItems}
          select={numero}
          handleSelect={this.selectAddress} />
        <style jsx>{`
          .voies {
            margin-top: 2em;
          }
        `}</style>
      </div>
    )
  }
}

export default AddressesTable
