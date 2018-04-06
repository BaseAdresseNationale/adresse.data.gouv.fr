import React from 'react'
import PropTypes from 'prop-types'

import isSort from '../../../../../lib/sort'

import TableHead from './table-head'
import TableBody from './table-body'

class VoiesTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      voies: [...props.voies],
      sortedBy: 'alphabetical',
      order: 'asc'
    }

    this.sort = this.sort.bind(this)
  }

  componentDidMount() {
    this.sort(val => val.nom, 'alphabetical')
  }

  sort(func, sortedBy) {
    const voies = [...this.state.voies]
    let order = ''

    if (isSort(voies, func)) {
      voies.sort((voieA, voieB) => func(voieB) > func(voieA))
      order = 'desc'
    } else {
      voies.sort((voieA, voieB) => func(voieA) > func(voieB))
      order = 'asc'
    }

    this.setState({voies, sortedBy, order})
  }

  render() {
    const {voies, sortedBy, order} = this.state

    return (
      <table>
        <TableHead sortedBy={sortedBy} sort={this.sort} order={order} />
        <TableBody voies={voies} />
        <style jsx>{`
          table {
            border-collapse: collapse;
            width: 100%;
          }
          `}</style>
      </table>
    )
  }
}

VoiesTable.propTypes = {
  voies: PropTypes.array.isRequired
}

export default VoiesTable
