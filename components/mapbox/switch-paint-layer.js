import React from 'react'
import PropTypes from 'prop-types'
import {Layers} from 'react-feather'

import colors from '@/styles/colors'

function SwitchPaintLayer({isActive, handleClick}) {
  return (
    <div>
      <button
        type='button'
        className='mapboxgl-ctrl-group mapboxgl-ctrl switch-paint-layer'
        title={`${isActive ? 'Conformité des adresses' : 'Sources des adresses'}`}
        onClick={handleClick}
      >
        <Layers size={18} color={`${isActive ? colors.green : 'black'}`} />
      </button>
      <style jsx>{`
        .switch-paint-layer {
          position: absolute;
          box-shadow: none;
          border: 2px solid #dcd8d5;
          z-index: 2;
          padding: 4px 5px 2px 5px;
          right: 8px;
          top: 120px;
        }

        .switch-paint-layer:focus {
          outline: none;
        }

        .switch-paint-layer:hover {
          background-color: #f2f2f2
        }
      `}
      </style>
    </div>
  )
}

SwitchPaintLayer.propTypes = {
  isActive: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default SwitchPaintLayer
