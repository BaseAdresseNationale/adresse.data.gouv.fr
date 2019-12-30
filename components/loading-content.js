import React from 'react'
import PropTypes from 'prop-types'

import Loader from './loader'
import Notification from './notification'

const LoadingContent = ({loading, error, children}) => {
  if (loading) {
    return (
      <div className='loading-content'>
        <div className='loading'>
          <Loader />
          Chargement…
        </div>
        <style jsx>{`
            .loading-content {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              width: 100%;
            }

            .loading {
              display: flex;
              flex-direction: column;
              align-items: center;
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
  error: PropTypes.object,
  children: PropTypes.node.isRequired
}

LoadingContent.defaultProps = {
  loading: false,
  error: null
}

export default LoadingContent
