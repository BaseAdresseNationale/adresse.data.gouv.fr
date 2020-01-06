import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'

import Table from './table'

import Head from './table/head'
import Body from './table/body'

const LIST_LIMIT = 10

const TableControl = ({list, headers, genItems, initialSort, selected, handleSelect}) => {
  const [order, setOrder] = useState('desc')
  const [actived, setActived] = useState(initialSort ? initialSort.title : null)
  const [sortedList, setSortedList] = useState(list)
  const [displayedList, setDisplayedList] = useState(sortedList)
  const [isWrap, setWrap] = useState(list.length > LIST_LIMIT)

  const sort = useCallback((func, header) => {
    let sorted = sortBy(list, func)

    if (order === 'asc') {
      sorted = sorted.reverse()
    }

    setSortedList(sorted)
    setOrder(order === 'asc' ? 'desc' : 'asc')
    setActived(header)
  }, [list, order])

  const handleWrap = useCallback(() => {
    setWrap(!isWrap)
  }, [isWrap])

  useEffect(() => {
    if (sortedList) {
      setDisplayedList(sortedList)
    }
  }, [sortedList])

  useEffect(() => {
    setDisplayedList(isWrap ? [...sortedList].slice(0, LIST_LIMIT) : sortedList)
  }, [isWrap, sortedList])

  useEffect(() => {
    if (list) {
      setSortedList(initialSort ?
        sortBy(list, initialSort.func) :
        list
      )
    }
  }, [initialSort, list])

  return (
    <Table isWrap={isWrap} disabledWrap={list.length < LIST_LIMIT} onWrap={handleWrap}>
      <>
        <Head headers={headers} order={order} actived={actived} sort={sort} />
        <Body
          items={genItems(displayedList)}
          wrapped={isWrap}
          selected={selected}
          handleSelect={handleSelect} />
      </>
    </Table>
  )
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
