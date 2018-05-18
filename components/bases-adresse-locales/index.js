import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../notification'

import BaseAdresseLocale from './base-adresse-locale'

class BasesAdresseLocales extends React.Component {
  render() {
    const {datasets} = this.props

    return (
      <div>
        <Notification type='info' message='Ne sont répertoriées que les fichiers avec le tag base-adresse-locale sur www.data.gouv.fr' />
        <div className='bases'>
          {datasets.map(dataset => (
            <BaseAdresseLocale key={dataset.id} {...dataset} />
          ))}
        </div>
        <style jsx>{`
          .bases {
            display: grid;
            grid-row-gap: 2em;
            margin: 4em 0;
          }
          `}</style>
      </div>
    )
  }
}

BasesAdresseLocales.propTypes = {
  datasets: PropTypes.array.isRequired
}

export default BasesAdresseLocales
