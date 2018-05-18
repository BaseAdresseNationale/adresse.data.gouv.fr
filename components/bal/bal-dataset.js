import React from 'react'
import PropTypes from 'prop-types'

import Section from '../section'

import ValidateurReport from '../bal/validateur-report'

class BalDataset extends React.Component {
  render() {
    const {report} = this.props
    return (
      <div>
        <Section title={`Rapport d’analyse du fichier :`} />
        <ValidateurReport report={report} />
      </div>
    )
  }
}

BalDataset.propTypes = {
  report: PropTypes.object.isRequired
}

export default BalDataset
