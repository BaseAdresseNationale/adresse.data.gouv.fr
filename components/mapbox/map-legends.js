import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Minimize2, Maximize2} from 'react-feather'

function MapLegends({title, legend}) {
  const [isWrap, setIsWrap] = useState(true)

  return (
    <div className='circle-color-legend'>
      <div className='legend-header'>
        <div className='legend-title'>{title}</div>
        <div className='wrap-icons' onClick={() => setIsWrap(!isWrap)}>
          {isWrap ? (
            <Minimize2 size={18} />
          ) : (
            <Maximize2 size={18} />
          )}
        </div>
      </div>

      {isWrap && Object.values(legend).map(({name, color}) => (
        <div className='legend-container' key={name}>
          <div className='legend-color' style={{backgroundColor: `${color}`}} />
          <div className='legend-name'>{name}</div>
        </div>
      ))}
      <style jsx>{`
        .circle-color-legend {
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

        .legend-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .legend-title {
          font-weight: bold;
        }

        .wrap-icons {
          margin-left: 1em;
          cursor: pointer;
        }

        .legend-container {
          display: flex;
          align-items: center;
        }

        .legend-color {
          width: 10px;
          height: 10px;
          border: 1px solid black;
          border-radius: 50%;
          margin-right: 0.5em;
        }

      `}
      </style>
    </div>
  )
}

MapLegends.propTypes = {
  title: PropTypes.string.isRequired,
  legend: PropTypes.object.isRequired
}

export default MapLegends
