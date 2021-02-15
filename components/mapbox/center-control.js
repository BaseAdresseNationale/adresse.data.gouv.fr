import React from 'react'
import PropTypes from 'prop-types'
import {Crosshair} from 'react-feather'

function CenterControl({isDisabled, handleClick}) {
  return (
    <div>
      <button
        disabled={isDisabled}
        type='button'
        className='mapboxgl-ctrl-group mapboxgl-ctrl center-control'
        title='Recentrer la carte sur l’adresse'
        onClick={handleClick}
      >
        <Crosshair size={18} color={isDisabled ? '#cdcdcd' : 'black'} />
      </button>

      <style jsx>{`
        .center-control {
          position: absolute;
          box-shadow: none;
          border: 2px solid #dcd8d5;
          z-index: 2;
          padding: 4px 5px 2px 5px;
          right: 8px;
          top: 80px;
          cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
        }

        .center-control:focus {
          outline: none;
        }

        .center-control:not(:disabled):hover {
          background-color: #f2f2f2
        }
      `}
      </style>
    </div>
  )
}

CenterControl.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
}

CenterControl.defaultProps = {
  isDisabled: false
}

export default CenterControl
