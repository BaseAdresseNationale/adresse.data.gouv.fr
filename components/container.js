import React from 'react'
import PropTypes from 'prop-types'

function Container({children}) {
  return (
    <div className='container'>
      {children}
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node
}

Container.defaultProps = {
  children: null
}

export default Container
