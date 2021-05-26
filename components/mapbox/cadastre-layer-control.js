import React from 'react'
import PropTypes from 'prop-types'
import {Layout} from 'react-feather'
import theme from '@/styles/theme'

function CadastreLayerControl({isActived, handleClick}) {
  return (
    <div>
      <button
        type='button'
        className='mapboxgl-ctrl-group mapboxgl-ctrl cadastre-control'
        title='Activer/Désactiver le cadastre'
        onClick={handleClick}
      >
        <Layout size={18} />
      </button>

      <style jsx>{`
        .cadastre-control {
          position: absolute;
          box-shadow: none;
          border: 2px solid #dcd8d5;
          z-index: 2;
          padding: 4px 5px 2px 5px;
          right: 8px;
          top: 120px;
          background-color: ${isActived ? theme.colors.blue : ''};
        }

        .cadastre-control:focus {
          outline: none;
        }
      `}
      </style>
    </div>
  )
}

CadastreLayerControl.propTypes = {
  isActived: PropTypes.bool.isRequired,
  handleClick: PropTypes
}

export default CadastreLayerControl
