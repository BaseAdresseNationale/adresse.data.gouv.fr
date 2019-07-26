import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {debounce} from 'lodash'

import {search, reverse} from '../../lib/api-adresse'

import renderAdresse from '../search-input/render-adresse'
import SearchInput from '../search-input'
import Mapbox from '../mapbox'

import {useInput} from '../../hooks/input'

import AddressMap from './address-map'

const zoomLevel = {
  street: 16,
  housenumber: 18,
  locality: 15
}
let currentRequest = null

const Map = ({defaultCenter, defaultZoom}) => {
  const [input, setInput] = useInput('')
  const [placeholder, setPlaceholder] = useInput('')
  const [results, setResults] = useState([])
  const [address, setAddress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [center, setCenter] = useState(defaultCenter)
  const [zoom, setZoom] = useState(defaultZoom)
  const [error, setError] = useState(null)

  const handleSelect = address => {
    const input = address.properties.label
    const coords = address.geometry.coordinates
    const zoom = zoomLevel[address.properties.type]

    setInput(input)
    setCenter(coords)
    setZoom(zoom)
    setAddress(address)
  }

  const handleSearch = debounce(async () => {
    const types = [
      'locality',
      'street',
      'housenumber'
    ]

    try {
      const args = {q: input}

      if (center) {
        const [lng, lat] = center
        args.lng = lng
        args.lat = lat
      }

      const req = search(args)

      currentRequest = req

      const response = await search(args)
      if (currentRequest === req) {
        const results = response.features.filter(address =>
          types.includes(address.properties.type) || []
        )
        setResults(results)
      }
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }, [input, center], 400)

  const getNearestAddress = useCallback(async () => {
    setLoading(true)

    try {
      const results = await reverse(center)
      const address = results.features.length > 0 ? results.features[0] : null
      setAddress(address)
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }, [center])

  useEffect(() => {
    if (address) {
      setPlaceholder(address.properties.label)
      setInput('')
    } else {
      setPlaceholder('Ex. 6 quai de la tourelle cergy…')
    }
  }, [address, setInput, setPlaceholder])

  useEffect(() => {
    if (input && input.length > 0) {
      setError(null)
      handleSearch()
    }
  }, [handleSearch, input])

  useEffect(() => {
    if (center && zoom) {
      const [lng, lat] = center
      Router.replace(`/map?lng=${lng}&lat=${lat}&z=${Math.round(zoom)}`)
      if (zoom >= 15) {
        getNearestAddress()
      } else {
        setAddress(null)
      }
    }
  }, [zoom, center, getNearestAddress])

  return (
    <div>
      <div className='input'>
        <SearchInput
          value={input}
          results={results}
          loading={loading}
          placeholder={placeholder}
          onSelect={handleSelect}
          onSearch={setInput}
          renderItem={renderAdresse}
          getItemValue={item => item.properties.context}
          fullscreen />
      </div>

      <div className='map-container'>
        <Mapbox
          defaultZoom={defaultZoom}
          defaultCenter={defaultCenter}
          error={error}
          loading={loading}
          switchStyle
        >
          {({...mapboxProps}) => (
            <AddressMap
              {...mapboxProps}
              data={address}
              handleDrag={setCenter}
              handleZoom={setZoom}
              getNearestAddress={getNearestAddress}
            />
          )}
        </Mapbox>
      </div>

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

        .map-container {
          width: 100%;
          height: calc(100vh - 73px);
        }

        @media (max-width: 380px) {
          .map-container {
            height: calc(100vh - 63px);
          }
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

Map.defaultProps = {
  defaultCenter: null,
  defaultZoom: null
}

Map.propTypes = {
  defaultCenter: PropTypes.array,
  defaultZoom: PropTypes.number
}

export default Map
