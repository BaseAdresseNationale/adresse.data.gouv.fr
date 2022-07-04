import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'

import Summary from './summary'

class BaseAdresseLocale extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired
  }

  render() {
    const {dataset} = this.props

    return (
      <div className='bal-container'>
        <div className='link-title'>
          <Link href={`/bases-locales/jeux-de-donnees/${dataset.id}`}>
            <a aria-label={`Consulter le jeu de données ${dataset.title}`}>{dataset.title}</a>
          </Link>
        </div>

        <Summary dataset={dataset} />

        <style jsx>{`
          .link-title {
            font-size: 1.5em;
            margin-bottom: 2em;
            text-align: center;
          }

          .bal-container {
            padding: 1em;
            border-left: 3px solid ${theme.primary};
            border-radius: 0 5px 5px 0;
            background: ${theme.colors.white};
            box-shadow: 0px 5px 8px 1px ${theme.boxShadow};
          }
        `}</style>
      </div>
    )
  }
}

export default BaseAdresseLocale
