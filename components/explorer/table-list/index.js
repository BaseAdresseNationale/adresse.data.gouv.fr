import React from 'react'
import PropTypes from 'prop-types'

import {byTags, byText} from '../../../lib/filters'
import {getTypeByPriority, unionTypes} from '../../../lib/types'

import Title from './title'
import TableControl from './table-control'
import Filters from './filters'

class TableList extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    genItems: PropTypes.func.isRequired,
    subtitle: PropTypes.string,
    initialSort: PropTypes.object,
    selected: PropTypes.object,
    handleSelect: PropTypes.func
  }

  static defaultProps = {
    subtitle: '',
    initialSort: null,
    selected: null,
    handleSelect: () => {}
  }

  constructor(props) {
    super(props)

    this.state = {
      text: '',
      selectedTags: [],
      getSources: sources => getTypeByPriority(unionTypes(sources)),
      getDestination: destination => getTypeByPriority(unionTypes(destination))
    }

    this.baseState = this.state
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState(this.baseState)
  }

  handleTextFilter = text => {
    this.setState({
      text
    })
  }

  handleTags = tag => {
    this.setState(state => {
      const selectedTags = [...state.selectedTags]

      if (selectedTags.includes(tag)) {
        const index = selectedTags.indexOf(tag)
        selectedTags.splice(index, 1)
      } else {
        selectedTags.push(tag)
      }

      return {selectedTags}
    })
  }

  filterList = () => {
    const {text, selectedTags} = this.state
    const list = [...this.props.list]

    return list.filter(item => {
      const {sources, destination, nomVoie, numero} = item
      let tags = sources

      if (destination) {
        tags = tags.concat(destination)
      }

      return (
        byTags(tags, selectedTags) && // Filter tags
        byText((nomVoie || numero), text) // Filter text
      )
    })
  }

  render() {
    const {title, subtitle} = this.props
    const {selected, headers, genItems, initialSort, handleSelect} = this.props
    const {text, selectedTags, getSources, getDestination} = this.state

    const filteredList = this.filterList()
    const availableSources = getSources(filteredList.map(item => item.sources))
    const availableDestination = getDestination(filteredList.map(item => item.destination))

    return (
      <div>
        <Title title={title} subtitle={subtitle} />

        <Filters
          text={text}
          onChange={this.handleTextFilter}
          sources={availableSources}
          destinations={availableDestination}
          selectedTags={selectedTags}
          onFilterTags={this.handleTags}
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
}

export default TableList
