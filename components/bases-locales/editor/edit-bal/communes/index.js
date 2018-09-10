import React from 'react'
import PropTypes from 'prop-types'

import Head from '../context/head'

import CreateCommune from './create-commune'
import CommunesList from './communes-list'

class Communes extends React.Component {
  state = {
    displayForm: false
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    communes: PropTypes.object,
    reset: PropTypes.func.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Error)
    ])
  }

  static defaultProps = {
    communes: null,
    error: null
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        displayForm: !state.displayForm
      }
    })
  }

  handleSubmit = commune => {
    const {actions} = this.props
    const {addItem} = actions

    addItem(commune)
    this.setState({displayForm: false})
  }

  render() {
    const {displayForm} = this.state
    const {communes, actions, reset, error} = this.props
    const hasCommune = communes && Object.keys(communes).length > 0

    return (
      <div>
        <Head
          name='Communes'
          parent={null}
          previous={() => reset()}
          toggleForm={this.toggleForm}
        >
          {(displayForm || !hasCommune) && (
            <CreateCommune
              submit={this.handleSubmit}
              error={error}
            />
          )}
        </Head>

        {hasCommune && (
          <CommunesList communes={communes} actions={actions} />
        )}
      </div>
    )
  }
}

export default Communes
