import React from 'react'
import debounce from 'debounce'

import api from '../lib/api'

import Notification from './notification'
import renderAdresse from './search-input/render-adresse'
import LeafletMap from './leaflet-map'
import SearchInput from './search-input'

const wrapperStyle = {
  width: '30%',
  position: 'absolute',
  top: '150px',
  left: '50%',
  transform: 'translate(-50%)',
  zIndex: 1
}

class MapSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      results: [],
      selected: null,
      loading: false,
      error: null
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    this.handleSearch = debounce(this.handleSearch, 200)
  }

  update() {
    this.setState({results: [], loading: true, error: null})
    this.handleSearch()
  }

  handleSelect(item) {
    this.setState({selected: item, input: item.properties.label})
  }

  handleInput(input) {
    this.setState({input})
    this.update()
  }

  async handleSearch() {
    const {input} = this.state
    const url = 'https://api-adresse.data.gouv.fr/search/?q='

    try {
      const results = await api(url, input)
      this.setState({
        results: results.features || []
      })
    } catch (err) {
      this.setState({
        results: [],
        error: err
      })
    }

    this.setState({loading: false})
  }

  render() {
    const {results, input, selected, error, loading} = this.state

    return (
      <div>
        <SearchInput
          value={input}
          results={results}
          loading={loading}
          placeholder='Ex. 6 quai de la tourelle cergy…'
          handleSelect={this.handleSelect}
          search={this.handleInput}
          renderItem={renderAdresse}
          getItemValue={item => item.properties.context}
          wrapperStyle={wrapperStyle} />

        {error &&
          <div className='error'>
            <Notification message={error.message} type='error' />
          </div>
          }

        <LeafletMap position={selected ? selected.geometry.coordinates.reverse() : undefined} fullscreen />
      </div>
    )
  }
}

export default MapSearch
