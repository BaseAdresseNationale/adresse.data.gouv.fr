import React from 'react'
import PropTypes from 'prop-types'

import VoiesTable from './voies-table'

class Voies extends React.Component {
  render() {
    const {data} = this.props

    return (
      <div>
        <div className='head'>
          <h3>Voies de la commune</h3>
          <h5>{data.length} voies répertoriées</h5>
        </div>

        <VoiesTable voies={data} />

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
  data: PropTypes.array
}

Voies.defaultProps = {
  data: []
}

export default Voies
