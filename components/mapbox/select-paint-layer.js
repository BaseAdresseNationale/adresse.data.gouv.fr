import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Minimize2, Maximize2} from 'react-feather'

function SelectPaintLayer({options, selected, handleSelect, children}) {
  const [isWrap, setIsWrap] = useState(true)

  return (
    <div className='select-paint-container' >
      <div className='select-wrap'>
        <label htmlFor='paint-layer'>Choix du thème</label>
        <div className='wrap-icons' onClick={() => setIsWrap(!isWrap)}>
          {isWrap ? (
            <div className='icon'>
              <Minimize2 />
            </div>
          ) : (
            <div className='icon'>
              <Maximize2 />
            </div>
          )}
        </div>
      </div>

      {isWrap && (
        <select
          value={selected}
          className='select-paint-layer'
          name='paint-layer'
          id='paint-layer'
          onChange={e => handleSelect(e.target.value)}
        >
          {Object.keys(options).map(index => (
            <option key={index} value={index}>{options[index].name}</option>
          ))}
        </select>
      )}
      {isWrap && (
        [children]
      )}
      <style jsx>{`
        .select-paint-container {
          position: absolute;
          box-shadow: none;
          width: 300px;
          border: 2px solid #dcd8d5;
          border-radius: 4px;
          z-index: 1;
          padding: 1em;
          margin-left: 1em;
          top: 8px;
          background-color: rgba(255, 255, 255, 0.9)
        }

        .select-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        label {
          margin: 0;
          font-weight: bold;
        }

        .wrap-icons {
          margin-left: 1em;
          cursor: pointer;
        }

        .icon {
          display: flex;
          align-items: center;
          font-size: 1.2em;
        }

        .select-paint-layer {
          margin: 0.5em 0;
        }
      `}
      </style>
    </div>
  )
}

SelectPaintLayer.propTypes = {
  options: PropTypes.object.isRequired,
  selected: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

export default SelectPaintLayer
