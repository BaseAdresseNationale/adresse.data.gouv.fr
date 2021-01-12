import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Map, Folder} from 'react-feather'

import theme from '@/styles/theme'

import Mapbox from '@/components/mapbox'
import BanSearch from '@/components/ban-search'
import BanMap from '@/components/mapbox/ban-map'
import LayoutSelector from '@/components/base-adresse-nationale/layout-selector'
import Explorer from '@/components/base-adresse-nationale/explorer'

const defaultProps = {
  address: null,
  hash: null
}

const propTypes = {
  address: PropTypes.object,
  bbox: PropTypes.array.isRequired,
  viewHeight: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  hash: PropTypes.string
}

const parseHash = hash => {
  if (hash) {
    const [z, lat, lng] = hash.slice(1, hash.lenght).split('/')
    return {zoom: Number(z), center: [lng, lat]}
  }

  return {zoom: null, center: null}
}

export function Mobile({address, bbox, viewHeight, handleSelect, hash}) {
  const [selectedLayout, setSelectedLayout] = useState('map')
  const {zoom, center} = parseHash(hash)

  return (
    <div className='ban-container'>
      <BanSearch />

      <div className={`mobile-container ${selectedLayout === 'map' ? 'show' : 'hidden'}`}>
        <Mapbox defaultCenter={center} defaultZoom={zoom} bbox={bbox} hasSwitchStyle hasHash>
          {({...mapboxProps}) => (
            <BanMap address={address} {...mapboxProps} onSelect={handleSelect} />
          )}
        </Mapbox>
      </div>

      <div className={`mobile-container ${selectedLayout === 'explorer' ? 'show' : 'hidden'}`}>
        <div className='explorer'>
          <Explorer address={address} handleSelect={handleSelect} />
        </div>
      </div>

      <div className='layouts-selector'>
        <LayoutSelector
          name='Explorer'
          value='explorer'
          icon={Folder}
          isSelected={selectedLayout === 'explorer'}
          handleClick={setSelectedLayout}
        />
        <LayoutSelector
          name='Carte'
          value='map'
          icon={Map}
          isSelected={selectedLayout === 'map'}
          handleClick={setSelectedLayout}
        />
      </div>

      <style jsx>{`
        .ban-container {
          position: absolute;
          top: 77px;
          bottom: 0;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: ${viewHeight};
        }

        @media (max-width: 380px) {
          .ban-container {
            top: 67px;
          }
        }

        .mobile-container {
          width: 100%;
          height: calc(${viewHeight} + 79px);
        }

        .show {
          display: block;
        }

        .hidden {
          display: none;
        }

        .explorer {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding: 1em 0.5em;
          background-color: #fff;
        }

        .layouts-selector {
          z-index: 999;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 1em;
          background-color: #fff;
        }
        `}</style>
    </div>

  )
}

Mobile.defaultProps = defaultProps
Mobile.propTypes = propTypes

export function Desktop({address, bbox, handleSelect, hash}) {
  const {zoom, center} = parseHash(hash)

  return (
    <div className='ban-container'>
      <div className='sidebar'>
        <div className='search'>
          <BanSearch />
        </div>
        <Explorer address={address} handleSelect={handleSelect} />
        <div className='footer' />
      </div>

      <Mapbox defaultCenter={center} defaultZoom={zoom} bbox={bbox} hasSwitchStyle hasHash>
        {({...mapboxProps}) => (
          <BanMap address={address} {...mapboxProps} onSelect={handleSelect} />
        )}
      </Mapbox>

      <style jsx>{`
        .ban-container {
          display: flex;
          height: calc(100vh - 77px);
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          z-index: 1;
          min-width: 460px;
          box-shadow: 2px 0px 10px #0000008a;
          padding: 0 0.5em;
        }

        .search {
          padding: 0.5em;
          margin: 0 -0.5em;
          background-color: ${theme.primary};
        }

        .footer {
          margin: 0 -0.5em;
        }
        `}</style>
    </div>
  )
}

Desktop.defaultProps = defaultProps
Desktop.propTypes = propTypes
