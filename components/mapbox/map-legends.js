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
          width: 80%;
          margin-bottom: 0.5em;
        }

        .legend-container {
          display: flex;
          align-items: center;
        }

        .legend-color {
          width: 15px;
          height: 15px;
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
