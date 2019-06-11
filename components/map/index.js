import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'
import {throttle, debounce} from 'lodash'

import {search, reverse} from '../../lib/api-adresse'

import Notification from '../notification'
import renderAdresse from '../search-input/render-adresse'
import SearchInput from '../search-input'
import Mapbox from '../mapbox'

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

const DEFAULT_COORDS = [1.7191, 46.7111]
const DEFAULT_ZOOM = 5

class Map extends React.Component {
  static propTypes = {
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired
    }).isRequired
  }

  state = {
    input: '',
    results: [],
    address: null,
    loading: false,
    center: DEFAULT_COORDS,
    zoom: 5,
    addressLoading: false,
    error: null
  }

  constructor(props) {
    super(props)

    this.handleSearchThrottled = throttle(this.handleSearch, 200)
    this.handleSearchDebounced = debounce(this.handleSearch, 200)
  }

  async componentDidMount() {
    const {router} = this.props
    const {lng, lat, z} = router.query

    if (lng && lat) {
      await this.getNearestAddress([lng, lat])
      this.setState({
        center: [Number(lng), Number(lat)],
        zoom: Number(z)
      })
    }
  }

  replaceUrl = (coordinates, zoom) => {
    const {router} = this.props
    const lng = Number.parseFloat(coordinates[0]).toPrecision(6)
    const lat = Number.parseFloat(coordinates[1]).toPrecision(6)

    this.setState({
      zoom,
      center: [coordinates[0], coordinates[1]]
    })

    router.replace(`/map?lng=${lng}&lat=${lat}&z=${Math.round(zoom)}`)
  }

  handleSelect = address => {
    const coords = address.geometry.coordinates
    const zoom = zoomLevel[address.properties.type] || DEFAULT_ZOOM

    this.replaceUrl(coords, zoom)

    this.setState({
      address,
      input: address.properties.label
    })
  }

  handleInput = input => {
    this.setState({input, results: [], loading: true, error: null})

    if (input) {
      if (input.length < 5) {
        this.handleSearchThrottled(input)
      } else {
        this.handleSearchDebounced(input)
      }
    }
  }

  handleSearch = async input => {
    const {lng, lat} = this.props.router.query
    const types = [
      'locality',
      'street',
      'housenumber'
    ]
    let results = []
    let error

    try {
      const args = {q: input, lng, lat}
      const req = search(args)
      this.currentRequest = req
      const response = await search(args)
      if (this.currentRequest === req) {
        results = response.features.filter(address =>
          types.includes(address.properties.type) || [])
      }
    } catch (err) {
      error = err
    }

    this.setState({
      results,
      error,
      loading: false
    })
  }

  mapUpdate = async (coordinates, zoom, getAddress = true) => {
    this.replaceUrl(coordinates, zoom)

    if (getAddress) {
      await this.getNearestAddress(coordinates)
    }
  }

  getNearestAddress = async coordinates => {
    let address = null
    let error

    this.setState({addressLoading: true})

    try {
      const results = await reverse(coordinates)
      address = results.features.length > 0 ? results.features[0] : null
    } catch (err) {
      error = err
    }

    this.setState({
      address,
      input: address ? address.properties.label : '',
      addressLoading: false,
      error
    })
  }

  render() {
    const {results, input, address, center, zoom, error, loading, addressLoading} = this.state

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
            getItemValue={item => item.properties.context}
            fullscreen />
        </div>

        {error &&
          <Notification
            style={errorStyle}
            message={error.message}
            type='error' />
        }

        <Mapbox fullscreen>
          {(map, marker) => (
            <AddressMap
              map={map}
              marker={marker}
              data={address}
              center={center}
              zoom={zoom}
              loading={addressLoading}
              mapUpdate={this.mapUpdate}
              getNearestAddress={this.getNearestAddress}
            />
          )}
        </Mapbox>

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
              position: absolute;
              min-width: 100%;
              top: 73px;
              left: 0;
              transform: none;
            }
          }

          @media (max-width: 380px) {
            .input {
              top: 63px;
            }
          }

        `}</style>
      </div >
    )
  }
}

export default (withRouter(Map))
