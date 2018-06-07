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

const DEFAULT_COORDS = [1.7191, 46.7111]
const DEFAULT_ZOOM = 5

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      results: [],
      address: null,
      loading: false,
      center: DEFAULT_COORDS,
      zoom: 5,
      addressLoading: false,
      error: null
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.getNearestAddress = this.getNearestAddress.bind(this)
    this.mapUpdate = this.mapUpdate.bind(this)
    this.replaceUrl = this.replaceUrl.bind(this)

    this.handleSearch = debounce(this.handleSearch, 200)
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

  replaceUrl(coordinates, zoom) {
    const {router} = this.props
    const lng = Number.parseFloat(coordinates[0]).toPrecision(6)
    const lat = Number.parseFloat(coordinates[1]).toPrecision(6)

    this.setState({
      zoom,
      center: [coordinates[0], coordinates[1]]
    })

    router.replace(`/map?lng=${lng}&lat=${lat}&z=${Math.round(zoom)}`)
  }

  handleSelect(address) {
    const coords = address.geometry.coordinates
    const zoom = zoomLevel[address.properties.type] || DEFAULT_ZOOM

    this.replaceUrl(coords, zoom)

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

  async mapUpdate(coordinates, zoom, getAddress = true) {
    this.replaceUrl(coordinates, zoom)

    if (getAddress) {
      await this.getNearestAddress(coordinates)
    }
  }

  async getNearestAddress(coordinates) {
    const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${coordinates[0]}&lat=${coordinates[1]}`

    this.setState({addressLoading: true})

    try {
      const results = await _get(url)
      const address = results.features.length > 0 ? results.features[0] : null
      this.setState({
        address,
        input: address ? address.properties.label : '',
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
          zoom={zoom}
          loading={addressLoading}
          mapUpdate={this.mapUpdate}
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
