import React from 'react'
import PropTypes from 'prop-types'

function Numero({numero, handleSelect}) {
  return (
    <div onClick={() => handleSelect(numero)}>{numero.numero}</div>
  )
}

Numero.propTypes = {
  numero: PropTypes.shape({
    numero: PropTypes.string.isRequired
  }).isRequired,
  handleSelect: PropTypes.func.isRequired
}

export default Numero
