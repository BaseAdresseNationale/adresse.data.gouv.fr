import React from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors'

function Button({size, color, isOutlined, children, ...props}) {
  return (
    <button type='submit' className={`button${isOutlined ? '-outlined' : ''} ${size} ${color}`} {...props}>
      {children}

      <style global jsx>{`
        button:disabled {
          background-color: ${colors.darkGrey};
        }

        button:disabled:hover {
          cursor: not-allowed;
          background-color: ${colors.darkGrey};
        }
        `}</style>
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
