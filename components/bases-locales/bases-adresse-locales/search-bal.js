import React from 'react'
import PropTypes from 'prop-types'
import {Search} from 'react-feather'

import theme from '@/styles/theme'

function SearchBAL({value, onChange}) {
  return (
    <div className='search-input-container'>
      {/* disable safari zoom in on focus with font-size at 16px */}
      <input
        value={value}
        onChange={onChange}
        style={{fontSize: '16px'}}
        className='search'
        placeholder='Rechercher une Base adresse locale'
        aria-label='Recherche'
      />
      <span className='iconTitle'><Search /></span>
      <style jsx>{`
          .search-input-container {
            position: relative;
            margin-top: 1em;
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

SearchBAL.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

SearchBAL.defaultProps = {
  value: ''
}

export default SearchBAL
