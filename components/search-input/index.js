import React from 'react'
import Autocomplete from 'react-autocomplete'
import PropTypes from 'prop-types'

import Loader from '../loader'

import theme from '../../styles/theme'

class SearchInput extends React.Component {
  constructor(props) {
    super(props)

    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    this.renderInput = this.renderInput.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
  }

  handleSearch(event) {
    const {onSearch} = this.props
    onSearch(event.target.value)
  }

  handleSelect(itemName, item) {
    const {onSelect} = this.props
    onSelect(item)
  }

  renderInput(props) {
    const {placeholder} = this.props

    return (
      <div>
        {/* disable safari zoom in on focus with font-size at 16px */}
        <input style={{fontSize: '16px'}} className='search' {...props} placeholder={placeholder} />
        <style jsx>{`
          .search {
            background-color: ${theme.colors.white};
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
        `}</style>
      </div>
    )
  }

  renderMenu(items, value) {
    const {loading, fullscreen} = this.props

    return (
      <div className={`menu ${value.length ? '' : 'hidden'} ${fullscreen ? 'fullscreen' : ''}`}>
        { loading && !items.length ? (
          <div className='item'><Loader size='small' /></div>
        ) : items.length === 0 ? (
          <div className='item'>Aucun résultat</div>
        ) : items}
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
            flex-flow: row;
            justify-content: space-between;
            align-items: center;
            padding: 1em;
          }

          .hidden {
            display: none;
          }

          @media (max-width: 399px) {
            .menu {
              width: calc(100% - 40px);
            }

            .fullscreen {
              width: 100%;
            }
          }
        `}</style>
      </div>
    )
  }

  render() {
    const {value, results, renderItem, getItemValue, wrapperStyle} = this.props

    return (
      <div className='wrap'>
        <Autocomplete
          inputProps={{onFocus: this.onFocus}}
          value={value}
          wrapperStyle={wrapperStyle}
          items={results}
          getItemValue={getItemValue}
          isItemSelectable={item => !item.header}
          onSelect={this.handleSelect}
          onChange={this.handleSearch}
          renderItem={renderItem}
          renderInput={this.renderInput}
          renderMenu={this.renderMenu} />

        <style jsx>{`
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
}

SearchInput.propTypes = {
  results: PropTypes.array,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  wrapperStyle: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  getItemValue: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool
}

SearchInput.defaultProps = {
  results: [],
  value: '',
  placeholder: '',
  loading: false,
  wrapperStyle: null,
  fullscreen: false
}

export default SearchInput
