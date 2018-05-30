import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import Section from '../../../components/section'
import ButtonLink from '../../button-link'

import ReportContainer from './report-container'
import Summary from './summary'

class Dataset extends React.Component {
  render() {
    const {dataset, report} = this.props
    const {id, url, title, description, status, licenseLabel, valid, organization, page, error} = dataset

    return (
      <div>
        <Section background='color'>
          <h1>{title}</h1>
          <p>{description}</p>
        </Section>

        <Section background=''>
          <Summary
            id={id}
            url={url}
            status={status}
            licenseLabel={licenseLabel}
            valid={valid}
            organization={organization}
            page={page}
            error={error} />
        </Section>

        <Section>
          <ReportContainer report={report} datasetId={id} />
        </Section>

        <Section title='Un problème à signaler ?' subtitle='Ou une question à poser ?' background='dark'>
          <div className='centered'>
            <ButtonLink href={page}>Ouvrir une discussion avec le producteur</ButtonLink>
          </div>
        </Section>

        <style jsx>{`
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

Dataset.propTypes = {
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
  }).isRequired
}

Dataset.defaultProps = {
  report: null
}

export default Dataset
