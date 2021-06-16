import React, {useState, useEffect, useRef, useCallback} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Notification from '@/components/notification'

function Alert({type, message, duration, onClose}) {
  const ref = useRef(null)

  const [alertRoot, setAlertRoot] = useState(null)

  const handleClose = useCallback(() => {
    setAlertRoot(null)
    if (onClose) {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    const alertRoot = document.querySelector('#alert-root')
    if (!ref) {
      alertRoot.append(ref.current)
    }

    setAlertRoot(alertRoot)

    const timeout = setTimeout(() => {
      setAlertRoot(null)
    }, duration)

    return () => {
      clearTimeout(timeout)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!alertRoot) {
    return null
  }

  if (!document) {
    return null
  }

  return ReactDOM.createPortal(
    <div ref={ref} className='alert-container'>
      <div className='alert'>
        <Notification type={type} message={message} onClose={handleClose} />
      </div>

      <style jsx>{`
        .alert-container {
          z-index: 999;
          position: absolute;
          top: 86px;
          width: 100%;
        }

        .alert {
          max-width: 350px;
          margin: 0 auto;
        }
        `}</style>
    </div>,
    alertRoot
  )
}

Alert.defaultProps = {
  type: 'info',
  duration: 5000,
  onClose: null
}

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func
}

export default Alert

