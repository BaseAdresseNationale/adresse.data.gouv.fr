import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import VoieItem from '../item/voie-item'
import ClosablePanel from '../closable-panel'
import NumerosList from '../numeros-list'

import {FormContext} from '..'

class VoieContext extends React.Component {
  static propTypes = {
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      numeros: PropTypes.object
    }).isRequired
  }

  render() {
    const {voie} = this.props
    const {numeros} = voie

    return (
      <div>
        <FormContext.Consumer>
          {context => (
            <Fragment>
              <ClosablePanel title={voie.nomVoie} handleClose={() => context.actions.select(context.commune.code)}>
                <VoieItem
                  codeCommune={context.commune.code}
                  voie={voie}
                  actions={context.actions}
                  error={context.error}
                />
              </ClosablePanel>

              {numeros && Object.keys(numeros).length > 0 ? (
                <div className='voies'>
                  <b>Numéros de : {voie.nomVoie}</b>
                  <NumerosList
                    codeCommune={context.commune.code}
                    codeVoie={voie.codeVoie}
                    numeros={numeros}
                    actions={context.actions}
                  />
                </div>
              ) : (
                <div>Aucun numéro</div>
              )}
            </Fragment>
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

export default VoieContext
