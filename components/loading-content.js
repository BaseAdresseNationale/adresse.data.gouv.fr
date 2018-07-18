import React from 'react'
import PropTypes from 'prop-types'

import Loader from './loader'
import Notification from './notification'

const LoadingContent = ({loading, error, centered, children}) => {
  if (loading) {
    return (
      <div className={centered ? 'centered' : ''}>
        <Loader />
        Chargement…
        <style jsx>{`
          .centered {
            margin: 1em;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className='error'>
        <Notification message={error.message} type='error' />
        <style jsx>{`
          .error {
            margin: 1em;
          }
        `}</style>
      </div>
    )
  }

  return children
}

LoadingContent.propTypes = {
  loading: PropTypes.bool,
  centered: PropTypes.bool,
  error: PropTypes.object,
  children: PropTypes.node.isRequired
}

LoadingContent.defaultProps = {
  centered: false,
  loading: false,
  error: null
}

export default LoadingContent
