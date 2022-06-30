import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {flattenDeep, union} from 'lodash'

import {byProps, byText} from '@/lib/filters'

import Title from './title'
import TableControl from './table-control'
import Filters from './filters'

const getPropsToFilter = (list, filters) => {
  return Object.keys(filters).map(prop => {
    return {
      title: filters[prop],
      name: prop,
      values: union(flattenDeep(list.map(item => { // FlattenDeep deal with array
        return item[prop]
      })))
    }
  })
}

function TableList({title, subtitle, list, textFilter, filters, cols, checkIsSelected, handleSelect, handleLabel}) {
  const [text, setText] = useState('')
  const [propsFilter, setPropsFilter] = useState()
  const [selectedPropsFilter, setSelectedPropsFilter] = useState({})
  const [filteredList, setFilteredList] = useState([])

  const handlePropfilter = propFilter => {
    const propsFilter = {...selectedPropsFilter}

    const propValues = propsFilter[propFilter.name]

    if (propValues) {
      if (propValues.includes(propFilter.value)) {
        const index = propValues.indexOf(propFilter.value)
        propValues.splice(index, 1)
      } else {
        propValues.push(propFilter.value)
      }
    } else {
      propsFilter[propFilter.name] = [propFilter.value]
    }

    setSelectedPropsFilter(propsFilter)
  }

  useEffect(() => {
    if (filters) {
      const propsFilter = getPropsToFilter(list, filters)
      setPropsFilter(propsFilter)
    }
  }, [list, filters])

  useEffect(() => {
    const filteredList = list.filter(item => {
      return (
        byText(textFilter(item), text) &&
        byProps(item, selectedPropsFilter)
      )
    })

    setFilteredList(filteredList)
  }, [text, selectedPropsFilter, list, textFilter])

  useEffect(() => {
    setText('')
    setSelectedPropsFilter({})
  }, [list])

  return (
    <div>
      <Title title={title} subtitle={subtitle} />

      {(textFilter || filters) && (
        <Filters
          text={text}
          hasTextFilter={Boolean(textFilter)}
          propsToFilter={propsFilter}
          onChange={setText}
          selectedPropsFilter={selectedPropsFilter}
          onFilterProp={handlePropfilter}
        />
      )}

      {filteredList.length === 0 ? (
        <div className='no-result'>Aucun résultat</div>
      ) : (
        <TableControl
          list={filteredList}
          cols={cols}
          checkIsSelected={checkIsSelected}
          handleSelect={handleSelect}
          handleLabel={handleLabel}
        />
      )}

      <style jsx>{`
        .no-result {
          text-align: center;
          margin: 2em;
        }
      `}</style>
    </div>
  )
}

TableList.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  list: PropTypes.array.isRequired,
  textFilter: PropTypes.func,
  filters: PropTypes.object,
  cols: PropTypes.object.isRequired,
  handleLabel: PropTypes.func.isRequired,
  checkIsSelected: PropTypes.func,
  handleSelect: PropTypes.func
}

TableList.defaultProps = {
  subtitle: '',
  textFilter: null,
  filters: null,
  checkIsSelected: null,
  handleSelect: null
}

export default TableList
