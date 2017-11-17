import React from 'react'
import Autocomplete from 'react-autocomplete'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const wrapperStyle = {
  width: '100%',
  position: 'fixed',
  zIndex: 2,
  top: '10px'
}

const featuresTypes = {
  housenumber: 'numéro',
  street: 'rue',
  locality: 'lieu-dit',
  hamlet: 'hameau',
  village: 'village',
  city: 'ville',
  commune: 'commune'
}

const SearchInput = ({value, features, loading, search, handleSelect}) => {
  return (
    <div className='wrap'>
      <Autocomplete
        value={value}
        inputProps={{id: 'states-autocomplete'}}
        wrapperStyle={wrapperStyle}
        items={features}
        getItemValue={item => item.properties.label}
        onSelect={(value, feature) => handleSelect(feature)}
        onChange={(e, value) => search(value)}
        renderItem={(item, isHighlighted) => (
          <div key={item.properties.id} className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
            <div>
              <div className='label'>{item.properties.label}</div>
              <div>{item.properties.context}</div>
            </div>
            <div>{featuresTypes[item.properties.type]}</div>
          </div>
        )}
        renderInput={props => <input className='search' {...props} placeholder='Ex. 6 quai de la tourelle cergy…' />}
        renderMenu={(items, value) => (
            <div className={`menu ${value.length ? '' : 'hidden'}`}>
              { loading ? (
                <div className='item'><img src='../../static/loader.gif' /></div>
              ) : items.length === 0 ? (
                <div className='item'>Aucun résultat</div>
              ) : items}
            </div>
        )} />
      <style jsx>{`
        .wrap {
          width: 30%;
          position: absolute;
          top: 150px;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        .search {
          background-color: white;
          border: 1px solid ${theme.border};
          border-radius: 2px 2px 2px 2px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
          color: rgba(0, 0, 0, 0.75);
          display: block;
          font-family: inherit;
          font-size: 14px;
          height: 56px;
          padding: 7px;
          width: 100%;
        }

        .menu {
          float: left;
          width: 100%;
          background-color: ${theme.colors.white};
          border: 1px solid ${theme.border};
          padding: 5px;
          border-radius: 5px;
          outline: none;
        }

        .item {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          padding: 1em;
        }

        .item .label {
          font-weight: 600;
        }

        .item:hover {
          cursor: pointer;
        }

        .item-highlighted {
          background-color: ${theme.primary};
          color: ${theme.colors.white};
        }

        .hidden {
          display: none;
        }

        @media (max-width: 550px) {
          .wrap {
            width: 100%;
            top: 98px;
          }
        }
        `}</style>
    </div>
  )
}

SearchInput.propTypes = {
  features: PropTypes.array,
  value: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired
}

SearchInput.defaultProps = {
  features: [],
  value: ''
}

export default SearchInput
