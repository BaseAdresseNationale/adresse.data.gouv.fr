import PropTypes from 'prop-types'

import theme from '../styles/theme'

const Loader = ({size}) => (
  <div className={`loader ${size}`}>
    <style jsx>{`
      .loader {
        margin-left: 20px;
        border-radius: 50%;
        animation: spin 2s linear infinite;
      }

      .small {
        border: 2px solid ${theme.colors.white};
        border-top: 2px solid #3498db; /* Blue */
        width: 20px;
        height: 20px;
      }

      .regular {
        border: 4px solid ${theme.colors.white};
        border-top: 4px solid #3498db; /* Blue */
        width: 40px;
        height: 40px;
      }


      .big {
        border: 5px solid ${theme.colors.white};
        border-top: 5px solid #3498db; /* Blue */
        width: 60px;
        height: 60px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

Loader.propTypes = {
  size: PropTypes.oneOf([
    'small',
    'regular',
    'big'
  ])
}

Loader.defaultProps = {
  size: 'regular'
}

export default Loader
