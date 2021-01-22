import React from 'react'
import PropTypes from 'prop-types'

function MapLegends({title, legend}) {
  return (
    <>
      <div className='legend-title'>{title}</div>
      {Object.values(legend).map(({name, color}) => (
        <div className='legend-container' key={name}>
          <div className='legend-color' style={{backgroundColor: `${color}`}} />
          <div>{name}</div>
        </div>
      ))}
      <style jsx>{`
        .legend-title {
          font-weight: bold;
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
    </>
  )
}

MapLegends.propTypes = {
  title: PropTypes.string.isRequired,
  legend: PropTypes.object.isRequired
}

export default MapLegends
