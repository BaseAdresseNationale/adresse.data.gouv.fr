import React from 'react'
import PropTypes from 'prop-types'
import {Search} from 'react-feather'

import theme from '@/styles/theme'

const SearchBar = React.forwardRef((props, ref) => {
  const {label} = props

  return (
    <>
      {label && (
        <div style={{marginTop: '1em'}}>{label}</div>
      )}
      <div className='search-input-container'>
        {/* disable safari zoom in on focus with font-size at 16px */}
        <input
          {...props}
          ref={ref}
          style={{fontSize: '16px'}}
          className='search'
          aria-label='Recherche'
        />
        <span className='icon-title'><Search alt='' /></span>
        <style jsx>{`
          .search-input-container {
            position: relative;
          }

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

          .icon-title {
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
    </>
  )
})

SearchBar.propTypes = {
  label: PropTypes.string
}

SearchBar.defaultProps = {
  label: null
}

export default SearchBar
