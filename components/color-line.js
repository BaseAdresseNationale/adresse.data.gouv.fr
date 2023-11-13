import PropTypes from 'prop-types'

function ColorLine({color, className}) {
  return (
    <>
      <span className={`color-line-wrapper ${className || ''}`}>
        <i className='color-line' />
      </span>
      <style jsx>{`
        .color-line-wrapper {
          display: inline-flex;
          flex-direction: row;
          flex-wrap: nowrap;
          font-size: 1.5rem;
          margin: 0 0.2rem;
          ${color ? `color: ${color};` : ''}
        }
        .color-line {
          width: 1.5rem;
          height: 0.5rem;
          background-color: ${color};
          border-radius: 0.5rem;
        }
      `}</style>
    </>
  )
}

ColorLine.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
}

export default ColorLine
