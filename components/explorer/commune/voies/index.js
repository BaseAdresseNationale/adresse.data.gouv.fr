import React from 'react'
import PropTypes from 'prop-types'

import withFetch from '../../../hoc/with-fetch'

import VoiesTable from './voies-table'

class Voies extends React.Component {
  render() {
    const {voies} = this.props

    return (
      <div>
        <div className='head'>
          <h3>Voies de la commune</h3>
          <h5>{voies.length} voies répertoriées</h5>
        </div>

        <VoiesTable voies={voies} />

        <style jsx>{`
            .head {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .loading {
              width: 100%;
              height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            `}</style>
      </div>
    )
  }
}

Voies.propTypes = {
  voies: PropTypes.array
}

Voies.defaultProps = {
  voies: []
}

export default withFetch(data => ({
  voies: data.voies
}))(Voies)
