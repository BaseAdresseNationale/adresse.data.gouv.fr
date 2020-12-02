import React, {useState} from 'react'
import {Map, Folder} from 'react-feather'

import theme from '@/styles/theme'

import Mapbox from '@/components/mapbox'
import ExploreSearch from '@/components/explorer/explore-search'
import AddressesMap from '@/components/mapbox/addresses-map'
import Explorer from '@/components/base-adresse-nationale/explorer'
import LayoutSelector from '@/components/base-adresse-nationale/layout-selector'

export function Mobile() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedLayout, setSelectedLayout] = useState('explorer')

  return (
    <div className='ban-container'>
      <ExploreSearch />

      {selectedLayout === 'map' ? (
        <>
          <Mapbox switchStyle>
            {({...mapboxProps}) => (
              <AddressesMap
                {...mapboxProps}
              />
            )}
          </Mapbox>
          {showOverlay && (
            <div className='overlay' />
          )}
        </>
      ) : (
        <Explorer />
      )}

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
          display: flex;
          flex-direction: column;
          height: calc(100vh - 73px);
        }

        .overlay {
          height: 60%;
        }

        .layouts-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 1em;
        }
        `}</style>
    </div>

  )
}

export function Desktop() {
  return (
    <div className='ban-container'>

      <div className='sidebar'>
        <div className='search'>
          <ExploreSearch />
        </div>
        <Explorer />
      </div>

      <Mapbox switchStyle>
        {({...mapboxProps}) => (
          <AddressesMap
            {...mapboxProps}
          />
        )}
      </Mapbox>

      <style jsx>{`
        .ban-container {
          position: relative;
          display: flex;
          height: calc(100vh - 73px);
        }

        .sidebar {
          z-index: 1;
          min-width: 400px;
          box-shadow: 2px 0px 10px ${theme.boxShadow};
        }

        .search {
          margin: 16px;
        }
        `}</style>
    </div>
  )
}
