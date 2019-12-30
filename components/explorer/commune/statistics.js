import React from 'react'
import PropTypes from 'prop-types'

import withFetch from '../../hoc/with-fetch'

import {getType} from '../../../lib/types'

import Notification from '../../notification'
import Pie from '../../ui/metrics/pie'
import Counter from '../../ui/metrics/counter'

const getColors = items => {
  return Object.keys(items).map(i => getType(i).background)
}

const Statistics = ({sources, destinations, citizensPerAddress}) => {
  const noData = !sources && !destinations && !citizensPerAddress

  return (
    <div className='statistics'>
      {noData && (
        <div className='no-data'>
          <Notification message='Aucune donnée disponible' />
        </div>
      )}

      {sources && (
        <Pie
          title='Répartition des sources'
          data={sources}
          colors={getColors(sources)}
        />
      )}

      {citizensPerAddress && (
        <Counter title='Habitants par adresse' value={citizensPerAddress} />
      )}

      {destinations && (
        <Pie
          title='Répartition des libellés de voies'
          data={destinations}
          colors={getColors(destinations)}
        />
      )}

      <style jsx>{`
        .statistics {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 100%;
        }

        .no-data {
          margin: 1em;
        }

        @media (max-width: 749px) {
          .no-data {
            display: none;
          }
        }
        `}</style>
    </div>
  )
}

Statistics.defaultProps = {
  sources: null,
  destinations: null,
  citizensPerAddress: null
}

Statistics.propTypes = {
  sources: PropTypes.object,
  destinations: PropTypes.object,
  citizensPerAddress: PropTypes.number
}

export default withFetch(data => ({
  ...data
}))(Statistics)

