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
    const {search} = this.props
    search(event.target.value)
  }

  handleSelect(itemName, item) {
    const {handleSelect} = this.props
    handleSelect(item)
  }

  renderInput(props) {
    const {placeholder} = this.props
    return (
      <div>
        <input className='search' {...props} placeholder={placeholder} />
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
    const {loading} = this.props

    return (
      <div className={`menu ${value.length ? '' : 'hidden'}`}>
        { loading && !items.length ? (
          <div className='item'><Loader /></div>
        ) : items.length === 0 ? (
          <div className='item'>Aucun résultat</div>
        ) : items}
        <style jsx>{`
          .menu {
            margin-right: 100%;
            float: left;
            width: calc(100% - 2px);
            background-color: ${theme.colors.white};
            border: 1px solid ${theme.border};
            border-radius: 5px;
            margin-bottom: 1em;
            outline: none;
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
  }

  render() {
    const {value, results, renderItem, getItemValue, wrapperStyle} = this.props
    return (
      <div className='wrap'>
        <Autocomplete
          value={value}
          inputProps={{id: 'states-autocomplete'}}
          wrapperStyle={wrapperStyle}
          items={results}
          getItemValue={getItemValue}
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

          .menu {
            border-color: red;
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
  handleSelect: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  getItemValue: PropTypes.func.isRequired
}

SearchInput.defaultProps = {
  results: [],
  value: '',
  placeholder: '',
  loading: false,
  wrapperStyle: null
}

export default SearchInput
