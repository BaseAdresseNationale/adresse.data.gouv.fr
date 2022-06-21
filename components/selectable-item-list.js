import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

class SelectableItemList extends React.Component {
  static propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    buttonIcon: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired
  }

  render() {
    const {list, buttonIcon, action} = this.props

    return (
      <div>
        <div className={`${list.length > 0 && 'list selection'}`}>
          {list.map(item => (
            <button
              type='button'
              aria-label={buttonIcon === '+' ? `Séléctionner ${item.value}` : `Désélectionner ${item.value}`}
              key={item.key}
              className='item'
              onClick={() => action(item)}
            >
              <div className='text'>{item.value}</div>
              <div className='button'>{buttonIcon}</div>
            </button>
          ))}
        </div>
        <style jsx>{`
          .list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(auto, 200px));
            grid-gap: 5px;
          }

          .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid ${theme.colors.lightGrey};
            white-space: nowrap;
            width: 100%;
            background: #fff;
          }

          .item:hover {
            cursor: pointer;
          }

          .text {
            overflow: auto;
            text-overflow: ellipsis;
            margin-left: 0.5em;
          }

          .selection {
            margin: 2em 0;
            padding: 0.5em;
            border: 1px dashed #ccc;
            background: #fff;
          }

          .button {
            font-size: larger;
            font-weight: bold;
            text-align: center;
            min-width: 20px;
            color: ${theme.colors.white};
            background-color: ${theme.backgroundColor};
          }
      `}</style>
      </div>
    )
  }
}

export default SelectableItemList
