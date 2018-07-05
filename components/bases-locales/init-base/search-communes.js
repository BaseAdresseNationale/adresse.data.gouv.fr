import React from 'react'
import PropTypes from 'prop-types'
import {throttle} from 'lodash'

import {_get} from '../../../lib/fetch'

import RenderCommune from '../../search-input/render-commune'

import SearchInput from '../../search-input'
import Notification from '../../notification'

class SearchCommune extends React.Component {
  static propTypes = {
    handleSelect: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error)
  }

  static defaultProps = {
    error: null
  }

  state = {
    input: '',
    results: [],
    loading: false,
    error: false
  }

  handleSearchThrottled = throttle(this.handleSearch, 200)

  handleChange = input => {
    this.setState(() => {
      if (input) {
        this.handleSearchThrottled(input)
      }

      return {input, loading: true, error: null}
    })
  }

  handleSelect = commune => {
    const {handleSelect} = this.props

    this.setState({input: ''})
    handleSelect(commune)
  }

  async handleSearch(input) {
    const url = `https://geo.api.gouv.fr/communes?nom=${input}&fields=departement&limit=5`
    let results = []
    let error

    try {
      const req = _get(url)
      this.currentRequest = req
      const response = await _get(url)
      if (this.currentRequest === req) {
        results = response
      }
    } catch (err) {
      error = err
    }

    this.setState(state => {
      return {
        results: results.length > 0 ? results : state.results,
        error,
        loading: false
      }
    })
  }

  render() {
    const {input, results, loading} = this.state
    const error = this.props.error || this.state.error

    return (
      <div className='search-input'>
        <SearchInput
          value={input}
          results={results}
          placeholder='Rechercher une commune'
          loading={loading}
          onSearch={this.handleChange}
          onSelect={this.handleSelect}
          renderItem={RenderCommune}
          getItemValue={commune => commune.nom} />

        {error && <Notification style={{marginTop: '1em'}} type='error' message={error.message} />}

      </div>
    )
  }
}

export default SearchCommune
