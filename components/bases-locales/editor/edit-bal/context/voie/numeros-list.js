import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import Notification from '../../../../../notification'

import CreateItemWrapper from '../create-item-wrapper'

import NumeroItem from './numero-item'

class NumerosList extends React.Component {
  state = {
    displayForm: false
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numeros: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  toggleForm = () => {
    this.setState(state => {
      return {
        displayForm: !state.displayForm
      }
    })
  }

  render() {
    const {displayForm} = this.state
    const {codeCommune, codeVoie, numeros, actions} = this.props

    return (
      <div className='numeros-list'>
        <h3>Liste des numéros</h3>
        <div className='divider' />

        <CreateItemWrapper
          title='Création d’un nouveau numéro'
          buttonText='Ajouter un numéro'
          displayForm={displayForm}
          toggleForm={this.toggleForm}
        >
          <Notification
            message='Vous pouvez ajouter un numéro à cette voie directement depuis la carte en effectuant un clique droit.'
          />
        </CreateItemWrapper>

        <div className='list'>
          {Object.keys(numeros).map(n => {
            const numero = numeros[n]
            return (
              <NumeroItem
                key={n}
                codeCommune={codeCommune}
                codeVoie={codeVoie}
                numero={numero}
                actions={actions}
              />
            )
          })}
        </div>

        <style jsx>{`
          .numeros-list {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: content;
            height: 100%;
          }

          h3 {
            line-height: 0;
          }

          .divider {
            width: 100%;
            border-bottom: 1px solid ${theme.border};
          }

          .list {
            flex: auto;
            overflow: scroll;
          }
        `}</style>
      </div>
    )
  }
}

export default NumerosList
