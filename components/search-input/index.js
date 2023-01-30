import React, {useCallback} from 'react'
import Autocomplete from 'react-autocomplete'
import PropTypes from 'prop-types'

import Loader from '../loader'

import theme from '@/styles/theme'
import SearchBar from '../search-bar'

function SearchInput({onSearch, onSelect, placeholder, isLoading, value, results, renderItem, getItemValue, wrapperStyle, error}) {
  const ref = React.createRef()

  const handleSearch = useCallback(event => {
    onSearch(event.target.value)
  }, [onSearch])

  const handleSelect = useCallback((itemName, item) => {
    onSelect(item)
  }, [onSelect])

  const renderInput = props => {
    const errorProps = error ? {status: 'error', message: error.message} : {}
    return (
      <SearchBar
        ref={ref}
        placeholder={placeholder}
        {...errorProps}
        {...props} />
    )
  }

  const renderMenu = useCallback((items, value) => {
    return (
      <div className={`menu ${value.length > 0 ? '' : 'hidden'}`}>
        { isLoading && items.length === 0 ? (
          <div className='item'><Loader size='small' /></div>
        ) : (items.length === 0 ? (
          <div className='item'>Aucun résultat</div>
        ) : items)}
        <style jsx>{`
          .menu {
            position: absolute;
            box-shadow: 0 1px 4px ${theme.boxShadow};
            z-index: 999;
            width: 100%;
            background-color: ${theme.colors.white};
            border: 1px solid ${theme.border};
            color: ${theme.colors.black};
            border-radius: 0 0 5px 5px;
            top: 2.5em;
          }

          .item {
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            align-items: center;
            padding: 1em;
          }

          .hidden {
            display: none;
          }
        `}</style>
      </div>
    )
  }, [isLoading])

  return (
    <Autocomplete
      value={value}
      wrapperStyle={wrapperStyle}
      items={results}
      getItemValue={getItemValue}
      isItemSelectable={item => !item.header}
      onSelect={handleSelect}
      onChange={handleSearch}
      renderItem={renderItem}
      renderInput={renderInput}
      renderMenu={renderMenu}
    />
  )
}

SearchInput.propTypes = {
  results: PropTypes.array,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
  wrapperStyle: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  getItemValue: PropTypes.func.isRequired,
  error: PropTypes.object,
}

SearchInput.defaultProps = {
  results: [],
  value: '',
  placeholder: '',
  isLoading: false,
  wrapperStyle: null,
  error: null
}

export default SearchInput
