import React from 'react'
import Autocomplete from 'react-autocomplete'
import PropTypes from 'prop-types'
import {Search} from 'react-feather'

import theme from '@/styles/theme'

import Loader from '@/components/loader'

function Searchbar({results, setInput, handleSelect, input, isLoading}) {
  const renderMenu = (items, value) => {
    return (
      <div className={`menu ${value.length > 0 ? '' : 'hidden'}`}>
        { isLoading && items.length === 0 ? (
          <div className='loader'><Loader size='small' /></div>
        ) : (items.length === 0 ? (
          <div className='item'>Aucun résultat</div>
        ) : <div className='item'>{items}</div>)}

        <style jsx>{`
          .menu {
            position: absolute;
            box-shadow: 0 1px 4px ${theme.boxShadow};
            z-index: 1;
            width: 100%;
            background-color: ${theme.colors.white};
            border: 1px solid ${theme.border};
            color: ${theme.colors.black};
            border-radius: 0 0 5px 5px;
          }

          .item {
            display: flex;
            flex-flow: column;
          }

          .loader{
            padding: 1em;
          }

          .hidden {
            display: none;
          }
        `}</style>
      </div>
    )
  }

  const renderInput = props => {
    const placeholder = 'Rechercher par nom de commune'
    return (
      <div className='search-input-container'>
        {/* disable safari zoom in on focus with font-size at 16px */}
        <input style={{fontSize: '16px'}} className='search' {...props} placeholder={placeholder} />
        <span className='iconTitle'><Search /></span>
        <style jsx>{`
          .search-input-container {
            position: relative;
            width: 100%;
          }

          .search {
            background-color: ${theme.colors.white};
            border: 1px solid ${theme.border};
            border-radius: 2px 2px 2px 2px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
            color: rgba(0, 0, 0, 0.75);
            display: block;
            font-family: inherit;
            font-size: 16px;
            font-style: italic;
            height: 56px;
            padding: 7px;
            width: 100%;
          }

        .iconTitle {
          display: inline-flex;
          vertical-align: top;
        }

          input {
            text-indent: 2em;
          }

          span {
            position: absolute;
            top: 15px;
            left: 12px;
            font-size: 20px;
            color: ${theme.colors.darkGrey};
          }
        `}</style>
      </div>
    )
  }

  function renderItem({nom, departement}) {
    return (
      <div className='item'>
        <div>{nom}</div>
        <div>
          <span>{departement.code} - {departement.nom}</span>
        </div>

        <style jsx>{`
          .item {
            font-weight: 600;
            padding: 1em;
            display: flex;
            justify-content: space-between;
            color: ${theme.colors.darkerGrey};
            border-bottom: solid 1px ${theme.colors.lighterGrey};
          }

          .item:hover {
            cursor: pointer;
            background-color: ${theme.colors.blue};
            color: ${theme.colors.white};
          }

          span {
            font-style: italic;
          }
        }
          `}</style>
      </div>
    )
  }

  return (
    <div className='search-section-wrapper'>
      <Autocomplete
        items={results}
        onChange={e => {
          setInput(e.target.value)
        }}
        onSelect={(value, item) => handleSelect(item)}
        value={input}
        getItemValue={item => item.nom}
        renderMenu={renderMenu}
        renderInput={renderInput}
        renderItem={renderItem}
      />

      <style jsx>{`
        .search-section-wrapper {
            margin-top: 2.5em;
            display: grid;
        }
      `}</style>
    </div>
  )
}

export default Searchbar

Searchbar.propTypes = {
  results: PropTypes.array,
  code: PropTypes.string,
  nom: PropTypes.string,
  input: PropTypes.string,
  setInput: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}

Searchbar.defaultProps = {
  results: [],
  input: '',
  code: '',
  nom: ''
}
