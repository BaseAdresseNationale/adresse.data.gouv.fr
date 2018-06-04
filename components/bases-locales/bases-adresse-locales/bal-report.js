import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../section'

import Report from '../validator/report'

class BalDataset extends React.Component {
  render() {
    const {report} = this.props
    return (
      <div>
        <Section title={`Rapport d’analyse du fichier :`} />
        {report && <Report report={report} />}
      </div>
    )
  }
}

BalDataset.propTypes = {
  report: PropTypes.object
}

BalDataset.defaultProps = {
  report: null
}

export default BalDataset
