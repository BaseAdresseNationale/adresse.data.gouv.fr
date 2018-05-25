import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import Organization from './organization'
import Meta from './meta'
import Links from './links'

class BaseAdresseLocale extends React.Component {
  render() {
    const {id, url, title, status, licenseLabel, valid, organization, page, error} = this.props

    return (
      <div className='container'>
        <h3>{title}</h3>
        <div className='base-adresse-locale'>
          <Organization {...organization} />
          <Meta id={id} status={status} license={licenseLabel} valid={valid} error={error} />
          <Links url={url} page={page} />
        </div>

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
          `}</style>
      </div>
    )
  }
}

BaseAdresseLocale.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  organization: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  licenseLabel: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  error: PropTypes.string,
  valid: PropTypes.bool
}

BaseAdresseLocale.defaultProp = {
  valid: false,
  error: null
}

export default BaseAdresseLocale
