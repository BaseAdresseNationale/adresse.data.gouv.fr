import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

import Notification from '../../../../notification'

import NumeroForm from './voie/numero-form'

class NumeroContext extends React.Component {
  static propTypes = {
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired,
      modified: PropTypes.object
    }).isRequired,
    bounds: PropTypes.object,
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    bounds: null
  }

  render() {
    const {numero, bounds, actions} = this.props
    const positions = numero.edited ? numero.modified.positions : numero.positions

    return (
      <div>
        {positions.length === 0 && (
          <Notification type='warning'>
            Ce numéro n’a pas de position.
          </Notification>
        )}

        <div className='shadow-box'>
          <NumeroForm
            numero={numero}
            bounds={bounds}
            actions={actions}
          />
        </div>

        <style jsx>{`
          .shadow-box {
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
            padding: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default NumeroContext
