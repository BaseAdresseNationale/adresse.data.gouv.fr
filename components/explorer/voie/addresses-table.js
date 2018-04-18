import React from 'react'
import PropTypes from 'prop-types'

import FaCheck from 'react-icons/lib/fa/check'
import FaClose from 'react-icons/lib/fa/close'

import {getPosition, list} from '../../../lib/table'

import TableList from '../table-list'

class AddressesTable extends React.Component {
  constructor(props) {
    super(props)
    this.selectAddress = this.selectAddress.bind(this)
  }

  selectAddress(item) {
    const {onSelect} = this.props
    onSelect({numero: item.values[0]})
  }

  render() {
    const {addresses, selected} = this.props
    const headers = [
      {title: 'Numéro'},
      {title: 'Sources'},
      {title: 'Positions'},
      {title: 'Active'}
    ]
    const genItems = addresses => {
      return addresses.map(address => {
        return {
          key: address.id,
          values: [
            address.numero,
            list(address.sources),
            getPosition(address.position),
            address.active ? <FaCheck /> : <FaClose />
          ]
        }
      })
    }

    return (
      <div>
        <TableList
          title='Adresses de la voie'
          subtitle={`${addresses.length} addresses répertoriées`}
          list={addresses}
          headers={headers}
          genItems={genItems}
          selected={selected}
          handleSelect={this.selectAddress} />
      </div>
    )
  }
}

AddressesTable.propTypes = {
  addresses: PropTypes.array.isRequired,
  selected: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    sources: PropTypes.array.isRequired
  }),
  onSelect: PropTypes.func.isRequired
}

AddressesTable.defaultProps = {
  selected: null
}

export default AddressesTable
