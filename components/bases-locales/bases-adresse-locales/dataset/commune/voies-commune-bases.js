import React from 'react'
import PropTypes from 'prop-types'

import VoiesTableBases from './voies-table-bases'

class VoiesCommuneBases extends React.Component {
  static propTypes = {
    voies: PropTypes.array
  }

  static defaultProps = {
    voies: []
  }

  render() {
    console.log(this.props)
    const {voies} = this.props

    return (
      <div className='voies'>
        {console.log(voies)}
        <VoiesTableBases voies={voies} />
        <style jsx>{`
          .voies {
            margin-top: 2em;
          }
          `}</style>
      </div>
    )
  }
}

export default VoiesCommuneBases
