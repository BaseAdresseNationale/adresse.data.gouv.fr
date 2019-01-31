import React from 'react'
import PropTypes from 'prop-types'

import VoiesList from './voies-list'
import EmptyVoiesList from './empty-voies-list'

class CommuneContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      voies: PropTypes.object.isRequired
    }).isRequired,
    addresses: PropTypes.object,
    communeContour: PropTypes.object,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    addresses: null,
    communeContour: null
  }

  render() {
    const {commune, addresses, communeContour, actions} = this.props
    const {voies, code} = commune
    const hasVoies = voies && Object.keys(voies).length > 0

    return (
      <div>
        {hasVoies ? (
          <VoiesList
            voies={voies}
            codeCommune={code}
            bounds={communeContour || addresses}
            actions={actions}
          />
        ) : (
          <EmptyVoiesList addVoie={actions.addItem} />
        ) }
      </div>
    )
  }
}

export default CommuneContext
