import React from 'react'
import PropTypes from 'prop-types'

import withFetch from '../../hoc/with-fetch'

import {getType} from '../../../lib/types'

import Notification from '../../notification'
import Pie from '../../ui/metrics/pie'

const getColors = items => {
  return Object.keys(items).map(i => getType(i).background)
}

const Statistics = ({sourcesNomsVoies, sourcesPositions}) => {
  const noData = !sourcesNomsVoies && !sourcesPositions

  return (
    <div className='statistics'>
      {noData && (
        <div className='no-data'>
          <Notification message='Aucune donnée disponible' />
        </div>
      )}

      {sourcesNomsVoies && (
        <Pie
          title='Origine des libellés de voie'
          data={sourcesNomsVoies}
          colors={getColors(sourcesNomsVoies)}
        />
      )}

      {sourcesPositions && (
        <Pie
          title='Origine des positions des adresses'
          data={sourcesPositions}
          colors={getColors(sourcesPositions)}
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
  sourcesNomsVoies: null,
  sourcesPositions: null
}

Statistics.propTypes = {
  sourcesNomsVoies: PropTypes.object,
  sourcesPositions: PropTypes.object
}

export default withFetch(data => {
  const {sourcesNomsVoies, sourcesPositions} = data
  return {sourcesNomsVoies, sourcesPositions}
})(Statistics)
