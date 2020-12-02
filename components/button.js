import React from 'react'
import PropTypes from 'prop-types'

function Button({size, color, isOutlined, children, ...props}) {
  return (
    <button type='submit' className={`button${isOutlined ? '-outlined' : ''} ${size} ${color}`} {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  size: PropTypes.oneOf([
    'small',
    'large'
  ]),
  color: PropTypes.oneOf([
    'primary',
    'warning-light',
    'warning',
    'secondary'
  ]),
  isOutlined: PropTypes.bool,
  children: PropTypes.node
}

Button.defaultProps = {
  size: null,
  color: 'primary',
  isOutlined: false,
  children: null
}

export default Button
