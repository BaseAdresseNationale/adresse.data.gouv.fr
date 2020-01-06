import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import {byTags, byText} from '../../../../../../lib/filters'

import Title from './title'
import TableControl from './table-control'
import Filters from './filters'

const TableList = ({title, list, headers, genItems, subtitle, initialSort, selected, handleSelect}) => {
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [filteredList, setFilteredList] = useState([])

  const handleTextFilter = text => {
    setText(text)
  }

  const handleTags = useCallback(tag => {
    const tags = [...selectedTags]

    if (tags.includes(tag)) {
      const index = tags.indexOf(tag)
      tags.splice(index, 1)
    } else {
      tags.push(tag)
    }

    setSelectedTags(tags)
  }, [selectedTags])

  const filterList = useCallback(() => {
    return list.filter(item => {
      const {sources, nomVoie, numero} = item

      return (
        byTags(sources, selectedTags) && // Filter tags
        byText((nomVoie || numero), text) // Filter text
      )
    })
  }, [list, selectedTags, text])

  useEffect(() => {
    const filteredList = filterList()
    setFilteredList(filteredList)
  }, [filterList, list, selectedTags])

  return (
    <div>
      <Title title={title} subtitle={subtitle} />

      <Filters
        text={text}
        onChange={handleTextFilter}
        selectedTags={selectedTags}
        onFilterTags={handleTags}
      />

      {filteredList.length === 0 ? (
        <div className='no-result'>Aucun résultat</div>
      ) : (
        <TableControl
          list={filteredList}
          selected={selected}
          headers={headers}
          genItems={genItems}
          initialSort={initialSort}
          handleSelect={handleSelect}
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
  list: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  genItems: PropTypes.func.isRequired,
  subtitle: PropTypes.string,
  initialSort: PropTypes.object,
  selected: PropTypes.object,
  handleSelect: PropTypes.func
}

TableList.defaultProps = {
  subtitle: '',
  initialSort: null,
  selected: null,
  handleSelect: () => { }
}

export default TableList
