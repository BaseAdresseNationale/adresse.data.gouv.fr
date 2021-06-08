import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function ParcellesList({parcelles}) {
  return (
    <div className='parcelles'>
      {parcelles.length > 0 ? (
        <div className='parcelles'>
          {parcelles.map(parcelle => (
            <div key={parcelle} className='parcelle'>{parcelle}</div>
          ))}
        </div>
      ) : 'Aucune parcelles cadastrale n’est référencée'}

      <style jsx>{`
        .parcelles {
          display: flex;
          justify-content: space-between;
          flex-flow: wrap;
        }

        .parcelle {
          padding: 0 8px;
          margin: 2px 4px;
          background-color: ${theme.colors.lightGreen};
          color: ${theme.colors.green};
          border-radius: 4px;
          font-weight: 600;
        }
        `}</style>
    </div>
  )
}

ParcellesList.propTypes = {
  parcelles: PropTypes.array.isRequired
}

export default ParcellesList
