import React from 'react'
import PropTypes from 'prop-types'
import MdClose from 'react-icons/lib/md/close'

import Tag from '../../tag'
import Notification from '../../notification'

import theme from '../../../styles/theme'

const DISTANCE_MAX_POSITION = 15

const Address = ({voie, address, onClose}) => {
  const {numero, entries, destination, active, parcelles, distanceMaxPositions, pseudoNumero} = address

  return (
    <div>
      <div className='head flex-list'>
        <div className='address'>
          <b>{numero}</b> {active && !pseudoNumero && voie.nomVoie}
        </div>
        <div className='close' onClick={() => onClose()}><MdClose /></div>
      </div>

      <div className='cats'>
        <div className='cat'>
          <div>Destination :</div>
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
            <div>Parcelles :</div>
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

      <style jsx>{`
        .flex-list{
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
        }

        .head {
          align-items: baseline;
          border-bottom: 1px solid ${theme.colors.lighterGrey};
        }

        .address {
          font-size: large;
          font-weight: 500;
          padding: 0.5em;
        }

        .close {
          font-size: 20px;
          padding: 0.5em;
        }

        .close:hover {
          color:  ${theme.primary};
          cursor: pointer;
        }

        .cats {
          margin-top: 1em;
        }

        .cat {
          display: grid;
          grid-template-columns: 1fr max-content;
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
      `}</style>
    </div>
  )
}

Address.propTypes = {
  voie: PropTypes.shape({
    nomVoie: PropTypes.string.isRequired
  }),
  address: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    destination: PropTypes.array,
    active: PropTypes.bool.isRequired,
    parcelles: PropTypes.array,
    distanceMaxPositions: PropTypes.number,
    pseudoNumero: PropTypes.bool
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

Address.defaultProps = {
  voie: null
}

export default Address
