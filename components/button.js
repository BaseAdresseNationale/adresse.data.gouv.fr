import React from 'react'
import PropTypes from 'prop-types'

import theme from '../styles/theme'

const Button = ({size, color, disabled, children, ...props}) => (
  <button className={`button ${size} ${color} ${disabled ? 'disabled' : ''}`} {...props}>
    {children}

    <style jsx>{`
      button.button,
      button.button:focus,
      button.button:active,
      button.button:visited {
        display: inline-block;
        margin: 0 auto;
        color: #fff;
        background-color: ${theme.secondary};
        border-radius: ${theme.borderRadius};
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
        border: 1px solid transparent;
        border-bottom: 2px solid ${theme.primaryDark};
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.25s;
        text-align: center;
      }

      button.button:hover {
        background: ${theme.secondaryDarken};
      }

      button.button:active {
        transform: translateY(2px);
        border-bottom: 0;
        margin-bottom: 2px;
        box-shadow: none;
      }

      button.button.small {
        padding: 0.5em;
        font-size: 1em;
      }

      button.button.regular {
        padding: 0.5em 3em;
        font-size: 1.2em;
      }

      button.button.big {
        padding: 0.8em 3.5em;
        font-size: 1.5em;
      }

      button.button.red {
        background-color: ${theme.colors.red};
        border-bottom-color: #bd254b;
      }

      button.button.red:hover {
        background: #bd254b;
      }

      button.button.green {
        background-color: ${theme.colors.green};
        border-bottom-color: #07ad55;
      }

      button.button.green:hover {
        background: #07ad55;
      }

      button.disabled,
      button.disabled:hover {
        background: #dadada;
        border-bottom-color: #dadada;
        cursor: not-allowed;
      }
    `}</style>
  </button>
)

Button.propTypes = {
  size: PropTypes.oneOf([
    'small',
    'regular',
    'big'
  ]),
  color: PropTypes.oneOf([
    'blue',
    'red',
    'green'
  ]),
  disabled: PropTypes.bool,
  children: PropTypes.node
}

Button.defaultProps = {
  size: 'regular',
  color: 'blue',
  disabled: false,
  children: null
}

export default Button
