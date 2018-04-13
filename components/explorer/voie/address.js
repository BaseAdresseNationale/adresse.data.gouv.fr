import PropTypes from 'prop-types'
import MdClose from 'react-icons/lib/md/close'

import theme from '../../../styles/theme'

const Address = ({commune, voie, address, onClose}) => {
  const {numero, positions, sources} = address
  return (
    <div>
      <div className='head'>
        <h4>Numéro {numero}</h4>
        <div className='close' onClick={() => onClose()}><MdClose /></div>
      </div>

      <div>
        <h5>{numero} {voie.nomsVoie[0]} - {commune.code} {commune.nom}</h5>
      </div>

      <div>
        Positions :
        {positions.map((position, idx) => (
          <div key={sources[idx]} className='position'>
            <div className='source'><h5>{sources[idx]}</h5></div>
            <div className='coordinates'>
              {position.coordinates.map(coordinate => (
                <div key={coordinate} className='coordinate'>
                  {coordinate}
                </div>
            ))}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .close {
          font-size: 20px;
          padding: 0px 2px;
        }

        .close:hover {
          color:  ${theme.primary};
          cursor: pointer;
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
        }
        `}</style>
    </div>
  )
}

Address.propTypes = {
  commune: PropTypes.object,
  voie: PropTypes.object,
  address: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    positions: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Address
