import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '../../../styles/theme'

import Summary from './summary'

class BaseAdresseLocale extends React.Component {
  render() {
    const {id, url, title, status, licenseLabel, valid, organization, page, error, lastUpdate} = this.props

    return (
      <div className='container'>
        <h3>
          <Link href={{
            pathname: `/bases-locales/jeux-de-donnees/${id}`,
            asPath: `/bases-locales/jeux-de-donnees/${id}`
          }}>
            <a>{title}</a>
          </Link>
        </h3>

        <Summary
          id={id}
          url={url}
          status={status}
          lastUpdate={lastUpdate}
          licenseLabel={licenseLabel}
          valid={valid}
          organization={organization}
          page={page}
          error={error} />

        <style jsx>{`
          .container {
            padding: 0 2em;
            border-left: 5px solid ${theme.primary};
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
  lastUpdate: PropTypes.string.isRequired,
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
