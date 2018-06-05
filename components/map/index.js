import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'
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

const zoomLevel = {
  street: 16,
  housenumber: 18,
  locality: 15
}

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      results: [],
      address: null,
      loading: false,
      addressLoading: false,
      error: null
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.getNearestAddress = this.getNearestAddress.bind(this)

    this.handleSearch = debounce(this.handleSearch, 200)
  }

  componentDidMount() {
    const {router} = this.props
    const {lng, lat} = router.query

    if (lng && lat) {
      this.getNearestAddress(lng, lat)
    }
  }

  handleSelect(address) {
    const {router} = this.props
    const coords = address.geometry.coordinates
    const zoom = zoomLevel[address.properties.type] || 18

    router.push(`/map?lng=${coords[0]}&lat=${coords[1]}&z=${zoom}`)

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

  async getNearestAddress(lng, lat) {
    const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}`

    this.setState({addressLoading: true})
    try {
      const results = await _get(url)
      this.setState({
        address: results.features.length > 0 ? results.features[0] : null,
        addressLoading: false
      })
    } catch (err) {
      this.setState({
        address: null,
        addressLoading: false,
        error: err
      })
    }
  }

  async handleSearch(input) {
    const {lng, lat} = this.props.router.query
    let url = 'https://api-adresse.data.gouv.fr/search/?q=' + input
    const types = [
      'locality',
      'street',
      'housenumber'
    ]

    if (lng && lat) {
      url += `&lon=${lng}&lat=${lat}`
    }

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
    const {lng, lat, z} = this.props.router.query
    const {results, input, address, error, loading, addressLoading} = this.state
    const center = lng && lat ? [lng, lat] : [1.7191, 46.7111]

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

        <AddressMap
          address={address}
          center={center}
          zoom={Number(z) || 5}
          loading={addressLoading}
          getNearestAddress={this.getNearestAddress} />

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

Map.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }).isRequired
}

export default (withRouter(Map))
