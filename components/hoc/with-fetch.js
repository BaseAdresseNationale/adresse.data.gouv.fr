import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import hoist from 'hoist-non-react-statics'

import LoadingContent from '../loading-content'

export default (mapStateWithProps, options) => Component => {
  mapStateWithProps = mapStateWithProps || (state => state)
  options = options || {}

  const Extended = ({promise, ...props}) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
      const resolvePromise = async promise => {
        try {
          const data = mapStateWithProps(await promise)

          setData(data)
        } catch (err) {
          setError(err)
        }

        setLoading(false)
      }

      if (promise) {
        resolvePromise(promise)
      }
    }, [promise])

    return (
      <LoadingContent loading={loading} error={error}>
        <Component {...data} {...props} />
      </LoadingContent>
    )
  }

  Extended.propTypes = {
    promise: PropTypes.instanceOf(Promise)
  }

  Extended.defaultProps = {
    promise: null
  }

  return hoist(Extended, Component)
}
