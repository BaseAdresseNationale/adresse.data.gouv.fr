import React from 'react'
import PropTypes from 'prop-types'
import {Layout} from 'react-feather'

import theme from '@/styles/theme'

function CadastreLayerControl({isDisabled, isActived, handleClick}) {
  return (
    <button
      disabled={isDisabled}
      type='button'
      className='maplibregl-ctrl'
      title={`${isActived ? 'Masquer' : 'Afficher'} le cadastre`}
      onClick={handleClick}
    >
      <Layout color={isDisabled ? '#cdcdcd' : (
        isActived ? theme.primary : theme.darkText
      )} size={18} />
    </button>
  )
}

CadastreLayerControl.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isActived: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default CadastreLayerControl
