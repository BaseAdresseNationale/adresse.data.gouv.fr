import React from 'react'
import PropTypes from 'prop-types'
import FaClose from 'react-icons/lib/fa/close'

import Button from './button'

const Notification = ({message, type, style, fullWidth, onClose, children}) => {
  return (
    <div style={style} className={`notification ${type || ''} ${onClose ? 'closable' : ''} ${fullWidth ? 'full-width' : ''}`}>
      {children || message}
      {onClose && (
        <Button className='close' aria-label='Fermer' onClick={onClose}><FaClose /></Button>
      )}
    </div >
  )
}

Notification.defaultProps = {
  message: null,
  type: null,
  style: null,
  onClose: null,
  fullWidth: false,
  children: null
}

Notification.propTypes = {
  message: PropTypes.node,
  type: PropTypes.oneOf(['success', 'warning', 'error']),
  style: PropTypes.object,
  fullWidth: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
}

export default Notification
