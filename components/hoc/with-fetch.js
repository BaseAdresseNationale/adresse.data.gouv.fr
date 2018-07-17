import React from 'react'
import PropTypes from 'prop-types'
import hoist from 'hoist-non-react-statics'

import LoadingContent from '../loading-content'

export default (mapStateWithProps, options) => Component => {
  mapStateWithProps = mapStateWithProps || (state => state)
  options = options || {}

  const Extended = class extends React.Component {
    static propTypes = {
      promise: PropTypes.instanceOf(Promise)
    }

    static defaultProps = {
      promise: null
    }

    state = {
      loading: true,
      data: null,
      error: null
    }

    async resolvePromise(promise) {
      try {
        const data = mapStateWithProps(await promise)

        this.setState(() => ({
          data,
          loading: false
        }))
      } catch (err) {
        this.setState(() => ({
          error: err,
          loading: false
        }))
      }
    }

    componentDidMount() {
      const {promise} = this.props

      if (promise) {
        this.resolvePromise(promise)
      }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      const {promise} = this.props

      if (newProps.promise && promise !== newProps.promise) {
        this.resolvePromise(newProps.promise)
      }
    }

    render() {
      const {promise, ...props} = this.props
      const {loading, data, error} = this.state

      return (
        <LoadingContent loading={loading} error={error}>
          <Component {...data} {...props} />
        </LoadingContent>
      )
    }
  }

  return hoist(Extended, Component)
}
