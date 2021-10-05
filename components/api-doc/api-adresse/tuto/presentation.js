import React from 'react'
import PropTypes from 'prop-types'
import NotificationApi from '../notification-api'

function Presentation({title, description, icon, tips, warning, children}) {
  return (
    <div className='presentation'>
      <h3><span className='feather-icon'>{icon}</span> {title}</h3>
      <p>{description}</p>
      {children}
      {tips && <NotificationApi message={tips} type='info' />}
      {warning && <NotificationApi message={warning} type='warning' />}
      <style jsx>{`
        .feather-icon {
          vertical-align: middle;
        }
      `}</style>
    </div>
  )
}

Presentation.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  tips: PropTypes.string,
  warning: PropTypes.string,
  children: PropTypes.node
}

Presentation.defaultProps = {
  tips: '',
  warning: '',
  children: null
}

export default Presentation
