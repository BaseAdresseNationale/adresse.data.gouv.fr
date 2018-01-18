import PropTypes from 'prop-types'

import FaLightbulbO from 'react-icons/lib/fa/lightbulb-o'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'
import FaCheck from 'react-icons/lib/fa/check'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../styles/theme'

const types = {
  info: {icon: <FaLightbulbO />, title: 'Bon à savoir'},
  success: {icon: <FaCheck />, title: 'Réussi'},
  warning: {icon: <FaExclamationTriangle />, title: 'Attention'},
  error: {icon: <FaClose />, title: 'Erreur'}
}

const Notification = ({message, type, style}) => (
  <div style={style} className={`notification ${type}`}>
    <h4><div className='icon'>{types[type].icon}</div> {types[type].title}</h4>
    {message}
    <style jsx>{`
      h4 {
        margin: 0.6em 0;
        display: flex;
        align-items: center;
      }

      .notification {
        color: ${theme.infoBorder};
        background: ${theme.infoBg};
        border: 1px solid ${theme.infoBorder};
        border-radius: ${theme.borderRadius};
        padding: 1em;
        margin-bottom: 1em;
        position: relative;
      }

      .notification.success {
        color: ${theme.successBorder};
        background: ${theme.successBg};
        border: 1px solid ${theme.successBorder};
      }

      .notification.warning {
        color: ${theme.warningBorder};
        background: ${theme.warningBg};
        border: 1px solid ${theme.warningBorder};
      }

      .notification.error {
        color: ${theme.errorBorder};
        background: ${theme.errorBg};
        border: 1px solid ${theme.errorBorder};
      }

      .icon {
        margin: 0 10px 3px 0;
      }
      `}</style>
  </div>
)

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.PropTypes.oneOf([
    'info', 'success', 'error', 'warning'
  ]),
  style: PropTypes.object
}

Notification.defaultProps = {
  type: 'info',
  style: null
}

export default Notification
