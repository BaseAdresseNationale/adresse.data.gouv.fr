import PropTypes from 'prop-types'

import theme from '../styles/theme'

const ButtonLink = ({children, ...props}) => (
  <a {...props}>
    {children}

    <style jsx>{`
      a,
      a:focus,
      a:active,
      a:visited {
        display: inline-block;
        margin: 0 auto;
        padding: 0.85em 3em;
        color: ${theme.colors.white};
        background-color: ${theme.primary};
        border-bottom: 1px solid ${theme.border};
        border-radius: 2px;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
        border: 1px solid transparent;
        font-family: Evolventa, 'Trebuchet MS', sans-serif;
        font-size: 1.2em;
        font-weight: bold;
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.25s;
      }

      a:hover {
        background-color: ${theme.secondary};
      }

      a:active {
        transform: translateY(1px);
        border-bottom-color: transparent;
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
