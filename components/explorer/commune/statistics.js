import React from 'react'
import PropTypes from 'prop-types'

import withFetch from '../../hoc/with-fetch'

import {getType} from '../../../lib/types'

import Pie from '../../ui/metrics/pie'
import Counter from '../../ui/metrics/counter'

const getColors = items => {
  return Object.keys(items).map(i => getType(i).background)
}

const Statistics = ({sources, destinations, citizensPerAddress}) => {
  return (
    <div className='statistics'>
      <Pie
        title='Répartition des sources'
        data={sources}
        colors={getColors(sources)}
      />

      <Counter title='Habitants par adresse' value={citizensPerAddress} />

      <Pie
        title='Répartition des libellés de voies'
        data={destinations}
        colors={getColors(destinations)}
      />

      <style jsx>{`
        .statistics {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        `}</style>
    </div>
  )
}

Statistics.propTypes = {
  sources: PropTypes.object.isRequired,
  destinations: PropTypes.object.isRequired,
  citizensPerAddress: PropTypes.number.isRequired
}

export default withFetch(data => ({
  ...data
}))(Statistics)

