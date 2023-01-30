import {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {Map, Folder} from 'react-feather'

import theme from '@/styles/theme'

import MapLibre from '@/components/maplibre'
import BanSearch from '@/components/ban-search'
import BanMap from '@/components/maplibre/ban-map'
import ButtonLink from '@/components/button-link'
import LayoutSelector from '@/components/base-adresse-nationale/layout-selector'
import Explorer from '@/components/base-adresse-nationale/explorer'

import DeviceContext from '@/contexts/device'

const styleParam = {
  mobile: {
    headerHeight: 164.5,
  },
  tablet: {
    headerHeight: 168.5,
  },
  desktop: {
    headerHeight: 172.5,
  },
}

const defaultProps = {
  address: null,
  hash: null
}

const propTypes = {
  address: PropTypes.object,
  bbox: PropTypes.array,
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

export function Mobile({address, bbox, handleSelect, hash}) {
  const {viewHeight} = useContext(DeviceContext)
  const [selectedLayout, setSelectedLayout] = useState('map')
  const {zoom, center} = parseHash(hash)

  return (
    <div className='ban-container'>
      <BanSearch />

      <div className={`mobile-container ${selectedLayout === 'map' ? 'show' : 'hidden'}`}>
        <MapLibre defaultCenter={center} defaultZoom={zoom} bbox={bbox} hasSwitchStyle hasHash>
          {({...maplibreProps}) => (
            <BanMap address={address} {...maplibreProps} onSelect={handleSelect} isMobile />
          )}
        </MapLibre>
      </div>

      <div className={`mobile-container ${selectedLayout === 'explorer' ? 'show' : 'hidden'}`}>
        <div className='explorer'>
          <Explorer address={address} handleSelect={handleSelect} isMobile />
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
          position: relative;
          bottom: 0;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .mobile-container {
          width: 100%;
          height: calc(${viewHeight} - ${styleParam.mobile.headerHeight}px - 489px); // Max heigth available - sum of header, searchbar and layout selector heights
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
          padding: 0 0.5em;
          background-color: #fff;
        }

        .layouts-selector {
          z-index: 997;
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
        <div className='footer'>
          <p>Pour mettre à jour vos adresses, cliquez ici : </p>
          <ButtonLink href='https://adresse.data.gouv.fr/contribuer' isOutlined color='white' size='small'>
            Contribuer à la Base Adresse Nationale
          </ButtonLink>
        </div>
      </div>

      <MapLibre defaultCenter={center} defaultZoom={zoom} bbox={bbox} hasSwitchStyle hasHash>
        {({...maplibreProps}) => (
          <BanMap address={address} {...maplibreProps} onSelect={handleSelect} />
        )}
      </MapLibre>

      <style jsx>{`
        .ban-container {
          display: flex;
          height: calc(100vh - ${styleParam.mobile.headerHeight}px);
        }
        @media (min-width: ${theme.breakPoints.tablet}) {
          .ban-container {
            height: calc(100vh - ${styleParam.tablet.headerHeight}px);
          }
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .ban-container {
            height: calc(100vh - ${styleParam.desktop.headerHeight}px);
          }
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
          padding: .5em;
          text-align: center;
        }

        .footer p {
          font-size: .8em;
        }
        `}</style>
    </div>
  )
}

Desktop.defaultProps = defaultProps
Desktop.propTypes = propTypes
