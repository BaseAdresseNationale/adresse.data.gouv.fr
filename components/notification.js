import React from 'react'
import PropTypes from 'prop-types'

import {getErrorMsg} from '../lib/error'

import Button from './button'

const Notification = ({message, type, fullWidth, onClose, children}) => {
  return (
    <div className={`notification ${type || ''} ${onClose ? 'closable' : ''} ${fullWidth ? 'full-width' : ''}`}>
      {children || (type === 'error' ? getErrorMsg(message) : message)}
      {onClose && (
        <Button className='close' aria-label='Fermer' onClick={onClose}><FaClose /></Button>
      )}
    </div >
  )
}

Notification.defaultProps = {
  type: null,
  onClose: null,
  fullWidth: false,
  children: null
}

Notification.propTypes = {
  message: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error']),
  fullWidth: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
}

export default Notification
