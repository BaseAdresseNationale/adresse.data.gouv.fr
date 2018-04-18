import React from 'react'
import PropTypes from 'prop-types'

import FaCheck from 'react-icons/lib/fa/check'
import FaClose from 'react-icons/lib/fa/close'

import TableList from '../../table-list'

function getPosition(position) {
  if (position) {
    return `${position.coordinates[0]}, ${position.coordinates[1]}`
  }

  return <FaClose />
}

function getSources(sources) {
  return sources.map((source, idx) =>
  `${source}${idx + 1 < sources.length ? ', ' : ''}`)
}

class Addresses extends React.Component {
  constructor(props) {
    super(props)
    this.selectedAddress = this.selectedAddress.bind(this)
  }

  selectedAddress(item) {
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
            getSources(address.sources),
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
          handleSelect={this.selectedAddress} />
      </div>
    )
  }
}

Addresses.propTypes = {
  addresses: PropTypes.array.isRequired,
  selected: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    sources: PropTypes.array.isRequired
  }),
  onSelect: PropTypes.func.isRequired
}

Addresses.defaultProps = {
  selected: null
}

export default Addresses
