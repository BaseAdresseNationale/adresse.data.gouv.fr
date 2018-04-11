import React from 'react'
import PropTypes from 'prop-types'
import hoist from 'hoist-non-react-statics'

import ErrorPage from '../../pages/_error'

export default Page => {
  const Extended = hoist(class extends React.Component {
    static propTypes = {
      error: PropTypes.object
    }

    static defaultProps = {
      error: null
    }

    state = {
      error: null
    }

    componentDidCatch(error) {
      this.setState({
        error
      })
    }

    render() {
      const {error: stateError} = this.state
      const {error: propsError} = this.props

      const error = stateError || propsError

      if (error) {
        return (
          <ErrorPage {...this.props} code={error.code} />
        )
      }

      return (
        <Page {...this.props} />
      )
    }
  }, Page)

  Extended.getInitialProps = async context => {
    if (Page.getInitialProps) {
      try {
        return await Page.getInitialProps(context)
      } catch (err) {
        if (context.res) {
          context.res.statusCode = err.code || 500
        }

        return {
          err
        }
      }
    }

    return {}
  }

  return Extended
}
