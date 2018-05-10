import React from 'react'
import Router from 'next/router'
import debounce from 'debounce'
import FaSearch from 'react-icons/lib/fa/search'

import {_get} from '../../lib/fetch'

import Section from '../section'
import SearchInput from '../search-input'
import Notification from '../notification'
import renderAddok from '../search-input/render-addok'
import BetaRibbon from '../beta-ribbon'

class Explorer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      results: [],
      loading: false,
      error: null
    }

    this.getFeatureValue = this.getFeatureValue.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    this.handleSearch = debounce(this.handleSearch, 400)
  }

  handleSelect(feature) {
    const {citycode, id, housenumber, type} = feature.properties
    const streetCode = type === 'municipality' ? null : id.split('-')[1]
    this.setState({input: feature.name})
    let href = ''
    let as = ''

    if (type === 'municipality') {
      href = `/explore/commune?codeCommune=${citycode}`
      as = `/explore/commune/${citycode}`
    } else if (type === 'street') {
      href = `/commune/voie?codeVoie=${streetCode}`
      as = `/explore/commune/${citycode}/voie/${streetCode}`
    } else if (type === 'housenumber') {
      href = `/explore/commune/voie?codeCommune=${citycode}&codeVoie=${streetCode}&numero=${housenumber}`
      as = `/explore/commune/${citycode}/voie/${streetCode}/numero/${housenumber}`
    }

    Router.push(href, as)
  }

  handleInput(input) {
    this.setState(() => {
      if (input) {
        this.handleSearch(input)
      }

      return {
        input,
        results: [],
        loading: true,
        error: null
      }
    })
  }

  async handleSearch(input) {
    const url = 'https://sandbox.geo.api.gouv.fr/explore-addok/search?q=' + input

    try {
      const results = await _get(url)
      this.setState({
        results: results.features.splice(0, 5) || [],
        loading: false
      })
    } catch (err) {
      this.setState({
        results: [],
        loading: false,
        error: err
      })
    }
  }

  getFeatureValue(feature) {
    return feature.header ? feature.header : feature.properties.name
  }

  render() {
    const {input, results, loading, error} = this.state
    let orderResults = []

    orderResults = []
    results.map(feature => {
      if (!orderResults.find(item => item.header === feature.properties.type)) {
        orderResults.push({
          header: feature.properties.type
        })
      }
      return orderResults.push(feature)
    })

    return (
      <Section background='color'>
        <div className='beta'>
          <h2><FaSearch /> Rechercher une adresse</h2>
          <BetaRibbon />
        </div>

        <div className='input'>
          <SearchInput
            value={input}
            results={orderResults}
            loading={loading}
            placeholder='Recherche…'
            onSelect={this.handleSelect}
            onSearch={this.handleInput}
            renderItem={renderAddok}
            getItemValue={this.getFeatureValue} />
        </div>

        {error &&
          <div className='error'>
            <Notification message={error.message} type='error' />
          </div>
          }

        <style jsx>{`
            .error {
              margin: 1em 0;
            }

            .beta {
              display: flex;
              align-items: center;
            }

            .beta h2 {
              margin-right: 45px;
            }

            @media (max-width: 400px) {
              .input {
                margin: 0 -20px;
              }
            }
          `}</style>
      </Section>
    )
  }
}

export default Explorer
