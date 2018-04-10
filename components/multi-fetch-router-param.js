import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'

import api from '../lib/api'

import LoadingContent from './loading-content'

class MultiFetchRouterParam extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const {calls} = this.props
    calls.map(call => this.getData({...call}))
  }

  componentWillReceiveProps() {
    const {calls} = this.props
    calls.map(call => this.getData(call))
  }

  async getData(call) {
    const {name, baseUrl, constructQuery} = call
    const {router} = this.props

    try {
      const result = await api(baseUrl, constructQuery({...router.query}))
      this.setState(state => {
        state.data[name] = result
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
    const {calls, children} = this.props

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {data}))

    return (
      <LoadingContent loading={loading} error={error} centered>
        {Object.keys(data).length === calls.length ?
          childrenWithProps :
          <div />
        }
      </LoadingContent>
    )
  }
}

MultiFetchRouterParam.propTypes = {
  calls: PropTypes.array.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired
}

export default (withRouter(MultiFetchRouterParam))
