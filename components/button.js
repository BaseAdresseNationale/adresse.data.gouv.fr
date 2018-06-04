import PropTypes from 'prop-types'

import theme from '../styles/theme'

const Button = ({children, ...props}) => (
  <button className='button' {...props}>
    {children}

    <style jsx>{`
      button.button,
      button.button:focus,
      button.button:active,
      button.button:visited {
        display: inline-block;
        margin: 0 auto;
        padding: 0.5em 3em;
        color: #fff;
        background-color: ${theme.secondary};
        border-radius: ${theme.borderRadius};
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
        border: 1px solid transparent;
        border-bottom: 2px solid ${theme.primaryDark};
        font-family: "Evolventa", "Trebuchet MS", sans-serif;
        font-size: 1.2em;
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
    `}</style>
  </button>
)

Button.propTypes = {
  children: PropTypes.node
}

Button.defaultProps = {
  children: null
}

export default Button
