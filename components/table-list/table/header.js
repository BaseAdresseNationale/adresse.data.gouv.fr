import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function Header({title, handleSelect, icon, isActived}) {
  return (
    <th onClick={() => handleSelect(title)}>
      <div className='order-by'>
        <div>{title}</div>
        {icon && <div className={`icon-head ${isActived ? 'active' : ''}`}>
          {icon}
        </div>}
      </div>
      <style jsx>{`
      th {
        border: 1px solid ${theme.border};
        padding: 8px;
      }

      th:hover {
        cursor: ${handleSelect ? 'pointer' : 'auto'};
      }

      th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: ${theme.primary};
        color: white;
      }

      .order-by {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .icon-head {
        font-size: 25px;
        color: #ffffff8f;
      }

      .icon-head.active {
        color: white;
      }

      @media (max-width: 460px) {
        .icon {
          display: none;
        }
      }
      `}</style>
    </th>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  handleSelect: PropTypes.func,
  icon: PropTypes.node,
  isActived: PropTypes.bool
}

Header.defaultProps = {
  handleSelect: null,
  icon: null,
  isActived: false
}

export default Header
