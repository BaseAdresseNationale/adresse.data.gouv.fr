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
      order: 'asc',
      wrap: true
    }

    this.sort = this.sort.bind(this)
    this.handleWrap = this.handleWrap.bind(this)
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

  handleWrap() {
    this.setState(state => {
      return {wrap: !state.wrap}
    })
  }

  render() {
    const {voies, sortedBy, order, wrap} = this.state
    const voiesDisplay = wrap ? voies.slice(0, 9) : voies
    const wrapper = voiesDisplay.length < voies.length

    return (
      <div>
        <table className={wrapper && 'wrapped'}>
          <TableHead sortedBy={sortedBy} sort={this.sort} order={order} />
          <TableBody voies={voiesDisplay} wrapped={wrapper} />
        </table>

        {voies.length >= 9 &&
          <div className='wrap' onClick={this.handleWrap}>
            {wrap ? 'Afficher toutes les voies' : 'Réduire'}
          </div>
        }

        <style jsx>{`
          table {
            border-collapse: collapse;
            width: 100%;
          }

          table.wrapped:after {
            position: absolute;
            bottom: 35px;
            height: 3%;
            width: 100%;
            content: "";
            background: linear-gradient(to top,
               rgba(255,255,255, 1) 20%,
               rgba(255,255,255, 0) 80%
            );
          }

          .wrap {
            width: 100%;
            text-align: center;
            margin-top: 1em;
            text-decoration: underline;
          }

          .wrap:hover {
            cursor: pointer;
            text-decoration: none;
          }
          `}</style>
      </div>

    )
  }
}

VoiesTable.propTypes = {
  voies: PropTypes.array.isRequired
}

export default VoiesTable
