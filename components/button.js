import PropTypes from 'prop-types'

import colors from '@/styles/colors'

function Button({size, color, label, isOutlined, children, ...props}) {
  return (
    <button type='submit' aria-label={label} className={`button${isOutlined ? '-outline' : ''} ${size} ${color}`} {...props}>
      {children}

      <style jsx>{`
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
    'secondary',
    'white'
  ]),
  label: PropTypes.string,
  isOutlined: PropTypes.bool,
  children: PropTypes.node
}

Button.defaultProps = {
  size: null,
  color: 'primary',
  label: null,
  isOutlined: false,
  children: null
}

export default Button
