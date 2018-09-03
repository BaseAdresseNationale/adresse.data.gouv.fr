import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import Button from '../../../../button'

import CommuneForm from './commune-form'
import CommunesList from './communes-list'

import {FormContext} from '..'

class Communes extends React.Component {
  state = {
    displayForm: false
  }

  static propTypes = {
    communes: PropTypes.object.isRequired,
    add: PropTypes.func.isRequired
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
    const {displayForm} = this.state
    const {communes} = this.props

    return (
      <div>
        {communes.length > 0 && (
          <h2>Communes</h2>
        )}

        <div className='form'>
          {displayForm ? (
            <FormContext.Consumer>
              {context => (
                <CommuneForm
                  submit={this.handleSubmit}
                  close={this.toggleForm}
                  error={context.error}
                />
              )}
            </FormContext.Consumer>
          ) : (
            <Button onClick={this.toggleForm}><FaPlus /> Commune</Button>
          )}
        </div>

        <CommunesList communes={communes} />

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
