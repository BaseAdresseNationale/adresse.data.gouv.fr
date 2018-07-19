import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import Button from '../../../../button'

import CommuneForm from './commune-form'
import CommunesList from './communes-list'

class Communes extends React.Component {
  state = {
    displayForm: false,
    error: null
  }

  static propTypes = {
    communes: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    itemActions: PropTypes.object.isRequired
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        displayForm: !state.displayForm
      }
    })
  }

  handleSubmit = commune => {
    this.setState(() => {
      const {communes, add} = this.props
      let error = null
      let displayForm = false

      if (communes.find(current => current.code === commune.code)) {
        error = new Error('Commune has already been added')
        displayForm = true
      } else {
        add(commune)
      }

      return {
        displayForm,
        error
      }
    })
  }

  render() {
    const {displayForm, error} = this.state
    const {communes, itemActions} = this.props

    return (
      <div>
        {communes.length > 0 && (
          <h2>Communes</h2>
        )}

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

        <CommunesList communes={communes} itemActions={itemActions} />

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
