import PropTypes from 'prop-types'
import {X} from 'react-feather'

import Button from './button'

function Notification({message, type, style, isFullWidth, onClose, children}) {
  return (
    <>
      <div style={style} className={`notification ${type || ''} ${onClose ? 'closable' : ''} ${isFullWidth ? 'full-width' : ''}`}>
        {onClose && (
          <Button className='close' aria-label='Fermer la notification' onClick={onClose}><X alt='' aria-hidden='true' /></Button>
        )}
        {children || message}
      </div >
      <style jsx>{`
        .notification {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          background: #b4e1fa;
          background: var(--theme-info-bg);
          border: 1px solid #006be6;
          border: 1px solid var(--theme-info-border);
          border-radius: 3px;
          border-radius: var(--theme-border-radius);
          padding: 1em;
          padding: var(--space-s);
          margin-bottom: 1em;
          position: relative;
        }

        .notification .close {
          border: 0;
          background: 0;
          color: currentColor;
          position: absolute;
          right: 1em;
          right: var(--space-s);
        }

        .notification .icon {
          fill: currentColor;
          width: 20px;
          height: 20px;
        }

        .notification.closable {
          padding-right: 3em;
          padding-right: var(--space-xl);
        }

        .notification.full-width {
          width: 100%;
          margin-bottom: 0;
          text-align: center;
          border: 0;
        }

        .notification.full-width.closable .close {
          right: unset;
        }

        .notification.success {
          background: #daf5e7;
          background: var(--theme-success-bg);
          border-color: #03bd5b;
          border-color: var(--theme-success-border);
        }

        .notification.warning {
          background: #fff0e4;
          background: var(--theme-warning-bg);
          border-color: #ff9947;
          border-color: var(--theme-warning-border);
        }

        .notification.error {
          background: rgba(239,172,166,0.45882);
          background: var(--theme-error-bg);
          border-color: #d63626;
          border-color: var(--theme-error-border);
        }
      `}</style>
    </>
  )
}

Notification.defaultProps = {
  message: null,
  type: null,
  style: null,
  onClose: null,
  isFullWidth: false,
  children: null
}

Notification.propTypes = {
  message: PropTypes.node,
  type: PropTypes.oneOf(['success', 'warning', 'error']),
  style: PropTypes.object,
  isFullWidth: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
}

export default Notification
