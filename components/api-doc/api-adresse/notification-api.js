import PropTypes from 'prop-types'

import {HelpCircle, AlertTriangle, Check, X} from 'react-feather'

import theme from '../../../styles/theme'

const types = {
  info: {icon: <HelpCircle alt />, title: 'Bon à savoir'},
  success: {icon: <Check alt />, title: 'Réussi'},
  warning: {icon: <AlertTriangle alt />, title: 'Attention'},
  error: {icon: <X alt />, title: 'Erreur'}
}

function NotificationApi({message, type}) {
  return (
    <div className={`notification ${type}`}>
      <h4><div className='feather-icon'>{types[type].icon}</div> {types[type].title}</h4>
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

        .feather-icon {
          display: flex;
          margin-right: 0.18em;
        }

        `}</style>
    </div>
  )
}

NotificationApi.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.PropTypes.oneOf([
    'info', 'success', 'error', 'warning'
  ])
}

NotificationApi.defaultProps = {
  type: 'info'
}

export default NotificationApi
