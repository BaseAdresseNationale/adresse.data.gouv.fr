import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Minimize2, Maximize2, X} from 'react-feather'

function SelectPaintLayer({options, selected, handleSelect, isMobile, children}) {
  const [isWrap, setIsWrap] = useState(true)
  const [isShown, setIsShown] = useState(!isMobile)

  return (
    <div>
      {isMobile && !isShown && (
        <div className='open-paint-selection' >
          <button onClick={() => setIsShown(true)} type='button'>Ouvrir la sélection du thème</button>
        </div>
      )}

      <div className={`select-paint-container ${isMobile && isShown ? 'select-paint-overlay' : ''}`} >
        <div className='select-wrap'>
          <label htmlFor='paint-layer'>Choix du thème</label>
          <div className='icons'>
            {isMobile ? (
              <div onClick={() => setIsShown(false)}>
                <div className='close-icon'>
                  <X />
                </div>
              </div>
            ) : (
              <div onClick={() => setIsWrap(!isWrap)}>
                {isWrap ? (
                  <div className='wrap-icon'>
                    <Minimize2 />
                  </div>
                ) : (
                  <div className='wrap-icon'>
                    <Maximize2 />
                  </div>
                )}
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
      </div>
      <style jsx>{`
        .open-paint-selection {
          position: absolute;
          top: 8px;
          margin-left: 1em;
          width: 200px;
          z-index: 2;
        }

        button {
          padding: 1em;
          color: black;
          background-color: white;
          border: 2px solid #dcd8d5;
          border-radius: 4px;
        }

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
          background-color: rgba(255, 255, 255, 0.9);
          display: ${isShown ? 'block' : 'none'};
        }

        .select-paint-overlay {
          margin: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 999;
        }

        .select-wrap {
          display: flex;
          justify-content: space-between;
          align-items: end;
        }

        label {
          margin: 0;
          font-weight: bold;
        }

        .icons {
          margin-left: 1em;
          cursor: pointer;
        }

        .close-icon {
          margin-right: 1em;
        }

        .wrap-icon {
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
  isMobile: PropTypes.bool,
  children: PropTypes.node.isRequired
}

SelectPaintLayer.defaultProps = {
  isMobile: false
}

export default SelectPaintLayer
