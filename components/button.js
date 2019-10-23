import React from 'react'
import PropTypes from 'prop-types'

const Button = ({size, color, isOutlined, type, children, ...props}) => (
  <button type={type} className={`button${isOutlined ? '-outlined' : ''} ${size} ${color}`} {...props}>
    {children}
  </button>
)

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
  type: PropTypes.string,
  children: PropTypes.node
}

Button.defaultProps = {
  size: null,
  color: 'primary',
  isOutlined: false,
  type: 'submit',
  children: null
}

export default Button
