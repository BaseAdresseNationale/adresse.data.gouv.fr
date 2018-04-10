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
    this.getData()
  }

  componentWillReceiveProps() {
    this.getData()
  }

  async getData() {
    const {baseUrl, constructQuery, router} = this.props
    this.setState({loading: true})

    try {
      const result = await api(baseUrl, constructQuery({...router.query}))
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
      <LoadingContent loading={loading} error={error} centered>
        {data ? childrenWithProps : <div />}
      </LoadingContent>
    )
  }
}

FetchRouterParam.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  constructQuery: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired
}

export default (withRouter(FetchRouterParam))
