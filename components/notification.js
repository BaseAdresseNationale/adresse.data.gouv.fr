import PropTypes from 'prop-types'

import FaLightbulbO from 'react-icons/lib/fa/lightbulb-o'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'
import FaCheck from 'react-icons/lib/fa/check'
import FaClose from 'react-icons/lib/fa/close'

import {getErrorMsg} from '../lib/error'

import theme from '../styles/theme'

const types = {
  info: {icon: <FaLightbulbO />, title: 'Bon à savoir'},
  success: {icon: <FaCheck />, title: 'Réussi'},
  warning: {icon: <FaExclamationTriangle />, title: 'Attention'},
  error: {icon: <FaClose />, title: 'Erreur'}
}

const Notification = ({message, type, style, children}) => (
  <div style={style} className={`notification ${type}`}>
    <h4><div className='icon'>{types[type].icon}</div> {types[type].title}</h4>
    {children || (type === 'error' ? getErrorMsg(message) : message)}
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
  message: PropTypes.string,
  type: PropTypes.PropTypes.oneOf([
    'info', 'success', 'error', 'warning'
  ]),
  style: PropTypes.object,
  children: (props, propName, componentName) => {
    if (props.message) {
      return new Error(
        `message and chidlren properties can not both be supplied to ${componentName}.`
      )
    }
  }
}

Notification.defaultProps = {
  message: '',
  type: 'info',
  style: null,
  children: null
}

export default Notification
