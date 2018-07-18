import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '../../../styles/theme'

import Summary from './summary'

class BaseAdresseLocale extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    organization: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string.isRequired,
    licenseLabel: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    error: PropTypes.string,
    valid: PropTypes.bool
  }

  static defaultProps = {
    valid: false,
    error: null
  }

  render() {
    const {id, url, title, status, count, licenseLabel, valid, organization, error, lastUpdate} = this.props

    return (
      <div className='container'>
        <h3>
          <Link href={`/bases-locales/jeux-de-donnees/${id}`}>
            <a>{title}</a>
          </Link>
        </h3>

        <Summary
          id={id}
          url={url}
          status={status}
          count={count}
          lastUpdate={lastUpdate}
          licenseLabel={licenseLabel}
          valid={valid}
          organization={organization}
          error={error}
        />

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

export default BaseAdresseLocale
