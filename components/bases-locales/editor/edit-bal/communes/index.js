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
    communes: PropTypes.object
  }

  static defaultProps = {
    communes: null
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        displayForm: !state.displayForm
      }
    })
  }

  handleSubmit = async commune => {
    const {actions} = this.props
    const {addItem} = actions
    let error = null

    try {
      await addItem(commune)
    } catch (err) {
      error = err
    }

    this.setState({
      displayForm: Boolean(error),
      error
    })
  }

  render() {
    const {displayForm, error} = this.state
    const {communes, actions} = this.props
    const hasCommune = communes && Object.keys(communes).length > 0

    return (
      <div>
        <Head
          name='Communes'
          parent={null}
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
