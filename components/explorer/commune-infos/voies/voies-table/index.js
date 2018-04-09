import React from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'

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
    this.sort(val => val.nomsVoie[0], 'alphabetical')
  }

  sort(func, sortedBy) {
    const {voies} = this.state
    let sorted = sortBy(voies, func)
    let order = ''

    if (isSort(voies, func)) {
      sorted = sorted.reverse()
      order = 'desc'
    } else {
      order = 'asc'
    }

    this.setState({voies: sorted, sortedBy, order})
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
