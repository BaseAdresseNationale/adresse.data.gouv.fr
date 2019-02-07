import React from 'react'
import PropTypes from 'prop-types'
import {throttle, debounce, uniqueId} from 'lodash'

import {_get} from '../../../../lib/fetch'

import RenderCommune from '../../../search-input/render-commune'

import SearchInput from '../../../search-input'
import Notification from '../../../notification'

function isCodeDepNaive(token) {
  if (['2A', '2B'].includes(token)) {
    return true
  }

  return token.match(/^\d{2,3}$/)
}

class SearchCommune extends React.Component {
  static propTypes = {
    handleSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.instanceOf(Error)
  }

  static defaultProps = {
    placeholder: null,
    error: null
  }

  state = {
    input: '',
    results: [],
    loading: false,
    error: false
  }

  handleSearchThrottled = throttle(this.handleSearch, 200)

  handleSearchDebounced = debounce(this.handleSearch, 200)

  handleChange = input => {
    this.setState(() => {
      if (input) {
        if (input.length < 5) {
          this.handleSearchThrottled(input)
        } else {
          this.handleSearchDebounced(input)
        }
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
    const codeDep = input.split(' ').find(isCodeDepNaive)
    const reqId = uniqueId('req_')
    this.waitingFor = reqId
    const codeDepFilter = codeDep ? `&codeDepartement=${codeDep}` : ''
    const q = codeDep ? input.split(' ').filter(t => !isCodeDepNaive(t)).join(' ') : input
    const url = `https://geo.api.gouv.fr/communes?nom=${q}${codeDepFilter}&fields=departement,contour&limit=8`

    try {
      const response = await _get(url)
      if (reqId === this.waitingFor) {
        this.setState(() => {
          return {
            results: response,
            error: null,
            loading: false
          }
        })
      }
    } catch (err) {
      if (reqId === this.waitingFor) {
        this.setState(() => {
          return {
            results: [],
            error: new Error(err),
            loading: false
          }
        })
      }
    }
  }

  render() {
    const {input, results, loading} = this.state
    const {placeholder} = this.props
    const error = this.props.error || this.state.error

    return (
      <div className='search-input'>
        <SearchInput
          value={input}
          results={results}
          placeholder={placeholder || 'Rechercher une commune'}
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
