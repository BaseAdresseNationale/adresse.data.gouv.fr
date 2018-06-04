import PropTypes from 'prop-types'

import theme from '../styles/theme'

const ButtonLink = ({children, ...props}) => (
  <a className='button' {...props}>
    {children}

    <style jsx>{`
      a.button,
      a.button:focus,
      a.button:active,
      a.button:visited,
      button.button,
      button.button:focus,
      button.button:active,
      button.button:visited {
        display: inline-block;
        margin: 0 auto;
        padding: 0.5em 3em;
        color: ${theme.colors.white};
        background-color: ${theme.secondary};
        border-bottom: 1px solid ${theme.border};
        border-radius: ${theme.borderRadius};
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
        border: 1px solid transparent;
        font-family: "Evolventa", "Trebuchet MS", sans-serif;
        font-size: 1.2em;
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.25s;
        text-align: center;
      }

      a.button:hover,
      button.button:hover {
        text-decoration: none;
        box-shadow: inset 0 0 0 2em ${theme.secondaryDarken};
      }

      a.button:active,
      .button.button:active {
        transform: translateY(1px);
        border-bottom: 0;
      }
    `}</style>
  </a>
)

ButtonLink.propTypes = {
  children: PropTypes.node
}

ButtonLink.defaultProps = {
  children: null
}

export default ButtonLink
