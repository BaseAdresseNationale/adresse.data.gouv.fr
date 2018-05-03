import PropTypes from 'prop-types'
import MdClose from 'react-icons/lib/md/close'

import Tag from '../tag'
import Notification from '../../notification'

import theme from '../../../styles/theme'

const DISTANCE_MAX_POSITION = 15

const Address = ({voie, address, onClose}) => {
  const {numero, entries, destination, active, parcelles, distanceMaxPositions, pseudoNumero} = address

  return (
    <div>
      <div className='head flex-list'>
        <h4>Numéro {numero}</h4>
        <div className='close' onClick={() => onClose()}><MdClose /></div>
      </div>

      {active && !pseudoNumero && <h5>{numero} {voie.nomVoie} - {voie.codeCommune} {voie.nomCommune}</h5>}

      <div className='cats'>
        <div className='cat'>
          <div>Destination :</div>
          {destination ?
            <div className='flex-list'>
              {destination.map(dest => (
                <Tag key={dest} type={dest} />
              ))}
            </div> :
            <div>Inconnu</div>
          }
        </div>

        <div className='cat'>
          <div>Sources :</div>
          <div className='flex-list'>
            {entries.map(entry => (
              <Tag key={entry.source} type={entry.source} />
            ))}
          </div>
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
            Positions :
              {entries.map(entry => (
                <div key={entry.source} className='position'>
                  <div className='source'><h5>{entry.source}</h5></div>
                  <div className='coordinates'>
                    {entry.position.coordinates.map(coordinate => (
                      <div key={coordinate} className='coordinate' >
                        {coordinate}
                      </div>
                    ))}
                  </div>
                </div>
            ))}
          </div>}

      </div>

      {distanceMaxPositions && distanceMaxPositions > DISTANCE_MAX_POSITION ?
        <Notification
          type='warning'
          message={`Les positions de cette adresse sont éloignées de ${Math.round(distanceMaxPositions, 2)}m`} /> :
          null
      }
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

        .close {
          font-size: 20px;
          padding: 0px 2px;
        }

        .close:hover {
          color:  ${theme.primary};
          cursor: pointer;
        }

        .cat {
          margin: 1em 0;
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
          grid-column-gap: 5px;
          margin: 10px 0;
          grid-template-columns: 0.5fr 1fr;
        }

        .source {
          grid-column: 1;
          text-align: center;
          background-color: ${theme.colors.lighterGrey};
         }

        .coordinates {
          grid-column: 2;
          display: grid;
          grid-row-gap: 5px;
          grid-template-rows: 50%;
          text-align: center;
         }

        .coordinate {
          align-self: center;
          padding: 5px;
          background-color: ${theme.colors.lightGrey};
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
    nomVoie: PropTypes.string.isRequired,
    codeCommune: PropTypes.string.isRequired,
    nomCommune: PropTypes.string.isRequired
  }),
  address: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    sources: PropTypes.array.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Address
