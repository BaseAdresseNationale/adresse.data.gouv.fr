import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Minimize2, Maximize2} from 'react-feather'

function SelectPaintLayer({options, selected, handleSelect, children}) {
  const [isWrap, setIsWrap] = useState(true)

  return (
    <div className='select-paint-container' >
      <div className='select-wrap'>
        <div>
          <label htmlFor='paint-layer'>Choix du thème</label>
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
        </div>
        <div>
          <div className='wrap-icons' onClick={() => setIsWrap(!isWrap)}>
            {isWrap ? (
              <Minimize2 size={18} />
            ) : (
              <Maximize2 size={18} />
            )}
          </div>
        </div>
      </div>
      {isWrap && (
        [children]
      )}
      <style jsx>{`
        .select-paint-container {
          position: absolute;
          box-shadow: none;
          border: 2px solid #dcd8d5;
          border-radius: 4px;
          z-index: 2;
          padding: 4px 5px 2px 5px;
          right: 50px;
          top: 8px;
          background-color: rgba(255, 255, 255, 0.8)
        }

        .select-wrap {
          display: flex;
          justify-content: space-between;
          align-items: start;
        }

        label {
          margin: 0;
        }

        .select-paint-layer {
          margin: 0.5em 0;
        }

        .wrap-icons {
          margin-left: 1em;
          cursor: pointer;
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
