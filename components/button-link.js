import React from 'react'
import PropTypes from 'prop-types'

import theme from '../styles/theme'

const ButtonLink = ({size, color, disabled, children, ...props}) => (
  <a className={`button ${size} ${color} ${disabled ? 'disabled' : ''}`} {...props}>
    {children}

    <style jsx>{`
      a.button,
      a.button:focus,
      a.button:active,
      a.button:visited {
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

      a.button:hover {
        background: ${theme.secondaryDarken};
      }

      a.button:active {
        transform: translateY(2px);
        border-bottom: 0;
        margin-bottom: 2px;
        box-shadow: none;
      }

      a.button.small {
        padding: 0.5em;
        font-size: 1em;
      }

      a.button.regular {
        padding: 0.5em 3em;
        font-size: 1.2em;
      }

      a.button.big {
        padding: 0.8em 3.5em;
        font-size: 1.5em;
      }

      a.button.red {
        background-color: ${theme.colors.red};
        border-bottom-color: #bd254b;
      }

      a.button.red:hover {
        background: #bd254b;
      }

      a.button.green {
        background-color: ${theme.colors.green};
        border-bottom-color: #07ad55;
      }

      a.button.green:hover {
        background: #07ad55;
      }

      a.disabled,
      a.disabled:hover {
        background: #dadada;
        border-bottom-color: #dadada;
        cursor: not-allowed;
      }
    `}</style>
  </a>
)

ButtonLink.propTypes = {
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

ButtonLink.defaultProps = {
  size: 'regular',
  color: 'blue',
  disabled: false,
  children: null
}

export default ButtonLink
