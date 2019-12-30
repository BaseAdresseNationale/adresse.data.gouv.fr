import React, {useState} from 'react'
import PropTypes from 'prop-types'
import FaAngleUp from 'react-icons/lib/fa/angle-up'
import FaAngleDown from 'react-icons/lib/fa/angle-down'

import Tag from '../../tag'
import Notification from '../../notification'

import theme from '../../../styles/theme'

const DISTANCE_MAX_POSITION = 15

const Address = ({address}) => {
  const {entries, destination, parcelles, distanceMaxPositions} = address
  const [displayDetail, setDisplayDetail] = useState(false)
  return (
    <div>
      <div className='head flex-list' onClick={() => setDisplayDetail(!displayDetail)}>
        <div>{displayDetail ? 'Masquer' : 'Afficher'} les informations</div>
        <div>{displayDetail ? <FaAngleDown size={24} /> : <FaAngleUp size={24} />}</div>
      </div>

      {displayDetail && (<div className='details'>
        <div className='cats'>
          <div className='cat'>
            <div>Destination&nbsp;:</div>
            {destination ? (
              <div className='flex-list'>
                {destination.map(dest => (
                  <Tag key={dest} type={dest} />
                ))}
              </div>
            ) : (
              <div>Inconnu</div>
            )}
          </div>

          {parcelles &&
          <div className='cat'>
            <div>Parcelles&nbsp;:</div>
            <div className='flex-list'>
              {parcelles.map(parcelle => (
                <div key={parcelle} className='parcelle'>
                  {parcelle}
                </div>
              ))}
            </div>
          </div>}

          {entries.length > 0 &&
          <div>
            Sources :
            {entries.map(entry => (
              <div key={entry.source} className='position'>
                <Tag key={entry.source} type={entry.source} />
                <div className='coordinates'>
                  {entry.position && (
                    entry.position.coordinates.map(coordinate => (
                      <div key={coordinate} className='coordinate' >
                        {coordinate}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>}

        </div>

        {distanceMaxPositions && distanceMaxPositions > DISTANCE_MAX_POSITION ? (
          <Notification
            type='warning'
            message={`Les positions de cette adresse sont éloignées de ${Math.round(distanceMaxPositions, 2)}m`}
          />
        ) : null}
      </div>
      )}

      <style jsx>{`
        .flex-list{
          display: flex;
          align-items: center;
          flex-flow: wrap;
        }

        .head {
          align-items: flex-end;
          justify-content: space-between;
          border-bottom: ${displayDetail ? `1px solid ${theme.colors.lighterGrey}` : 'none'};
          padding: 0.5em;
        }

        .head > div:first-child {
          margin-right: 0.2em;
        }

        .head:hover {
          cursor: pointer;
        }


        .cats {
          margin-top: 1em;
        }

        .cat {
          display: flex;
          flex-flow: wrap;
          align-items: center;
        }

        .cat .flex-list{
          justify-content: flex-start;
        }

        .parcelle {
          padding: 0.3em 0.5em;
          margin: 2px;
          background-color: ${theme.colors.lighterBlue};
          border: 1px solid ${theme.primary};
        }

        .position {
          display: grid;
          margin: 5px 0;
          grid-template-columns: 56px 1fr;
        }

        .source {
          grid-column: 1;
          text-align: center;
        }

        .coordinates {
          grid-column: 2;
          display: grid;
          grid-row-gap: 2px;
          text-align: center;
        }

        .coordinate {
          align-self: center;
          background-color: ${theme.colors.lighterGrey};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 380px) {
          .head {
            padding: 0.2em;
          }
        }
      `}</style>
    </div>
  )
}

Address.propTypes = {
  address: PropTypes.shape({
    entries: PropTypes.array.isRequired,
    destination: PropTypes.array,
    parcelles: PropTypes.array,
    distanceMaxPositions: PropTypes.number
  }).isRequired
}

export default Address
