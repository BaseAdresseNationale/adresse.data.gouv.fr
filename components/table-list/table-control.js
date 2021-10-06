import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {sortBy, find} from 'lodash'

import Table from './table'

import Head from './table/head'
import Body from './table/body'

const LIST_LIMIT = 10

function TableControl({list, cols, checkIsSelected, handleSelect}) {
  const [orderedList, setOrderedList] = useState(list)
  const [order, setOrder] = useState('desc')
  const [sortedColumn, setSortedColumn] = useState()
  const [isWrap, setWrap] = useState(list.length > LIST_LIMIT)

  const sort = useCallback(() => {
    const {getValue} = find(cols, ({title}) => title === sortedColumn)
    let ordered = sortBy(list, getValue)

    if (order === 'asc') {
      ordered = ordered.reverse()
    }

    return ordered
  }, [cols, list, order, sortedColumn])

  const selectColumn = useCallback(columTitle => {
    if (columTitle === sortedColumn) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortedColumn(columTitle)
    }
  }, [order, sortedColumn])

  const handleWrap = useCallback(() => {
    setWrap(!isWrap)
  }, [isWrap])

  useEffect(() => {
    if (sortedColumn) {
      const orderedList = sort()
      setOrderedList(orderedList)
    }
  }, [list, sort, sortedColumn])

  useEffect(() => {
    const {title} = cols[Object.keys(cols)[0]]
    setSortedColumn(title)
    // Initial sort
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Table isWrap={isWrap} hasDisabledWrap={list.length < LIST_LIMIT} onWrap={handleWrap}>
      <>
        <Head headers={cols} order={order} actived={sortedColumn} selectColumn={selectColumn} />
        <Body
          list={isWrap ? orderedList.slice(0, LIST_LIMIT) : orderedList}
          cols={cols}
          checkIsSelected={checkIsSelected}
          handleSelect={handleSelect}
        />
      </>
    </Table>
  )
}

TableControl.propTypes = {
  list: PropTypes.array.isRequired,
  cols: PropTypes.object.isRequired,
  checkIsSelected: PropTypes.func,
  handleSelect: PropTypes.func
}

TableControl.defaultProps = {
  checkIsSelected: null,
  handleSelect: () => {}
}

export default TableControl
