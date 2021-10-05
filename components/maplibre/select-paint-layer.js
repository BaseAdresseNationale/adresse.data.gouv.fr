import {useState} from 'react'
import PropTypes from 'prop-types'
import {X} from 'react-feather'

function SelectPaintLayer({options, selected, handleSelect, isMobile, children}) {
  const [isWrap, setIsWrap] = useState(true)

  return (
    <div
      className={`select-paint-container ${isMobile && !isWrap ? 'mobile' : ''}`}
      onMouseEnter={() => setIsWrap(false)}
      onMouseLeave={() => setIsWrap(true)}
    >
      <div className='select-wrap'>
        <select
          value={selected}
          name='paint-layer'
          id='paint-layer'
          onChange={e => handleSelect(e.target.value)}
          onClick={() => setIsWrap(false)}
        >
          {Object.keys(options).map(index => (
            <option key={index} value={index}>{options[index].name}</option>
          ))}
        </select>

        {isMobile && !isWrap && (
          <div className='close-icon' onClick={() => setIsWrap(true)}>
            <X />
          </div>
        )}
      </div>

      {!isWrap && (
        <div className='content'>
          {children}
        </div>)}

      <style jsx>{`
        .select-paint-container {
          position: absolute;
          box-shadow: none;
          border: 2px solid #dcd8d5;
          border-radius: 4px;
          z-index: 1;
          padding: 0.5em;
          left: 10px;
          top: 8px;
          background-color: rgba(255,255,255,0.9);
        }

        .mobile {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 999;
        }

        select {
          margin-right: -1em;
          width: 100%;
        }

        .mobile select {
          width: 142px;
        }

        .select-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-width: 150px;
        }

        .close-icon {
          align-items: center;
          font-size: 1.2em;
          margin-right: 1em;
          margin-left: 1em;
          cursor: pointer;
        }

        .content {
          margin-top: 1em;
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
