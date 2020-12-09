import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash'
import {Map, Folder, ArrowUp} from 'react-feather'

import theme from '@/styles/theme'

import Mapbox from '@/components/mapbox'
import ExploreSearch from '@/components/explorer/explore-search'
import BanMap from '@/components/mapbox/ban-map'
import LayoutSelector from '@/components/base-adresse-nationale/layout-selector'
import Commune from '@/components/base-adresse-nationale/commune'
import VoiesList from '@/components/base-adresse-nationale/voies-list'

const defaultProps = {
  commune: null,
  voie: null,
  numero: null
}

const propTypes = {
  commune: PropTypes.object,
  voie: PropTypes.object,
  numero: PropTypes.object,
  bbox: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

function SearchMessage() {
  return (
    <div className='search-message'>
      <ArrowUp />
      <h4>Rechercher une adresse</h4>
      <style jsx>{`
        .search-message {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        `}</style>
    </div>
  )
}

export function Mobile({commune, voie, numero, bbox, handleSelect}) {
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedLayout, setSelectedLayout] = useState('map')

  return (
    <div className='ban-container'>
      <ExploreSearch />

      <Mapbox bbox={bbox} switchStyle>
        {({...mapboxProps}) => (
          <BanMap {...mapboxProps} onSelect={handleSelect} />
        )}
      </Mapbox>
      {showOverlay && (
        <div className='overlay' />
      )}

      <div className='explorer'>
        {commune ? (
          <>
            <Commune {...commune} isShowDetails={!voie} />
            <VoiesList voies={orderBy(commune.voies, 'nomVoie', 'asc')} nbVoies={commune.nbVoies} selectedVoie={voie} />
          </>
        ) : <SearchMessage />}
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
          display: flex;
          flex-direction: column;
          height: calc(100vh - 73px);
        }

        .overlay {
          height: 60%;
        }

        .explorer {
          z-index: 998;
          height: calc(100vh - 188px);
          position: absolute;
          top: 56px; // Searchbar height
          bottom: 62px;
          visibility: ${selectedLayout === 'map' ? 'hidden' : 'visible'};
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 0 0.5em;
          overflow: auto;
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

export function Desktop({commune, voie, numero, bbox, handleSelect}) {
  return (
    <div className='ban-container'>
      <div className='sidebar'>
        <div className='search'>
          <ExploreSearch />
        </div>
        {commune ? (
          <>
            <Commune {...commune} isShowDetails={!voie} />
            <VoiesList voies={orderBy(commune.voies, 'nomVoie', 'asc')} nbVoies={commune.nbVoies} selectedVoie={voie} />
          </>
        ) : (
          <SearchMessage />
        )}

        <div className='footer' />
      </div>

      <Mapbox bbox={bbox} switchStyle>
        {({...mapboxProps}) => (
          <BanMap {...mapboxProps} onSelect={handleSelect} />
        )}
      </Mapbox>

      <style jsx>{`
        .ban-container {
          position: relative;
          display: flex;
          height: calc(100vh - 73px);
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          z-index: 1;
          min-width: 400px;
          box-shadow: 2px 0px 10px #0000008a;
          height: calc(100vh - 73px);
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
