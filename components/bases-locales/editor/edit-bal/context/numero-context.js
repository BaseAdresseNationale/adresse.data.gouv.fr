import React from 'react'
import PropTypes from 'prop-types'

import {FormContext} from '..'

import Head from './head'

class NumeroContext extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired
    }).isRequired
  }

  render() {
    const {numero} = this.props

    return (
      <div>
        <FormContext.Consumer>
          {context => (
            <Head
              name={numero.numeroComplet}
              parent={context.voie.nomVoie}
              previous={() => context.actions.select(context.commune.code)}
            />
          )}
        </FormContext.Consumer>

        <style jsx>{`
            .voies {
              margin: 2em 0;
            }
        `}</style>
      </div>
    )
  }
}

export default NumeroContext
