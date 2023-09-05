import PropTypes from 'prop-types'

function MapLegends({title, legend, hasBorderRadius}) {
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
          text-align: left;
        }

        .legend-container {
          display: flex;
          align-items: center;
        }

        .legend-color {
          width: 15px;
          height: 15px;
          border-radius: ${hasBorderRadius ? '50%' : ''};
          margin-right: 0.5em;
        }
      `}
      </style>
    </>
  )
}

MapLegends.defaultProps = {
  hasBorderRadius: true
}

MapLegends.propTypes = {
  title: PropTypes.string.isRequired,
  legend: PropTypes.object.isRequired,
  hasBorderRadius: PropTypes.bool
}

export default MapLegends
