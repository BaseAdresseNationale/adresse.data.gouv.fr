import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

const Header = ({title, sort, icon, actived}) => (
  <th onClick={sort}>
    <div className='order-by'>
      <div>{title}</div>
      {icon && <div className={`icon ${actived ? 'active' : ''}`}>
        {icon}
      </div>}
    </div>
    <style jsx>{`
      th {
        border: 1px solid ${theme.border};
        padding: 8px;
      }

      th:hover {
        cursor: pointer;
      }

      tr:nth-child(even) {
        background-color: ${theme.backgroundGrey};
      }

      tr:hover {
        background-color: ${theme.colors.lightGrey};
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

      .icon {
        font-size: 25px;
        color: #ffffff8f;
      }

      .icon.active {
        color: white;
      }
      `}</style>
  </th>
)

Header.propTypes = {
  title: PropTypes.string.isRequired,
  sort: PropTypes.func,
  icon: PropTypes.node,
  actived: PropTypes.bool
}

Header.defaultProps = {
  icon: null,
  actived: false
}

export default Header
