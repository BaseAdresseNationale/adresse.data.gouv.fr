import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../section'

import Report from '../validator/report'

class BalReport extends React.Component {
  render() {
    const {report} = this.props
    return (
      <div>
        <Section title={`Rapport d’analyse du fichier :`} />
        <Report report={report} />
      </div>
    )
  }
}

BalReport.propTypes = {
  report: PropTypes.object
}

BalReport.defaultProps = {
  report: null
}

export default BalReport
