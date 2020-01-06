import React from 'react'
import PropTypes from 'prop-types'
import theme from '../../../../../../../styles/theme'

const Header = ({title, sort, icon, isActived}) => (
  <th onClick={sort}>
    <div className='order-by'>
      <div>{title}</div>
      {icon && <div className={`icon ${isActived ? 'active' : ''}`}>
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

      @media (max-width: 460px) {
        .icon {
          display: none;
        }
      }
      `}</style>
  </th>
)

Header.propTypes = {
  title: PropTypes.string.isRequired,
  sort: PropTypes.func,
  icon: PropTypes.node,
  isActived: PropTypes.bool
}

Header.defaultProps = {
  sort: null,
  icon: null,
  isActived: false
}

export default Header
