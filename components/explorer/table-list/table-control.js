import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'

import Table from './table'

import Head from './table/head'
import Body from './table/body'

class TableControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'desc',
      actived: null,
      wrap: true
    }

    this.sort = this.sort.bind(this)
    this.handleWrap = this.handleWrap.bind(this)
  }

  componentDidMount() {
    const {initialSort} = this.props

    if (initialSort) {
      this.sort(initialSort.func, initialSort.title)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {initialSort} = nextProps

    if (initialSort) {
      this.setState(() => ({
        sortedList: sortBy(nextProps.list, initialSort.func),
        order: 'asc',
        actived: initialSort.title
      }))
    }
  }

  sort(func, header) {
    const {order} = this.state
    const {list} = this.props
    let sorted = sortBy(list, func)

    if (order === 'asc') {
      sorted = sorted.reverse()
    }

    this.setState({
      sortedList: sorted,
      actived: header,
      order: order === 'asc' ? 'desc' : 'asc'
    })
  }

  handleWrap() {
    this.setState(state => {
      return {wrap: !state.wrap}
    })
  }

  render() {
    const {wrap, order, sortedList, actived} = this.state
    const {list, headers, genItems, selected, handleSelect} = this.props
    const disabledWrap = list.length < 9
    const orderedList = sortedList || list
    const displayedList = wrap && !disabledWrap ?
      orderedList.slice(0, 9) :
      orderedList

    return (
      <Table list={displayedList} wrap={wrap} disabledWrap={disabledWrap} onWrap={this.handleWrap}>
        <Fragment>
          <Head headers={headers} order={order} actived={actived} sort={this.sort} />
          <Body
            items={genItems(displayedList)}
            wrapped={wrap && !disabledWrap}
            selected={selected}
            handleSelect={handleSelect} />
        </Fragment>
      </Table>
    )
  }
}

TableControl.propTypes = {
  list: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  genItems: PropTypes.func.isRequired,
  initialSort: PropTypes.object,
  selected: PropTypes.object,
  handleSelect: PropTypes.func
}

TableControl.defaultProps = {
  initialSort: null,
  selected: null,
  handleSelect: () => {}
}

export default TableControl
