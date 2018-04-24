import React from 'react'
import PropTypes from 'prop-types'
import {filter, includes, remove, union, difference} from 'lodash'

import Title from './title'
import TableControl from './table-control'
import Filters from './filters'

class TableList extends React.Component {
  constructor(props) {
    super(props)
    const sources = props.list.map(item => item.sources)
    const destinations = props.list.map(item => item.destination)

    this.state = {
      text: '',
      onlyActive: true,
      selectedTags: [],
      availableSources: union(...sources),
      availableDestinations: union(...destinations)
    }

    this.handleTextFilter = this.handleTextFilter.bind(this)
    this.handleTags = this.handleTags.bind(this)
    this.handleActive = this.handleActive.bind(this)
  }

  componentWillReceiveProps() {
    const {list} = this.props
    const sources = list.map(item => item.sources)
    const destinations = list.map(item => item.destination)

    this.setState(() => ({
      text: '',
      onlyActive: true,
      selectedTags: [],
      availableSources: union(...sources),
      availableDestinations: union(...destinations)
    }))
  }

  handleTextFilter(text) {
    this.setState({
      text
    })
  }

  handleTags(tag) {
    const selectedTags = [...this.state.selectedTags]

    if (includes(selectedTags, tag)) {
      remove(selectedTags, item => item === tag)
    } else {
      selectedTags.push(tag)
    }

    this.setState({
      selectedTags
    })
  }

  handleActive() {
    this.setState(state => {
      const onlyActive = !state.onlyActive
      return {
        onlyActive
      }
    })
  }

  filterList() {
    const {text, onlyActive, selectedTags} = this.state
    const list = {...this.props.list}

    return filter(list, item => {
      const tags = union(item.sources, item.destination)
      return difference(selectedTags, tags).length === 0 && // Filter tags
              item.active === onlyActive && // Filter active
              includes((item.nomVoie || item.numero).toUpperCase(), text.toUpperCase()) // Filter text
    })
  }

  render() {
    const {title, subtitle} = this.props
    const {selected, headers, genItems, initialSort, handleSelect} = this.props
    const {text, selectedTags, onlyActive, availableSources, availableDestinations} = this.state
    const filteredList = this.filterList()

    return (
      <div>
        <Title title={title} subtitle={subtitle} />

        <Filters
          text={text}
          onChange={this.handleTextFilter}
          sources={availableSources}
          destinations={availableDestinations}
          selectedTags={selectedTags}
          onlyActive={onlyActive}
          onFilterTags={this.handleTags}
          onSwitch={this.handleActive} />

        {filteredList.length === 0 ?
          <div className='no-result'>Aucun résultat</div> :
          <TableControl
            list={filteredList}
            selected={selected}
            headers={headers}
            genItems={genItems}
            initialSort={initialSort}
            handleSelect={handleSelect} />
        }

        <style jsx>{`
            .no-result {
              text-align: center;
              margin: 2em;
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
  initialSort: PropTypes.object,
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
