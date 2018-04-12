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
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1em;
        }

        .source {
          text-align: center;
          width: 40%;
          background-color: ${theme.colors.lighterGrey};
        }

        .coordinates {
          display: flex;
          flex-direction: column;
          width: 60%;
          text-align: center;
        }

        .coordinate {
          padding: 2px 4px;
          background-color: ${theme.colors.lightGrey};
          margin: 5px 0px 10px 10px;
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
