import React from 'react'
import PropTypes from 'prop-types'
import FaAngleRight from 'react-icons/lib/fa/angle-right'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'

import theme from '../../../../styles/theme'

const COLORS = {
  deleted: theme.errorBg,
  edited: theme.warningBg,
  created: theme.successBg
}

class Item extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    newName: PropTypes.string,
    meta: PropTypes.string,
    status: PropTypes.string,
    warning: PropTypes.string,
    handleClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    newName: null,
    status: null,
    warning: null,
    meta: null
  }

  render() {
    const {name, newName, meta, status, warning, handleClick} = this.props

    return (
      <div className='item' onClick={handleClick}>
        <div className='infos'>
          <div className='name'>
            {newName ? (
              <div className='inline'>
                <div className='line-through'>{name}</div>
                <div><b>{newName}</b></div>
              </div>
            ) : (
              <div><b>{name}</b></div>
            )}
          </div>

          {meta && (
            <div className='meta'>{meta}</div>
          )}

          {warning && (
            <div className='warning'><FaExclamationTriangle /> {warning}</div>
          )}

          <div className='link'><FaAngleRight /></div>

        </div>

        <style jsx>{`
          .item {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-item: center;
            border: 1px solid ${theme.border};
            background-color: ${COLORS[status] || '#fff'};
            padding: 1em;
            margin: 3px 0;
          }

          .item:hover {
            cursor: pointer;
            color: ${theme.colors.white};
            background-color: ${theme.primary};
          }

          .name {
            flex: 1;
            font-size: 18px;
          }

          .line-through {
            text-decoration: line-through;
            margin-right: 2em;
          }

          .infos {
            display: flex;
            flex-grow: 1;
            justify-content: space-between;
            align-items: center;
          }

          .warning {
            color: ${theme.warningBorder};
          }

          .link {
            margin-left: 1em;
          }

          .inline {
            display: flex;
          }

          @media (max-width: 700px) {
            .item {
              flex-direction: column;
              align-items: center;
              flex-flow: wrap;
            }

            .infos {
              flex-direction: column;
            }

            .name {
              font-size: initial;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Item
