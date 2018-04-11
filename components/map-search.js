import React from 'react'
import debounce from 'debounce'

import {_get} from '../lib/fetch'

import Notification from './notification'
import renderAdresse from './search-input/render-adresse'
import AddressMap from './mapbox/address-map'
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
      viewport: null,
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
    const viewport = {
      center: item.geometry.coordinates,
      zoom: 13
    }
    this.setState({viewport, input: item.properties.label})
  }

  handleInput(input) {
    this.setState({input})
    this.update()
  }

  async handleSearch() {
    const {input} = this.state
    const url = 'https://api-adresse.data.gouv.fr/search/?q=' + input

    try {
      const results = await _get(url)
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
    const {results, input, viewport, error, loading} = this.state

    return (
      <div>
        <SearchInput
          value={input}
          results={results}
          loading={loading}
          placeholder='Ex. 6 quai de la tourelle cergy…'
          onSelect={this.handleSelect}
          onSearch={this.handleInput}
          renderItem={renderAdresse}
          getItemValue={item => item.properties.context}
          wrapperStyle={wrapperStyle} />

        {error &&
          <div className='error'>
            <Notification message={error.message} type='error' />
          </div>
          }

        <AddressMap {...viewport} />
      </div>
    )
  }
}

export default MapSearch
