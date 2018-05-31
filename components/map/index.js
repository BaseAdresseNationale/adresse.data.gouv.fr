import React from 'react'
import {debounce} from 'lodash'

import {_get} from '../../lib/fetch'

import Notification from '../notification'
import renderAdresse from '../search-input/render-adresse'
import SearchInput from '../search-input'

import AddressMap from './address-map'

const wrapperStyle = {
  width: '40%',
  minWidth: '260px',
  position: 'absolute',
  top: '150px',
  left: '50%',
  transform: 'translate(-50%)',
  zIndex: 10
}

const errorStyle = {
  width: '40%',
  minWidth: '260px',
  position: 'absolute',
  top: '206px',
  left: '50%',
  transform: 'translate(-50%)',
  zIndex: 10
}

class MapSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      results: [],
      address: null,
      loading: false,
      error: null
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    this.handleSearch = debounce(this.handleSearch, 200)
  }

  handleSelect(address) {
    this.setState({
      address,
      input: address.properties.label
    })
  }

  handleInput(input) {
    this.setState({input, results: [], loading: true, error: null})

    if (input) {
      this.handleSearch()
    }
  }

  async handleSearch() {
    const {input} = this.state
    const url = 'https://api-adresse.data.gouv.fr/search/?q=' + input
    const types = [
      'locality',
      'street',
      'housenumber'
    ]

    try {
      const results = await _get(url)
      this.setState({
        results: results.features.filter(address =>
          types.includes(address.properties.type)) || []
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
    const {results, input, address, error, loading} = this.state

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
          <Notification
            style={errorStyle}
            message={error.message}
            type='error' />
        }

        <AddressMap address={address} />
      </div >
    )
  }
}

export default MapSearch
