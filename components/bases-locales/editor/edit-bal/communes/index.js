import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import Button from '../../../../button'

import CommuneForm from './commune-form'
import CommunesList from './communes-list'

class Communes extends React.Component {
  state = {
    displayForm: false
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    communes: PropTypes.object,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Error)
    ])
  }

  static defaultProps = {
    communes: null,
    error: null
  }

  componentDidMount = () => {
    const {communes} = this.props
    if (!communes) {
      this.setState({displayForm: true})
    }
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        displayForm: !state.displayForm
      }
    })
  }

  handleSubmit = commune => {
    const {communes, actions} = this.props
    const {addItem} = actions

    if (Object.keys(communes).length === 0) {
      this.setState({displayForm: false}) // Close form if it is first commune to be added
    }

    addItem(commune)
  }

  render() {
    const {displayForm} = this.state
    const {communes, actions, error} = this.props

    return (
      <div>
        <h2>Communes</h2>

        <div className='form'>
          {displayForm ? (
            <CommuneForm
              submit={this.handleSubmit}
              close={this.toggleForm}
              error={error}
            />
          ) : (
            <Button onClick={this.toggleForm}><FaPlus /> Commune</Button>
          )}
        </div>

        {communes && (
          <CommunesList communes={communes} actions={actions} />
        )}

        <style jsx>{`
          .form {
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default Communes
