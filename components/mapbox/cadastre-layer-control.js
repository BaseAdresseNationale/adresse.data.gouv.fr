import React from 'react'
import PropTypes from 'prop-types'
import {Layout} from 'react-feather'

import theme from '@/styles/theme'

function CadastreLayerControl({isActived, handleClick}) {
  return (
    <button
      type='button'
      className='mapboxgl-ctrl'
      title={`${isActived ? 'Masquer' : 'Afficher'} le cadastre`}
      onClick={handleClick}
    >
      <Layout color={isActived ? theme.primary : theme.darkText} size={18} />
    </button>
  )
}

CadastreLayerControl.propTypes = {
  isActived: PropTypes.bool.isRequired,
  handleClick: PropTypes
}

export default CadastreLayerControl
