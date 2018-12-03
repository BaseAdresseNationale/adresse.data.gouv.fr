import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '../../../styles/theme'

import Summary from './summary'

class BaseAdresseLocale extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired
  }

  render() {
    const {dataset} = this.props

    return (
      <div className='container'>
        <h3>
          <Link href={`/bases-locales/jeux-de-donnees/${dataset.id}`}>
            <a>{dataset.title}</a>
          </Link>
        </h3>

        <Summary dataset={dataset} />

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
