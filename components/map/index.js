import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
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

    if (input) {
      setError(null)
      handleSearch()
    }
  }, [center, input])

  useEffect(() => {
    if (center && zoom >= 15) {
      if (zoom >= 15) {
        getNearestAddress()
      } else {
        setAddress(null)
      }
    }
  }, [zoom, center, getNearestAddress])

  useEffect(() => {
    if (defaultCenter && defaultZoom) {
      setCenter(defaultCenter)
      setZoom(defaultZoom)
    }
  }, [defaultCenter, defaultZoom])

  return (
    <div className='interactive-map'>
      <div className='input'>
        <SearchInput
          value={input}
          results={results}
          isLoading={loading}
          placeholder={placeholder}
          onSelect={handleSelect}
          onSearch={setInput}
          renderItem={renderAdresse}
          getItemValue={item => item.properties.context}
        />
      </div>

      <div className='map-container'>
        <Mapbox
          defaultZoom={defaultZoom}
          defaultCenter={defaultCenter}
          error={error}
          isLoading={loading}
          hasSwitchStyle
          hasHash
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
        .interactive-map {
          position: relative;
        }

        .input {
          z-index: 3;
          width: 40%;
          min-width: 260px;
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translate(-50%);
        }

        .map-container {
          width: 100%;
          position: relative;
          height: calc(100vh - 73px);
        }

        @media (max-width: 700px) {
          .input {
            min-width: 100%;
            top: 0;
            left: 0;
            transform: none;
          }

          .map-container {
            width: 100%;
            position: relative;
            height: calc(100vh - 134px);
            top: 56px;
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
