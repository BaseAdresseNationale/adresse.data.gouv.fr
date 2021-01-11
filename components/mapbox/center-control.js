import React from 'react'
import PropTypes from 'prop-types'
import {Maximize} from 'react-feather'

function CenterControl({handleClick}) {
  return (
    <div>
      <a title='Centrer l’adresse' onClick={handleClick}>
        <div className='mapboxgl-ctrl-group mapboxgl-ctrl center-control'>
          <Maximize size={18} color='black' />
        </div>
      </a>

      <style jsx>{`
        .center-control {
          position: absolute;
          padding: 0.3em 0.3em 0 0.3em;
          z-index: 2;
          right: 0.7em;
          top: 5.5em;
        }
      `}
      </style>
    </div>
  )
}

CenterControl.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default CenterControl
