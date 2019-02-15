import React from 'react'
import PropTypes from 'prop-types'

import VoiesList from './voies-list'
import EmptyVoiesList from './empty-voies-list'

class CommuneContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      voies: PropTypes.object.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {commune, actions} = this.props
    const {voies, code} = commune
    const hasVoies = voies && Object.keys(voies).length > 0

    return (
      <div className='commune-context'>
        {hasVoies ? (
          <VoiesList
            voies={voies}
            codeCommune={code}
            actions={actions}
          />
        ) : (
          <EmptyVoiesList addVoie={actions.addItem} />
        ) }

        <style jsx>{`
          .commune-context {
            width: 100%;
          }
          `}</style>
      </div>
    )
  }
}

export default CommuneContext
