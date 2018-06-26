import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

import Section from '../../../../components/section'

import Meta from '../meta'

import Links from '../links'

import Header from './header'
import Description from './description'
import CommunesPreview from './communes-preview'
import ReportContainer from './report-container'
import ProducerDiscussion from './producer-discussion'

class Dataset extends React.Component {
  static propTypes = {
    report: PropTypes.object,
    dataset: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      license: PropTypes.string.isRequired,
      licenseLabel: PropTypes.string.isRequired,
      organization: PropTypes.object.isRequired,
      page: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      valid: PropTypes.bool,
      error: PropTypes.object
    }).isRequired,
    summary: PropTypes.object.isRequired
  }

  render() {
    const {dataset, summary, report} = this.props
    const {id, title, description, url, status, licenseLabel, valid, organization, page, error} = dataset

    return (
      <div>
        <Section>
          <Header name={organization.name} logo={organization.logo} />
          <Description title={title} description={description} />
          <Meta
            id={id}
            status={status}
            license={licenseLabel}
            valid={valid}
            organization={organization}
            error={error} />

          <CommunesPreview summary={summary} />

          <ReportContainer report={report} datasetId={id} />
          <Links url={url} page={page} />
        </Section>

        <ProducerDiscussion page={page} />

        <style jsx>{`
          .head {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .head img {
            width: 220px;
          }

          .container {
            padding: 0 2em;
            border-left: 5px solid ${theme.primary};
          }

          .base-adresse-locale {
            display: flex;
            justify-content: space-between;
            flex-flow: wrap;
            align-items: center;
          }

          .centered {
            display: flex;
            justify-content: center;
          }
          `}</style>
      </div>
    )
  }
}



Dataset.defaultProps = {
  report: null
}

export default Dataset
