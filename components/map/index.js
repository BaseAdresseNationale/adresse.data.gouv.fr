import React from 'react'
import {debounce} from 'lodash'

import {_get} from '../../lib/fetch'

import Notification from '../notification'
import renderAdresse from '../search-input/render-adresse'
import SearchInput from '../search-input'

import AddressMap from './address-map'

const errorStyle = {
  width: '40%',
  minWidth: '260px',
  position: 'absolute',
  top: '206px',
  left: '50%',
  margin: '1em 0',
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
      this.handleSearch(input)
    }
  }

  async handleSearch(input) {
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
        <div className='input'>
          <SearchInput
            value={input}
            results={results}
            loading={loading}
            placeholder='Ex. 6 quai de la tourelle cergy…'
            onSelect={this.handleSelect}
            onSearch={this.handleInput}
            renderItem={renderAdresse}
            getItemValue={item => item.properties.context} />
        </div>

        {error &&
          <Notification
            style={errorStyle}
            message={error.message}
            type='error' />
        }

        <AddressMap address={address} />

        <style jsx>{`
          .input {
            z-index: 10;
            width: 40%;
            min-width: 260px;
            position: absolute;
            top: 90px;
            left: 50%;
            transform: translate(-50%);
          }

          @media (max-width: 700px) {
            .input {
              min-width: 100%;
              top: 125px;
              left: 50%;
              transform: translate(-50%);
            }
          }

          @media (max-width: 480px) {
            .input {
              top: 115px;
            }
          }

          @media (max-width: 380px) {
            .input {
              top: 140px;
            }
          }
        `}</style>
      </div >
    )
  }
}

export default MapSearch
