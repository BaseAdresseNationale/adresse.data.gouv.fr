import React from 'react'
import PropTypes from 'prop-types'
import {throttle, debounce, uniqueId} from 'lodash'

import {getCommunes, isCodeDepNaive} from '../../../lib/api-geo'

import SearchInput from '../../search-input'
import RenderCommune from '../../search-input/render-commune'
import Notification from '../../notification'

class SearchCommunes extends React.Component {
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
    const reqId = uniqueId('req_')
    this.waitingFor = reqId

    try {
      const codeDep = input.split(' ').find(isCodeDepNaive)
      const response = await getCommunes({
        q: input,
        departement: codeDep,
        fields: ['departement', 'contour'],
        limit: 8
      })
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

        {error && (
          <Notification
            style={{marginTop: '1em'}}
            type='error'
            message={error.message}
          />
        )}

      </div>
    )
  }
}

export default SearchCommunes
