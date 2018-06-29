import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

class SelectCommune extends React.Component {
  static propTypes = {
    communes: PropTypes.array.isRequired,
    handleRemove: PropTypes.func.isRequired
  }

  render() {
    const {communes, handleRemove} = this.props
    return (
      <div>
        <div className={`${communes.length && 'communes selection'}`}>
          {communes.map(commune => (
            <div key={commune.code} className='item' onClick={() => handleRemove(commune)}>
              <div className='commune'>{commune.nom}</div>
              <div className='button'>-</div>
            </div>
          ))}
        </div>
        <style jsx>{`
      .communes {
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
      }

      .item:hover {
        cursor: pointer;
      }

      .commune {
        margin: 0 1em;
      }

      .selection {
        margin: 2em 0;
        padding: 0.5em;
        border: 1px dashed #ccc;
      }

       .button {
        font-size: larger;
        font-weight: bold;
        text-align: center;
        width: 20px;
        color: ${theme.colors.white};
        background-color: ${theme.backgroundColor};
      }
      `}</style>
      </div>
    )
  }
}

export default SelectCommune
