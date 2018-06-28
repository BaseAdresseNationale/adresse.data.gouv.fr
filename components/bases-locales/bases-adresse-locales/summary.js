import React from 'react'
import PropTypes from 'prop-types'

import Organization from './organization'
import Meta from './meta'
import Links from './links'

const Summary = ({id, url, status, licenseLabel, valid, organization, lastUpdate, page, error}) => (
  <div>
    <div className='base-adresse-locale'>
      <div>
        <Organization logo={organization.logo} name={organization.name} />
      </div>
      <div>
        <Meta id={id} status={status} license={licenseLabel} lastUpdate={lastUpdate} valid={valid} error={error} column />
      </div>
      <div>
        <Links url={url} page={page} />
      </div>
    </div>

    <style jsx>{`
      .base-adresse-locale {
        display: flex;
        justify-content: space-between;
        flex-flow: wrap;
        align-items: center;
      }

      .base-adresse-locale div {
        margin: 1em auto;
      }
      `}</style>
  </div>
)

Summary.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  licenseLabel: PropTypes.string.isRequired,
  organization: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  lastUpdate: PropTypes.string.isRequired,
  valid: PropTypes.bool,
  error: PropTypes.object
}

export default Summary
