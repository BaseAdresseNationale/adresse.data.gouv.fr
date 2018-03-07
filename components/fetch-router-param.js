import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'

import api from '../lib/api'

import LoadingContent from './loading-content'

class FetchRouterParam extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null
    }
  }

  componentDidMount() {
    const {paramName, router} = this.props

    if (router.query[paramName]) {
      this.getData()
    }
  }

  async getData() {
    const {baseUrl, paramName, constructQuery, router} = this.props
    const param = router.query[paramName]
    this.setState({loading: true})

    try {
      const result = await api(baseUrl, constructQuery(param))
      this.setState(state => {
        state.data = result
      })
    } catch (err) {
      this.setState({
        error: err
      })
    }

    this.setState({loading: false})
  }

  render() {
    const {data, loading, error} = this.state
    const {children} = this.props

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {data}))

    return (
      <LoadingContent loading={loading} error={error}>
        {childrenWithProps}
      </LoadingContent>
    )
  }
}

FetchRouterParam.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  paramName: PropTypes.string.isRequired,
  constructQuery: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired
}

export default (withRouter(FetchRouterParam))
