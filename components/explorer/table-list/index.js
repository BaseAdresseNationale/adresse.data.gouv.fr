import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'

import isSort from '../../../lib/sort'

import Title from './title'
import Table from './table'

import Head from './table/head'
import Body from './table/body'

class TableList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wrap: true
    }

    this.sort = this.sort.bind(this)
    this.handleWrap = this.handleWrap.bind(this)
  }

  componentDidMount() {
    const {initialSort} = this.props

    if (initialSort) {
      this.sort(initialSort.func, initialSort.sortedBy)
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState(() => ({
  //     sortedList: sortBy(nextProps.list, val => val.nomVoie),
  //     order: 'asc',
  //     sortedBy: 'alphabetical'
  //   }))
  // }

  sort(func, sortedBy) {
    const {list} = this.props
    let sorted = sortBy(list, func)
    let order = ''

    if (isSort(list, func)) {
      sorted = sorted.reverse()
      order = 'desc'
    } else {
      order = 'asc'
    }

    this.setState({sortedList: sorted, sortedBy, order})
  }

  handleWrap() {
    this.setState(state => {
      return {wrap: !state.wrap}
    })
  }

  render() {
    const {wrap, sortedList} = this.state
    const {title, subtitle, list, headers, genItems, selected, handleSelect} = this.props
    const disabledWrap = list.length < 9
    const orderedList = sortedList || list
    const displayedList = wrap && !disabledWrap ?
      orderedList.slice(0, 9) :
      orderedList

    return (
      <div>
        <Title title={title} subtitle={subtitle} />

        <Table list={displayedList} wrap={wrap} disabledWrap={disabledWrap} onWrap={this.handleWrap}>
          <Fragment>
            <Head headers={headers} />
            <Body
              items={genItems(displayedList)}
              wrapped={wrap && !disabledWrap}
              selected={selected}
              handleSelect={handleSelect} />
          </Fragment>
        </Table>

        <style jsx>{`
            .head {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .loading {
              width: 100%;
              height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            `}</style>
      </div>
    )
  }
}

TableList.propTypes = {
  title: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  genItems: PropTypes.func.isRequired,
  subtitle: PropTypes.string,
  initialSort: PropTypes.shape({
    func: PropTypes.func.isRequired,
    sortedBy: PropTypes.string.isRequired
  }),
  selected: PropTypes.object,
  handleSelect: PropTypes.func
}

TableList.defaultProps = {
  subtitle: '',
  initialSort: null,
  selected: null,
  handleSelect: () => {}
}

export default TableList
