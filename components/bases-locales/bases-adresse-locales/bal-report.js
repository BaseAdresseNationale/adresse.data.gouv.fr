import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../section'

import Report from '../validator/report'

import Header from './dataset/header'

class BalReport extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired
    }),
    report: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  }

  static defaultProps = {
    organization: null
  }

  render() {
    const {report, organization, title} = this.props
    return (
      <Section>
        <Header name={title} logo={organization && organization.logo} />
        <Report report={report} />
      </Section>
    )
  }
}

export default BalReport
