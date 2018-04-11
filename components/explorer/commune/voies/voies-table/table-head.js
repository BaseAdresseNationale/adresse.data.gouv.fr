import React from 'react'
import PropTypes from 'prop-types'

import FaSortAlphaAsc from 'react-icons/lib/fa/sort-alpha-asc'
import FaSortAlphaDesc from 'react-icons/lib/fa/sort-alpha-desc'
import FaSortNumericAsc from 'react-icons/lib/fa/sort-numeric-asc'
import FaSortNumericDesc from 'react-icons/lib/fa/sort-numeric-desc'

import TableHeader from './table-header'

class TableHead extends React.Component {
  constructor(props) {
    super(props)

    this.alphabeticalSort = this.alphabeticalSort.bind(this)
    this.numberSort = this.numberSort.bind(this)
  }

  alphabeticalSort() {
    const {sort} = this.props
    sort(val => val.nomsVoie[0], 'alphabetical')
  }

  numberSort() {
    const {sort} = this.props
    sort(val => val.nbNumeros, 'numbers')
  }

  render() {
    const {sortedBy, order} = this.props
    return (
      <tbody>
        <tr>
          <TableHeader
            title='Nom de voie'
            sort={this.alphabeticalSort}
            icon={order === 'asc' ? <FaSortAlphaAsc /> : <FaSortAlphaDesc />}
            actived={sortedBy === 'alphabetical'} />
          <TableHeader
            title='Nombre de numéro'
            sort={this.numberSort}
            icon={order === 'asc' ? <FaSortNumericAsc /> : <FaSortNumericDesc />}
            actived={sortedBy === 'numbers'} />
          <TableHeader title='Sources' />
        </tr>
      </tbody>
    )
  }
}

TableHead.propTypes = {
  sortedBy: PropTypes.oneOf([
    'alphabetical',
    'numbers'
  ]).isRequired,
  order: PropTypes.oneOf([
    'asc',
    'desc'
  ]).isRequired,
  sort: PropTypes.func.isRequired
}

export default TableHead
